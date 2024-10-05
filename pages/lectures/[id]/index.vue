<script setup lang="ts">
import dayjs from 'dayjs';
import { ref } from 'vue';
import type { FetchErrorWithMessage, LectureModel } from '~/types/api';
import ImagePlaceholder from '@images/image_placeholder.png';
import UserAvatar from '~/components/ui/UserAvatar.vue';

const route = useRoute();
const lectureId = route.params.id as string;
const loading = ref(false);
const lectureData = ref<LectureModel | null>(null);

const { $api, $toast } = useNuxtApp();

async function fetchLectureData()
{
    try
    {
        loading.value = true;

        const { data } = await useAsyncData(() => $api.get<LectureModel>(`lectures/${lectureId}`)); // Fetch lecture data

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

await fetchLectureData();

const currentTime = ref(dayjs());

const isLectureLive = computed(() =>
{
    if (lectureData.value)
    {
        const startTime = dayjs(lectureData.value.startTime);
        const endTime = dayjs(lectureData.value.endTime);

        return currentTime.value.isAfter(startTime) && currentTime.value.isBefore(endTime);
    }

    return false;
});
</script>

<template>
    <section v-if="lectureData" class="lecture-details">
        <div class="details-info">
            <h1>{{ lectureData.title }}</h1>

            <div class="info-block">
                <p v-if="lectureData.description" class="description">
                    {{ lectureData.description }}
                </p>
                <p><strong>Starts:</strong> {{ dayjs(lectureData.startTime).format('DD MMMM YYYY, HH:mm') }}</p>
                <p><strong>Ends:</strong> {{ dayjs(lectureData.endTime).format('DD MMMM YYYY, HH:mm') }}</p>

                <div class="speaker">
                    <h3>Speaker:</h3>
                    <UserAvatar :image-url="lectureData.speaker.image || ImagePlaceholder" alt="speaker-avatar" :size="100" />
                    <p>{{ lectureData.speaker.email }}</p>
                </div>
            </div>
        </div>
    </section>
    <section class="live-chat">
        <h2>Lecture live chat</h2>
        <div v-if="isLectureLive">
            <!-- // chat available here -->
        </div>
        <div v-else>
            <small>The live chat will be accessible when the lecture starts.</small>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.lecture-details {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
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
</style>
