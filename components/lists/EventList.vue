<script setup lang="ts">
import type { EventModel, FetchErrorWithMessage } from '~/types/api';
import type { PaginatedResource } from '~/types/pagination';

interface Props {
    type: 'ongoing' | 'upcoming' | 'mine';
}

const props = defineProps<Props>();

const storeApp = useAppStore();
const { $api, $toast } = useNuxtApp();
const events = ref<EventModel[]>([]);
const route = useRoute();
const page = Number(route.query.page) || 1;
const pager = computed(() => storeApp.pagers[`events-${props.type}`]);
const loading = ref(false);

createPager(`events-${props.type}`, page);

async function fetchEvents(filters?: Record<string, unknown>)
{
    try
    {
        loading.value = true;

        const { data } = await useAsyncData(`events-${props.type}`, () => $api.get<PaginatedResource<EventModel>>('events', { type: props.type, page: pager.value?.page, limit: pager.value?.limit, ...filters }));

        if (!data.value) return;

        events.value = data.value?.data;
        updatePager(`events-${props.type}`, data.value);
    }
    catch (error)
    {
        const { message } = useCustomError(error as FetchErrorWithMessage);

        if (message)
            $toast.error(message);
    }
    finally
    {
        loading.value = false;
    }
}

fetchEvents();
</script>

<template>
    <div>
        <Filters @search="fetchEvents">
            <FormKit
                type="text"
                name="name"
                label="Name"
                placeholder=""
            />
            <FormKit
                type="text"
                name="location"
                label="Location"
                placeholder=""
            />
        </Filters>

        <UiLoader v-if="loading" />
        <div v-else-if="events.length === 0" class="empty-list">
            No record was found
        </div>
        <div v-else>
            <div class="events-list">
                <EventsCard v-for="event in events" :key="event.id" :event="event" />
            </div>
            <ListsPagination :pager-indentifier="`events-${type}`" @change="fetchEvents" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.events-list {
    display: grid;
    gap: 15px;

    @media screen and (width >= 680px) {
        grid-template-columns: repeat(auto-fit, minmax(280px, 370px));
    }
}
</style>
