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

createPager(`events-${props.type}`, page);

async function fetchEvents()
{
    try
    {
        const response = await $api.get<PaginatedResource<EventModel>>('events', { type: props.type, page: pager.value?.page, limit: pager.value?.limit });

        events.value = response.data;
        updatePager(`events-${props.type}`, response);
    }
    catch (error)
    {
        const { message } = useCustomError(error as FetchErrorWithMessage);

        if (message)
            $toast.error(message);
    }
}

fetchEvents();
</script>

<template>
    <div class="events-list">
        <EventsCard v-for="event in events" :key="event.id" :event="event" />
    </div>
    <ListsPagination :pager-indentifier="`events-${type}`" @change="fetchEvents" />
</template>

<style lang="scss" scoped>
.events-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 370px));
    gap: 15px;
}
</style>
