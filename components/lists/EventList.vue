<script setup lang="ts">
import type { EventModel, FetchErrorWithMessage } from '~/types/api';
import type { PaginatedResource } from '~/types/pagination';

interface Props {
    type: 'ongoing' | 'upcoming' | 'mine';
}

const props = defineProps<Props>();

const { $api, $toast } = useNuxtApp();
const events = ref<EventModel[]>([]);

async function fetchEvents()
{
    try
    {
        const response = await $api.get<PaginatedResource<EventModel>>('events', { type: props.type });

        events.value = response.data;
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
</template>

<style lang="scss" scoped>
.events-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 370px));
    gap: 15px;
}
</style>
