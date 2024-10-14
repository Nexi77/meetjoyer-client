import { io } from 'socket.io-client';
import type { FetchedMessage, MessageContent } from '~/types/global';

export function useLectureChat(lectureId: number, user: UserData | null)
{
    const messages = ref<MessageContent[]>([]);
    const isTyping = ref(false);
    const typingUserId = ref<number | null>(null);
    const typingTimeout = ref<NodeJS.Timeout | null>(null);

    const page = ref(1);
    const limit = 10;
    const hasMoreMessages = ref(true);
    const chatContainer = ref<HTMLElement | null>(null);

    const parsedLectureId = String(lectureId);
    const { public: { apiUrl } } = useRuntimeConfig();
    const socket = io(`${apiUrl}/lecture-chat`, {
        query: { lectureId: parsedLectureId }
    });

    socket.on('receiveMessage', (content: MessageContent) =>
    {
        messages.value.push(content);
    });

    socket.on('loadMessages', (fetchedMessages: FetchedMessage[]) =>
    {
        if (fetchedMessages.length < limit)
        {
            hasMoreMessages.value = false;
        }

        if (chatContainer.value)
        {
            const parsedFetchedMessages = fetchedMessages.map(message => ({ text: message.text, timestamp: message.createdAt, user: message.user }));
            const currentScrollHeight = chatContainer.value.scrollHeight;

            messages.value = [...parsedFetchedMessages.reverse(), ...messages.value];
            setTimeout(() =>
            {
                chatContainer.value!.scrollTop = chatContainer.value!.scrollHeight - currentScrollHeight;
            }, 0);
        }
    });

    socket.on('userTyping', ({ userId }: { userId: number }) =>
    {
        typingUserId.value = userId;
        isTyping.value = true;
    });

    socket.on('userStoppedTyping', () =>
    {
        isTyping.value = false;
        typingUserId.value = null;
    });

    const emitTypingEvent = () =>
    {
        socket.emit('userTyping', { lectureId: parsedLectureId, userId: user?.id });

        if (typingTimeout.value) clearTimeout(typingTimeout.value);

        typingTimeout.value = setTimeout(() =>
        {
            socket.emit('userStoppedTyping', { lectureId: parsedLectureId, userId: user?.id });
        }, 1000);
    };

    const sendMessage = (message: string) =>
    {
        socket.emit('sendMessage', { lectureId: parsedLectureId, text: message, user });
        socket.emit('userStoppedTyping', { lectureId: parsedLectureId, userId: user?.id });
    };

    const fetchInitialMessages = () =>
    {
        socket.emit('fetchMessages', { lectureId: parsedLectureId, page: page.value, limit });
    };

    const loadMoreMessages = () =>
    {
        if (!hasMoreMessages.value) return;

        page.value += 1; // Increment page number
        socket.emit('fetchMessages', { lectureId: parsedLectureId, page: page.value, limit });
    };

    onMounted(() =>
    {
        chatContainer.value = document.getElementById('chat-messages');
        fetchInitialMessages();

        if (chatContainer.value)
        {
            chatContainer.value.addEventListener('scroll', () =>
            {
                if (chatContainer.value?.scrollTop === 0 && hasMoreMessages.value)
                {
                    loadMoreMessages(); // Load more messages when scrolled to the top
                }
            });
        }
    });

    onBeforeUnmount(() =>
    {
        socket.disconnect();
    });

    return {
        messages,
        sendMessage,
        isTyping,
        emitTypingEvent,
        typingUserId
    };
}
