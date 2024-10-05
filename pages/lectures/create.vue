<script setup lang="ts">
import dayjs from 'dayjs';
import type { EventModel, FetchErrorWithMessage, LectureModel } from '~/types/api';

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

const { data: users } = useAsyncData(async () => await $api.get<UserData[]>('users/no-pagination'));
const { data: events } = useAsyncData(async () => await $api.get<EventModel[]>('events/no-pagination'));

const userOptions = computed(() => users.value?.map(user => ({ label: user.email, value: user.id })) ?? []);
const eventOptions = computed(() => events.value?.map(event => ({ label: event.name, value: event.id })) ?? []);
const loading = ref(false);

async function onSubmit(data: FormValues, node: FormKitNode)
{
    loading.value = true;

    const dataToCreate: Record<string, any> = { ...data };

    dataToCreate.startTime = dayjs(dataToCreate.startTime).toISOString();
    dataToCreate.endTime = dayjs(dataToCreate.endTime).toISOString();

    if (!dataToCreate.eventId) delete dataToCreate.eventId;

    if (!dataToCreate.participants?.length) delete dataToCreate.participants;

    try
    {
        const result = await $api.post<LectureModel>('lectures', dataToCreate);

        $toast.success('Lecture was created');
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
</script>

<template>
    <section>
        <h1 class="site-header">
            Create a New Lecture
        </h1>
        <div class="site-form">
            <FormKit type="form" class="site-form" :actions="false" @submit="onSubmit">
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
