<script setup lang="ts">
import type { FetchErrorWithMessage } from '~/types/api';

definePageMeta({
    layout: 'logged-out'
});

interface FormData {
    email: string;
    password: string;
}

async function onSubmit(data: FormData, node: FormKitNode)
{
    try
    {
        await useAuthLogin(data.email, data.password);
    }
    catch (error)
    {
        const { $toast } = useNuxtApp();
        const { formFormattedMessages, message } = useCustomError(error as FetchErrorWithMessage);

        if (message)
            $toast.error(message);

        node.setErrors([], formFormattedMessages);
    }
}
</script>

<template>
    <main>
        <fieldset class="login-form form-section">
            <FormKit type="form" submit-label="Signup" @submit="onSubmit">
                <h1>Login</h1>
                <p>Welcome back! Please enter your details to continue.</p>
                <FormKit
                    id="email"
                    type="email"
                    name="email"
                    label="Email Address"
                    placeholder=""
                    validation="required|email"
                    validation-visibility="blur"
                />
                <FormKit
                    id="password"
                    type="password"
                    name="password"
                    label="Password"
                    validation="required"
                    validation-visibility="blur"
                />
            </FormKit>
        </fieldset>
    </main>
</template>
