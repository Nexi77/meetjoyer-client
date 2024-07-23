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
    <div>Register</div>
    <!-- <main>
        <Card>
            <h2>Register</h2>
            <FormKit type="form" submit-label="Sign Up" @submit="onSubmit">
                <FormKit
                    id="email"
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="johnsmith@gmail.com"
                    prefix-icon="email"
                    validation="required|email"
                    validation-visibility="blur"
                />
                <FormKit
                    id="password"
                    type="password"
                    name="password"
                    label="Password"
                    prefix-icon="password"
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
                    prefix-icon="password"
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
        </Card>
    </main> -->
</template>
