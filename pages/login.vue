<script setup lang="ts">
import type { FetchErrorWithMessage, Tokens } from '~/types/api';

definePageMeta({
    layout: 'logged-out'
});

interface FormData {
    email: string;
    password: string;
}

const authStore = useAuthStore();
const { $api } = useNuxtApp();

async function onSubmit(data: FormData, node: FormKitNode)
{
    try
    {
        const tokens = await $api.post<Tokens>('auth/local/signin', { email: data.email, password: data.password });

        authStore.token = tokens.access_token;
        localStorage.setItem('refresh_token', tokens.refresh_token);

        const tokenCookie = useCookie('token', { maxAge: 60 * 1000 * 15 });

        tokenCookie.value = tokens.access_token;
        navigateTo('/');
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
            <FormKit type="form" submit-label="Signin" @submit="onSubmit">
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
                <div class="link-wrapper">
                    <NuxtLink to="register" class="link">
                        New here? Signup!
                    </NuxtLink>
                </div>
            </FormKit>
        </fieldset>
    </main>
</template>
