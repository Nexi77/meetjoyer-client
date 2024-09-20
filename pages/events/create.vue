<script setup lang="ts">
import dayjs from 'dayjs';
import type { EventModel, FetchErrorWithMessage, LectureModel } from '~/types/api';
import type { EventType } from '~/types/global';
import { eventTypesArray } from '~/utils/filters';
import { uploadImage } from '~/utils/file';

interface FormValues {
    name: string;
    description: string;
    city: string;
    startDate: string;
    endDate: string;
    eventType: EventType
    image?: { file: File, name: string }[],
    lectureIds?: number[];
}

const { $api, $toast } = useNuxtApp();

const { data: lectures } = useAsyncData(async () => await $api.get<LectureModel[]>('lectures'));
const geolocationError = ref('');
const lecturesOptions = computed(() => lectures.value?.map(lecture => ({ label: lecture.title, value: lecture.id })) ?? []);
const geolocation = ref<[number, number] | null>(null);
const loading = ref(false);

async function onSubmit(data: FormValues, node: FormKitNode)
{
    loading.value = true;

    const dataToCreate: Record<string, any> = { ...data };

    dataToCreate.startDate = dayjs(dataToCreate.startDate).toISOString();
    dataToCreate.endDate = dayjs(dataToCreate.endDate).toISOString();

    const image = dataToCreate.image as null | { file: File, name: string }[];

    delete dataToCreate.image;

    if (image && image[0]?.file)
    {
        const url = await uploadImage(image[0].file);

        dataToCreate.image = url;
    }

    if (geolocation.value)
        dataToCreate.geolocation = geolocation.value;

    if (!dataToCreate.lectureIds?.length)
        delete dataToCreate.lectureIds;

    try
    {
        const result = await $api.post<EventModel>('events', dataToCreate);

        $toast.success('Event was created');
        navigateTo(`/events/${result.id}`);
    }
    catch (error)
    {
        const { message, formFormattedMessages } = useCustomError(error as FetchErrorWithMessage);

        geolocationError.value = formFormattedMessages.geolocation;

        if (message)
            $toast.error(message);

        node.setErrors([], formFormattedMessages);
    }
    finally
    {
        loading.value = false;
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
                <FormKit type="text" name="name" label="Name" validation="required" required />
                <FormKit type="textarea" name="description" label="Description" validation="required" required />
                <FormFileUpload label="Event image" button-text="Select Event Image" />
                <label class="formkit-label" for="map">Geolocation<span class="required-star">*</span></label>
                <EventsLocationPicker @location-set="geolocation = $event" />
                <ul v-if="geolocationError" class="formkit-messages">
                    <li>{{ geolocationError }}</li>
                </ul>
                <FormKit type="text" name="location" label="City" validation="required" required />
                <FormKit type="datetime-local" name="startDate" label="Event start date" validation="required" required />
                <FormKit
                    type="datetime-local"
                    name="endDate"
                    label="Event end date"
                    validation="required|endDateGreaterThanStart"
                    :validation-rules="{ endDateGreaterThanStart }"
                    :validation-messages="{
                        endDateGreaterThanStart: 'Date of event end cannot be earlier than event starting'
                    }"
                    required
                />
                <FormKit
                    type="select"
                    label="Type of event"
                    name="eventType"
                    :options="eventTypesArray"
                    validation="required"
                    required
                />
                <FormKit
                    v-if="lectures"
                    type="select"
                    label="Lectures in the event"
                    multiple
                    name="lectureIds"
                    :options="lecturesOptions"
                    help="Select all that apply by holding command (macOS) or control (PC)."
                    validation="required"
                    required
                />
                <UiAction :loading="loading" class="formkit-submit-button">
                    <button type="submit">
                        Submit
                    </button>
                </UiAction>
            </FormKit>
        </div>
    </section>
</template>
