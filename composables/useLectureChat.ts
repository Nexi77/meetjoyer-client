import { io } from 'socket.io-client';
import type { MessageContent } from '~/types/global';

export function useLectureChat(lectureId: number, user: UserData | null)
{
    const messages = ref<MessageContent[]>([]);
    const isTyping = ref(false);
    const typingUserId = ref<number | null>(null);
    const typingTimeout = ref<NodeJS.Timeout | null>(null);

    const parsedLectureId = String(lectureId);
    const { public: { apiUrl } } = useRuntimeConfig();
    const socket = io(`${apiUrl}/lecture-chat`, {
        query: { lectureId: parsedLectureId }
    });

    socket.on('receiveMessage', (content: MessageContent) =>
    {
        messages.value.push(content);
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
