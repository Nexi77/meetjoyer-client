<script setup lang="ts">
import type { FetchErrorWithMessage } from '~/types/api';
import { uploadImage } from '~/utils/file';

interface Data {
    email: string;
    password: string;
    passwordConfirm: string;
    image?: { file: File, name: string }[],
}

const authStore = useAuthStore();

const userFormData = ref({
    email: authStore.user?.email,
    password: '',
    passwordConfirm: ''
});

const { $api, $toast } = useNuxtApp();
const wasImageRemoved = ref(false);

async function onSubmit(data: Data, node: FormKitNode)
{
    const updateUserObject: Record<string, any> = {};

    try
    {
        const image = data.image as null | { file: File, name: string }[];

        if (image && image[0]?.file)
        {
            const url = await uploadImage(image[0].file);

            updateUserObject.image = url;
        }

        updateUserObject.email = data.email;
        updateUserObject.password = data.password;

        const response = await $api.patch<UserData>(`users/${authStore.user?.id}`, updateUserObject);

        authStore.user = response;
        $toast.success('Updated user data');
        node.reset({
            email: response.email,
            password: '',
            passwordConfirm: ''
        });
    }
    catch (err)
    {
        const { formFormattedMessages, message } = useCustomError(err as FetchErrorWithMessage);

        if (message)
            $toast.error(message);

        node.setErrors([], formFormattedMessages);
    }
}
</script>

<template>
    <section class="site-form">
        <h1>User profile</h1>
        <FormKit v-model="userFormData" type="form" @submit="onSubmit">
            <FormFileUpload label="Your image" button-text="Select your image" :image-url="authStore.userImage" @image-removed="wasImageRemoved = true" />
            <FormKit type="email" validation="required|email" label="Email" name="email" />
            <FormKit
                id="password"
                type="password"
                name="password"
                label="Password"
                validation="required|passwordRule"
                :validation-rules="{ passwordRule }"
                validation-visibility="blur"
                :validation-messages="{
                    passwordRule: 'Password must be at least 8 chars longs, have at least 1 lowercase letter, one uppercase letter, one symbol and one number'
                }"
            />
            <FormKit
                id="passwordConfirm"
                type="password"
                name="passwordConfirm"
                label="Confirm password"
                validation="required|confirm:password"
                validation-visibility="blur"
                validation-label="Passwords"
            />
        </FormKit>
    </section>
</template>
