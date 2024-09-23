<script setup lang="ts">
import type { FetchErrorWithMessage } from '~/types/api';
import type { Role } from '~/types/global';

interface UserFormValues {
    email: string;
    image?: { file: File, name: string }[],
    roles: Role[];
}

const { $api, $toast } = useNuxtApp();
const route = useRoute();
const userId = route.params.id as string;
const authStore = useAuthStore();

const loading = ref(false);
const wasImageRemoved = ref(false);
const updateForm = ref<FormKitNode | null>(null);
const userFetchedData = ref<UserData | null>(null);
const formValues = ref<Record<string, any>>({
    email: '',
    roles: []
});

async function fetchUserData(userId: string)
{
    return await $api.get<UserData>(`users/${userId}`);
}

async function uploadUserProfileImage(file: File)
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
        const { message } = useCustomError(err as FetchErrorWithMessage);

        if (message) $toast.error(message);
    }
}

async function fetchUser()
{
    try
    {
        loading.value = true;

        const userData = await fetchUserData(userId);

        userFetchedData.value = userData;

        formValues.value = {
            email: userData.email,
            roles: userData.roles
        };
    }
    catch (err)
    {
        throw createError({ message: `Could not fetch user with id: ${userId}`, fatal: true });
    }
    finally
    {
        loading.value = false;
    }
}

async function onSubmit(data: UserFormValues, node: FormKitNode)
{
    loading.value = true;

    const dataToUpdate: Record<string, any> = { ...data };

    const image = dataToUpdate.image as null | { file: File, name: string }[];

    delete dataToUpdate.image;

    if (wasImageRemoved.value && !image?.[0]?.file)
    {
        dataToUpdate.image = null;
    }

    if (image?.[0]?.file)
    {
        try
        {
            const url = await uploadUserProfileImage(image[0].file);

            dataToUpdate.image = url;
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

    try
    {
        const result = await $api.patch<UserData>(`users/${userId}`, dataToUpdate);

        $toast.success('User profile was updated');
        authStore.user = null;
        navigateTo(`/users/${result.id}`);
    }
    catch (error)
    {
        const { message, formFormattedMessages } = useCustomError(error as FetchErrorWithMessage);

        if (message)
        {
            $toast.error(message);
        }

        node.setErrors([], formFormattedMessages);
    }
    finally
    {
        loading.value = false;
    }
}

await fetchUser();
</script>

<template>
    <section>
        <h1 class="site-header">
            Update User Profile
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
                <FormKit type="email" name="email" label="Email Address" validation="required|email" required />
                <FormFileUpload label="Profile Image" :image-url="userFetchedData?.image" button-text="Select Profile Image" @image-removed="wasImageRemoved = true" />
                <FormKit
                    type="select"
                    label="User roles"
                    name="roles"
                    :multiple="true"
                    :options="rolesArray"
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
