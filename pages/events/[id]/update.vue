<script setup lang="ts">
import dayjs from 'dayjs';

import type { EventModel, FetchErrorWithMessage, LectureModel } from '~/types/api';
import type { EventType } from '~/types/global';
import { eventTypesArray } from '~/utils/filters';

interface FormValues {
    name: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    eventType: EventType
    image?: { file: File, name: string }[],
    lectureIds?: number[];
}

const { $api, $toast } = useNuxtApp();
const route = useRoute();
const eventId = route.params.id as string;

const geolocationError = ref('');
const lecturesData = ref<LectureModel[]>([]);
const lecturesOptions = computed(() => lecturesData.value?.map(lecture => ({ label: lecture.title, value: lecture.id })) ?? []);
const geolocation = ref<[number, number] | null>(null);
const loading = ref(false);
const wasImageRemoved = ref(false);
const updateForm = ref<FormKitNode | null>(null);
const eventFetchedData = ref<EventModel | null>(null);
const formValues = ref<Record<string, any>>({
    location: '',
    description: '',
    eventType: '',
    endDate: '',
    name: '',
    startDate: '',
    lectureIds: []
});

async function fetchLectures()
{
    return await $api.get<LectureModel[]>('lectures/no-pagination');
}

async function fetchEventData(eventId: string)
{
    return await $api.get<EventModel>(`events/${eventId}`);
}

async function fetchDataInParallel()
{
    try
    {
        loading.value = true;

        const [lectures, eventData] = await Promise.all([
            fetchLectures(),
            fetchEventData(eventId)
        ]);

        eventFetchedData.value = eventData;
        geolocation.value = [eventData.geolocation.lat, eventData.geolocation.lng];
        lecturesData.value = lectures;
        formValues.value = {
            location: eventData.location,
            description: eventData.description,
            startDate: dayjs(eventData.startDate).format('YYYY-MM-DDTHH:mm'),
            endDate: dayjs(eventData.endDate).format('YYYY-MM-DDTHH:mm'),
            name: eventData.name,
            eventType: eventData.eventType,
            lectureIds: eventData.lectures.map(lecture => lecture.id)
        };
    }
    catch (err)
    {
        throw createError({ message: `Could not fetch data of event with id: ${eventId}`, fatal: true });
    }
    finally
    {
        loading.value = false;
    }
}

async function uploadEventImage(file: File)
{
    const formData = new FormData();

    formData.append('file', file);

    try
    {
        const imageUrl = await $api.postFormData<string>('upload/image', formData);

        return imageUrl;
    }

    catch (err)
    {
        const { $toast } = useNuxtApp();
        const { message } = useCustomError(err as FetchErrorWithMessage);

        if (message)
            $toast.error(message);

        throw new Error('We couldnt save user picture, try again!');
    }
}

async function onSubmit(data: FormValues, node: FormKitNode)
{
    loading.value = true;

    const dataToCreate: Record<string, any> = { ...data };

    dataToCreate.startDate = dayjs(dataToCreate.startDate).toISOString();
    dataToCreate.endDate = dayjs(dataToCreate.endDate).toISOString();

    const image = dataToCreate.image as null | { file: File, name: string }[];

    delete dataToCreate.image;

    if (wasImageRemoved.value && !image?.[0]?.file)
    {
        dataToCreate.image = null;
    }

    if (image?.[0]?.file)
    {
        const url = await uploadEventImage(image[0].file);

        dataToCreate.image = url;
    }

    if (geolocation.value)
        dataToCreate.geolocation = geolocation.value;

    if (!dataToCreate.lectureIds?.length)
        delete dataToCreate.lectureIds;

    try
    {
        const result = await $api.put<EventModel>(`events/${eventId}`, dataToCreate);

        $toast.success('Event was updated');
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

await fetchDataInParallel();
</script>

<template>
    <section>
        <h1 class="site-header">
            Update existing event
        </h1>
        <div class="site-form">
            <FormKit
                ref="updateForm"
                type="form"
                class="site-form"
                :value="formValues"
                :actions="false"
                @submit="onSubmit"
            >
                <FormKit type="text" name="name" label="Name" validation="required" required />
                <FormKit type="textarea" name="description" label="Description" validation="required" required />
                <FormFileUpload label="Event image" :image-url="eventFetchedData?.image" button-text="Select Event Image" @image-removed="wasImageRemoved = true" />
                <label class="formkit-label" for="map">Geolocation<span class="required-star">*</span></label>
                <EventsLocationPicker :geolocation="eventFetchedData?.geolocation" @location-set="geolocation = $event" />
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
                    v-if="lecturesData"
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
