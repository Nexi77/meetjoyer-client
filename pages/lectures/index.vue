<script setup lang="ts">
import type { FetchErrorWithMessage, LectureModel } from '~/types/api';
import type { PaginatedResource } from '~/types/pagination';

const loading = ref(false);
const storeApp = useAppStore();
const lecturesData = ref<LectureModel[]>([]);
const route = useRoute();
const page = Number(route.query.page) || 1;
const { $api, $toast } = useNuxtApp();

createPager('lectures', page);

const pager = computed(() => storeApp.pagers.lectures);

async function fetchLectures(filters?: Record<string, unknown>)
{
    try
    {
        loading.value = true;

        const { data } = await useAsyncData(() => $api.get<PaginatedResource<LectureModel>>('lectures', { page: pager.value?.page, limit: 10, ...filters }));

        if (!data.value)
            return;

        lecturesData.value = data.value?.data;
        updatePager('lectures', data.value);
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
        <UiLoader v-if="loading" />
        <div v-else-if="lecturesData.length === 0" class="empty-list">
            No record was found
        </div>
        <div v-else>
            <div class="lectures-list">
                <LecturesCard v-for="lecture in lecturesData" :key="lecture.id" :lecture="lecture" class="lecture-list-card" />
            </div>
            <ListsPagination pager-indentifier="lectures" @change="fetchLectures" />
        </div>
    </section>
</template>

<style lang="scss" scoped>
.lectures-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 15px;
}

.lecture-list-card {
    max-width: unset;
}
</style>
