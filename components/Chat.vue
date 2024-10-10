<script setup lang="ts">
interface Props {
    lectureId: number;
}

const props = defineProps<Props>();
const authStore = useAuthStore();

const { messages, sendMessage, emitTypingEvent, isTyping, typingUserId } = useLectureChat(props.lectureId, authStore.user);

const newMessage = ref('');
const chat = ref<HTMLDivElement | null>(null);

const handleSendMessage = () =>
{
    if (newMessage.value.trim() !== '')
    {
        sendMessage(newMessage.value);
        newMessage.value = '';
    }
};

const scrollToBottomOfChat = () =>
{
    nextTick(() =>
    {
        if (chat.value)
        {
            chat.value.scrollTo({
                top: chat.value.scrollHeight,
                behavior: 'smooth'
            });
        }
    });
};

watch(() => messages.value.length, () => scrollToBottomOfChat());
</script>

<template>
    <div class="chat-container">
        <div ref="chat" class="chat-messages" :class="{ 'messages-list': messages.length }">
            <p v-if="!messages.length">
                No message was sent yet
            </p>
            <div v-for="(message) in messages" :key="message.user.id" class="chat-message" :class="{ 'self-message': authStore.user?.id === message.user.id }">
                <span class="message-author">{{ authStore.user?.id === message.user.id ? 'Me' : message.user.email }}</span>
                <span class="message-content">{{ message.text }}</span>
            </div>
        </div>
        <form class="chat-send-zone" @submit.prevent="handleSendMessage">
            <div v-if="isTyping" class="typing-indicator">
                Someone is typing...
            </div>
            <input v-model="newMessage" type="text" placeholder="Type a message..." @input="emitTypingEvent">
            <button type="submit" class="asset-button">
                Send
            </button>
        </form>
    </div>
</template>

<style scoped lang="scss">
.chat-container {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .chat-messages {
        background-color: var(--white-400);
        padding: 1rem;
        border-radius: var(--base-radius);
        color: var(--primary-400);
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;

        &.messages-list {
            height: 400px;
            max-height: 400px;
            overflow: auto;
        }

        p {
            align-self: center;
            margin: 0;
        }
    }

    .typing-indicator {
        font-size: small;
        text-align: right;
        position: absolute;
        top: -5px;
        right: 0;
    }

    .chat-message {
        padding: 5px 10px;
        border-radius: 10px;
        color: var(--white-400);
        background-color: var(--primary-400);
        display: inline-flex;
        flex-direction: column;
        gap: 5px;

        .message-author {
            font-size: small;
            color: var(--primary-200);
        }

        &.self-message {
            background-color: var(--asset-400);
            align-self: flex-end;

                .message-author {
                    color: var(--primary-400);
                }
        }

    }

    input {
        padding: 1em;
        border-radius: var(--base-radius);
        color: var(--primary-400);
        border: 0;
    }

    .chat-send-zone {
        display: flex;
        position: relative;
        padding-top: 20px;
        flex-direction: column;
        gap: 10px;
    }
}
</style>
