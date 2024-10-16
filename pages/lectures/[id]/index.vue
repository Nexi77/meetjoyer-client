<script setup lang="ts">
import { ref } from 'vue';
import type { EventModel, FetchErrorWithMessage, LectureModel } from '~/types/api';
import ImagePlaceholder from '@images/image_placeholder.png';
import UserAvatar from '~/components/ui/UserAvatar.vue';

const route = useRoute();
const lectureId = route.params.id as string;
const loading = ref(false);
const lectureData = ref<LectureModel | null>(null);
const eventData = ref<EventModel | null>(null);
const authStore = useAuthStore();
const currentTime = ref(new Date().toISOString());
let intervalId: NodeJS.Timeout;

const { $api, $toast } = useNuxtApp();

async function fetchLectureData()
{
    try
    {
        loading.value = true;

        const { data } = await useAsyncData(() => $api.get<LectureModel>(`lectures/${lectureId}`));

        lectureData.value = data.value;
    }
    catch (error)
    {
        const { message } = useCustomError(error as FetchErrorWithMessage);

        if (message) $toast.error(message);
    }
    finally
    {
        loading.value = false;
    }
}

async function fetchEventData()
{
    try
    {
        loading.value = true;

        const { data } = await useAsyncData(() => $api.get<EventModel>(`events/${lectureData.value?.eventId}`));

        eventData.value = data.value;
    }
    catch (error)
    {
        const { message } = useCustomError(error as FetchErrorWithMessage);

        if (message) $toast.error(message);
    }
    finally
    {
        loading.value = false;
    }
}

await fetchLectureData();
await fetchEventData();

const canJoin = computed(() =>
{
    if (lectureData.value)
    {
        return !lectureData.value.participants.some(participant => participant.id === authStore.user?.id);
    }

    return true;
});

const eventFinished = computed(() =>
{
    if (eventData.value)
    {
        const startDate = new Date(eventData.value.startDate);
        const endDate = new Date(eventData.value.endDate);
        const currentDate = new Date(currentTime.value);

        return !((currentDate >= startDate) && (currentDate <= endDate));
    }

    return false;
});

async function joinLecture()
{
    try
    {
        loading.value = true;
        await $api.post('lectures/signin', { lectureId: lectureData.value?.id });
        await fetchLectureData();
    }
    catch (error)
    {
        const { message } = useCustomError(error as FetchErrorWithMessage);

        if (message) $toast.error(message);
    }
    finally
    {
        loading.value = false;
    }
}

async function disconnectFromLecture()
{
    try
    {
        loading.value = true;
        await $api.post('lectures/signout', { lectureId: lectureData.value?.id });
        await fetchLectureData();
    }
    catch (error)
    {
        const { message } = useCustomError(error as FetchErrorWithMessage);

        if (message) $toast.error(message);
    }
    finally
    {
        loading.value = false;
    }
}

const canChatBeShown = computed(() =>
{
    if (lectureData.value)
    {
        return (lectureData.value.participants.some(participant => participant.id === authStore.user?.id) || lectureData.value.speaker.id === authStore.user?.id) && !eventFinished.value;
    }

    return false;
});

onMounted(() =>
{
    intervalId = setInterval(() =>
    {
        currentTime.value = new Date().toISOString();
    }, 1000);
});

onUnmounted(() =>
{
    clearInterval(intervalId);
});
</script>

<template>
    <template v-if="lectureData">
        <section class="lecture-details">
            <div class="details-info">
                <h1>{{ lectureData.title }}</h1>
                <div class="info-block">
                    <p v-if="lectureData.description" class="description">
                        {{ lectureData.description }}
                    </p>
                    <div class="speaker">
                        <h3>Speaker:</h3>
                        <UserAvatar :image-url="lectureData.speaker.image || ImagePlaceholder" alt="speaker-avatar" :size="100" />
                        <p>{{ lectureData.speaker.email }}</p>
                    </div>
                    <div v-if="lectureData.participants" class="label-with-icon">
                        <div class="icon-circle">
                            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="#000000" /> <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="#000000" /> </g></svg>
                        </div>
                        People joined: {{ lectureData.participants.length }}
                    </div>
                    <div class="actions">
                        <div v-if="canJoin" class="join">
                            <span>Want to take part?: </span>
                            <button type="button" class="asset-button" style="width: min-content;" @click="joinLecture">
                                Join
                            </button>
                        </div>
                        <div v-if="!canJoin" class="join">
                            <span>Decided to let it go?: </span>
                            <button type="button" class="asset-button" style="width: min-content;" @click="disconnectFromLecture">
                                Disconnect
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="live-chat">
            <h2>Lecture live chat</h2>
            <div v-if="canChatBeShown">
                <Chat :lecture-id="lectureData.id" />
            </div>
            <div v-else>
                <small>The live chat will be accessible when the lecture starts and if you're one of it's participants</small>
            </div>
        </section>
    </template>
</template>

<style lang="scss" scoped>
.lecture-details {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 20px;
}

.icon-circle {
    background-color: var(--white-400);
    width: 45px;
    height: 45px;

    svg {
        width: 25px;

        path {
            fill: var(--primary-400);
        }
    }

    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%
}

.details-info {
  display: flex;
  flex-direction: column;
  gap: 20px;

  h1 {
    font-size: 2rem;
    font-weight: bold;
  }

  .info-block {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .description {
      font-style: italic;
      color: var(--asset-300);
    }

    .speaker {
      display: flex;
      align-items: center;
      gap: 10px;

      img {
        border-radius: 50%;
      }

      h3 {
        margin-bottom: 5px;
      }
    }
  }
}

.live-chat {
  background-color: var(--primary-100);
  padding: 20px;
  border-radius: var(--base-radius);
  max-width: 800px;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: var(--base-radius);
    border: 1px solid var(--primary-300);
  }

  button {
    background-color: var(--primary-500);
    color: white;
    padding: 10px;
    border-radius: var(--base-radius);
    cursor: pointer;

    &:hover {
      background-color: var(--primary-600);
    }
  }
}

.actions {
  & .join, &.disconnect {
    display: flex;
    gap: 10px;
    align-items: center;
  }
}
</style>
