<script setup lang="ts">
import dayjs from 'dayjs';
import type { LectureModel, FetchErrorWithMessage, EventModel } from '~/types/api';

interface FormValues {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    speakerId: number;
    eventId?: number;
    participants?: number[];
}

const { $api, $toast } = useNuxtApp();
const route = useRoute();
const lectureId = route.params.id as string;

const usersData = ref<UserData[]>([]);
const eventsData = ref<EventModel[]>([]);
const lectureFetchedData = ref<LectureModel | null>(null);
const loading = ref(false);
const formValues = ref<Record<string, any>>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    speakerId: '',
    eventId: null,
    participants: []
});

const userOptions = computed(() => usersData.value?.map(user => ({ label: user.email, value: user.id })) ?? []);
const eventOptions = computed(() => eventsData.value?.map(event => ({ label: event.name, value: event.id })) ?? []);

async function fetchLectureData(lectureId: string)
{
    return await $api.get<LectureModel>(`lectures/${lectureId}`);
}

async function fetchUsersAndEvents()
{
    const [users, events] = await Promise.all([
        $api.get<UserData[]>('users/no-pagination'),
        $api.get<EventModel[]>('events/no-pagination')
    ]);

    return { users, events };
}

async function fetchDataInParallel()
{
    try
    {
        loading.value = true;

        const [lectureData, { users, events }] = await Promise.all([
            fetchLectureData(lectureId),
            fetchUsersAndEvents()
        ]);

        lectureFetchedData.value = lectureData;
        usersData.value = users;
        eventsData.value = events;

        formValues.value = {
            title: lectureData.title,
            description: lectureData.description,
            startTime: dayjs(lectureData.startTime).format('YYYY-MM-DDTHH:mm'),
            endTime: dayjs(lectureData.endTime).format('YYYY-MM-DDTHH:mm'),
            speakerId: lectureData.speaker.id,
            eventId: lectureData.eventId,
            participants: lectureData.participants.map(participant => participant.id)
        };
    }
    catch (err)
    {
        throw createError({ message: `Could not fetch data for lecture with id: ${lectureId}`, fatal: true });
    }
    finally
    {
        loading.value = false;
    }
}

async function onSubmit(data: FormValues, node: FormKitNode)
{
    loading.value = true;

    const dataToUpdate: Record<string, any> = { ...data };

    dataToUpdate.startTime = dayjs(dataToUpdate.startTime).toISOString();
    dataToUpdate.endTime = dayjs(dataToUpdate.endTime).toISOString();

    if (!dataToUpdate.eventId) delete dataToUpdate.eventId;

    if (!dataToUpdate.participants?.length) delete dataToUpdate.participants;

    try
    {
        const result = await $api.put<LectureModel>(`lectures/${lectureId}`, dataToUpdate);

        $toast.success('Lecture was updated');
        navigateTo(`/lectures/${result.id}`);
    }
    catch (error)
    {
        const { message, formFormattedMessages } = useCustomError(error as FetchErrorWithMessage);

        if (message) $toast.error(message);

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
            Update Existing Lecture
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
                <FormKit type="text" name="title" label="Lecture Title" validation="required" required />
                <FormKit type="textarea" name="description" label="Description" />
                <FormKit type="datetime-local" name="startTime" label="Start Time" validation="required" required />
                <FormKit
                    type="datetime-local"
                    name="endTime"
                    label="End Time"
                    validation="required|endDateGreaterThanStart"
                    :validation-rules="{ endDateGreaterThanStart }"
                    :validation-messages="{
                        endDateGreaterThanStart: 'Date of lecture end cannot be earlier than lecture starting'
                    }"
                    required
                />
                <FormKit
                    type="select"
                    label="Speaker"
                    name="speakerId"
                    :options="userOptions"
                    validation="required"
                    required
                />
                <FormKit type="select" label="Event" name="eventId" :options="eventOptions" />
                <FormKit
                    type="select"
                    label="Participants"
                    name="participants"
                    multiple
                    :options="userOptions"
                    help="Select all that apply by holding command (macOS) or control (PC)."
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
