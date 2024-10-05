<script setup lang="ts">
import type { FetchErrorWithMessage, LectureModel } from '~/types/api';
import type { PaginatedResource } from '~/types/pagination';

interface Props {
    type?: 'mine',
    inHome?: boolean;
}

const loading = ref(false);
const storeApp = useAppStore();
const lecturesData = ref<LectureModel[]>([]);
const route = useRoute();
const page = Number(route.query.page) || 1;
const { $api, $toast } = useNuxtApp();
const props = defineProps<Props>();

createPager('lectures', page);

const pager = computed(() => storeApp.pagers.lectures);

async function fetchLectures(filters?: Record<string, unknown>)
{
    try
    {
        loading.value = true;

        const { data } = await useAsyncData(`lectures-list-${props.type}`, () => $api.get<PaginatedResource<LectureModel>>('lectures', { page: pager.value?.page, limit: props.inHome ? 5 : 10, type: props.type, ...filters }));

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

async function deleteLecture(id: number)
{
    try
    {
        await $api.delete<UserData>(`lectures/${id}`);
        await fetchLectures();
        $toast.success('Lectures was successfully deleted');
    }
    catch (error)
    {
        const { message } = useCustomError(error as FetchErrorWithMessage);

        if (message)
            $toast.error(message);
    }
}

await fetchLectures();
</script>

<template>
    <section>
        <UiConfirm
            title="Delete lecture"
            message="Are you sure you want to delete this user?"
            @confirm="deleteLecture"
        />
        <Filters v-if="!props.inHome" @search="fetchLectures">
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
            <ListsPagination v-if="!props.inHome" pager-indentifier="lectures" @change="fetchLectures" />
        </div>
    </section>
</template>

<style lang="scss" scoped>
.lectures-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 15px;

    @media screen and (width < 768px){
        grid-template-columns: 1fr;
    }
}

.lecture-list-card {
    max-width: unset;
}
</style>
