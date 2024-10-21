<script lang="ts" setup>
import type { FetchErrorWithMessage, LectureModel } from '~/types/api';
import type { PaginatedResource } from '~/types/pagination';

const loading = ref(false);
const storeApp = useAppStore();
const lecturesData = ref<LectureModel[]>([]);
const route = useRoute();
const page = Number(route.query.page) || 1;
const fileFetching = ref(false);
const authStore = useAuthStore();
const { $api, $toast } = useNuxtApp();

createPager('speaker-lectures', page, null, 'startDate');

const pager = computed(() => storeApp.pagers['speaker-lectures']);
const speakerId = computed(() => authStore.user?.id);

async function fetchLectures(filters?: Record<string, unknown>)
{
    try
    {
        loading.value = true;

        const { data } = await useAsyncData(`lectures-list-speaker-${speakerId.value}`, () => $api.get<PaginatedResource<LectureModel>>('lectures', { page: pager.value?.page, limit: 10, speakerId: speakerId.value, ...filters }));

        if (!data.value)
            return;

        lecturesData.value = data.value?.data;
        updatePager('speaker-lectures', data.value);
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

async function getQuestionsFile(event: Event)
{
    const target = event.target as HTMLButtonElement;
    const lectureId = target.dataset.id;

    if (lectureId)
    {
        try
        {
            fileFetching.value = true;

            await downloadLecturePdf(lectureId);
        }
        catch (error)
        {
            const { message } = useCustomError(error as FetchErrorWithMessage);

            if (message) $toast.error(message);
        }
        finally
        {
            fileFetching.value = false;
        }
    }
}

async function downloadLecturePdf(lectureId: string)
{
    try
    {
        const { data } = await useAsyncData(`lectures-list-questions-${lectureId}`, () => $api.getBlob<Blob>(`lectures/questions/${lectureId}`));

        if (!data.value)
        {
            $toast.error('Could not retrive the file, please try again');
        }

        const url = window.URL.createObjectURL(data.value as Blob);

        const link = document.createElement('a');

        link.href = url;
        link.setAttribute('download', 'lecture-questions.pdf');

        document.body.appendChild(link);
        link.click();

        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
    catch (error)
    {
        $toast.error('Error downloading PDF');
    }
}

await fetchLectures();
</script>

<template>
    <section>
        <Filters @search="fetchLectures">
            <FormKit
                type="text"
                name="title"
                label="Title"
                placeholder=""
            />
        </Filters>
        <UiFullScreenLoader :is-loading="fileFetching" message="File with messages is being created, please wait as it make take long time, depends of how many messages were in there" />
        <UiLoader v-if="loading" />
        <div v-else-if="lecturesData.length === 0" class="empty-list">
            No record was found
        </div>
        <div v-else>
            <div class="lectures-list" @click="getQuestionsFile">
                <div v-for="lecture in lecturesData" :key="lecture.id" class="lecture-item">
                    <div>Title: {{ lecture.title }}</div>
                    <button type="button" class="asset-button" :data-id="lecture.id">
                        Get list of questions
                    </button>
                </div>
            </div>
            <ListsPagination pager-indentifier="speaker-lectures" @change="fetchLectures" />
        </div>
    </section>
</template>

<style lang="scss" scoped>
.lectures-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    container-name: lectures-list;
    container-type: inline-size;

    @container lectures-list (width > 70ch) {
    .lecture-item {
       flex-direction: row;
       justify-content: space-between;
    }
}
}

.lecture-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    background-color: var(--white-400);
    color: var(--primary-400);
    border-radius: var(--base-radius);
    padding: 1em;

    button {
        white-space: nowrap;
    }
}
</style>
