<script setup lang="ts">
import type { FormKitNode } from '@formkit/core';
import type { Tokens, FetchErrorWithMessage } from '@/types/api';
definePageMeta({
    layout: 'logged-out'
});

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
}

async function onSubmit(data: FormData, node: FormKitNode)
{
    const { $toast } = useNuxtApp();

    try
    {
        await useApi().post<Tokens>('auth/local/signup', data);
        $toast.success('Your registration is complete, you can now log in');
        navigateTo('/login');
    }
    catch (error)
    {
        const { formFormattedMessages, message } = useCustomError(error as FetchErrorWithMessage);

        if (message)
            $toast.error(message);

        node.setErrors([], formFormattedMessages);
    }
}
</script>

<template>
    <main>
        <fieldset class="signup-form form-section">
            <FormKit type="form" submit-label="Signup" @submit="onSubmit">
                <h1>Signup</h1>
                <p>Join our community today! Create your account to get started with exclusive events.</p>
                <FormKit
                    id="email"
                    type="email"
                    name="email"
                    label="Email"
                    placeholder=""
                    validation="required|email"
                    validation-visibility="blur"
                />
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
                <div class="link-wrapper">
                    <NuxtLink to="login" class="link">
                        Already have an account? Sign in!
                    </NuxtLink>
                </div>
            </FormKit>
        </fieldset>
    </main>
</template>
