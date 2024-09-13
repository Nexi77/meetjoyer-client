<script setup lang="ts">
import dayjs from 'dayjs';
import type { EventModel, FetchErrorWithMessage, LectureModel } from '~/types/api';
import type { EventType } from '~/types/global';
import { eventTypesArray } from '~/utils/event';

interface FormData {
    name: string;
    description: string;
    city: string;
    startDate: string;
    endDate: string;
    eventType: EventType
    lectureIds?: number[];
}

const { $api, $toast } = useNuxtApp();

const { data: lectures } = useAsyncData(async () => await $api.get<LectureModel[]>('lectures'));
const geolocationError = ref('');
const lecturesOptions = computed(() => lectures.value?.map(lecture => ({ label: lecture.title, value: lecture.id })) ?? []);
const geolocation = ref<[number, number] | null>(null);

async function onSubmit(data: FormData, node: FormKitNode)
{
    const dataToCreate: FormData & { geolocation?: [number, number] } = { ...data };

    dataToCreate.startDate = dayjs(dataToCreate.startDate).toISOString();
    dataToCreate.endDate = dayjs(dataToCreate.endDate).toISOString();

    if (geolocation.value)
        dataToCreate.geolocation = geolocation.value;

    if (!dataToCreate.lectureIds?.length)
        delete dataToCreate.lectureIds;

    try
    {
        await $api.post<EventModel>('events', dataToCreate);
        $toast.success('Event was created');
        navigateTo('/events');
    }
    catch (error)
    {
        const { message, formFormattedMessages } = useCustomError(error as FetchErrorWithMessage);

        geolocationError.value = formFormattedMessages.geolocation;

        if (message)
            $toast.error(message);

        node.setErrors([], formFormattedMessages);
    }
}
</script>

<template>
    <section>
        <h1 class="site-header">
            Create new event that you want to organise
        </h1>
        <div class="site-form">
            <FormKit type="form" class="site-form" :actions="false" @submit="onSubmit">
                <FormKit type="text" name="name" label="Name" validation="required" />
                <FormKit type="textarea" name="description" label="Description" validation="required" />
                <label class="formkit-label" for="map">Geolocation</label>
                <EventsLocationPicker @location-set="geolocation = $event" />
                <ul v-if="geolocationError" class="formkit-messages">
                    <li>{{ geolocationError }}</li>
                </ul>
                <FormKit type="text" name="location" label="City" validation="required" />
                <FormKit type="datetime-local" name="startDate" label="When it begins?" validation="required" />
                <FormKit type="datetime-local" name="endDate" label="When it ends?" validation="required" />
                <FormKit type="select" label="Type of event" name="eventType" :options="eventTypesArray" validation="required" />
                <FormKit
                    v-if="lectures"
                    type="select"
                    label="Lectures in the event"
                    multiple
                    name="lectureIds"
                    :options="lecturesOptions"
                    help="Select all that apply by holding command (macOS) or control (PC)."
                />
                <button type="submit" class="asset-button formkit-submit-button">
                    Submit
                </button>
            </FormKit>
        </div>
    </section>
</template>
