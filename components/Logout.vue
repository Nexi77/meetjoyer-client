<script setup lang="ts">
import { navigateTo } from 'nuxt/app';

const { $api } = useNuxtApp();
const authStore = useAuthStore();

async function logout()
{
    try
    {
        await $api.post('/auth/logout');
        authStore.token = '';

        const authCookie = useCookie('token');

        authCookie.value = null;

        localStorage.setItem('refreshToken', '');
        authStore.user = null;
        navigateTo('/login');
    }
    catch (error)
    {
        authStore.token = '';

        const authCookie = useCookie('token');

        authCookie.value = null;

        localStorage.setItem('refreshToken', '');
        authStore.user = null;
        navigateTo('/login');
    }
}
</script>

<template>
    <button class="logout" @click="logout">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M15 12L6 12M6 12L8 14M6 12L8 10" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /> <path d="M12 21.9827C10.4465 21.9359 9.51995 21.7626 8.87865 21.1213C8.11027 20.3529 8.01382 19.175 8.00171 17M16 21.9983C18.175 21.9862 19.3529 21.8897 20.1213 21.1213C21 20.2426 21 18.8284 21 16V14V10V8C21 5.17157 21 3.75736 20.1213 2.87868C19.2426 2 17.8284 2 15 2H14C11.1715 2 9.75733 2 8.87865 2.87868C8.11027 3.64706 8.01382 4.82497 8.00171 7" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" /> <path d="M3 9.5V14.5C3 16.857 3 18.0355 3.73223 18.7678C4.46447 19.5 5.64298 19.5 8 19.5M3.73223 5.23223C4.46447 4.5 5.64298 4.5 8 4.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" /> </g></svg>
        Logout
    </button>
</template>

<style lang="scss" scoped>
    .logout {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        margin-top: 10px;
        align-self: center;
        padding: 12px 10px;
        min-width: 200px;
        border-radius: var(--base-radius);
        border: 0;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: var(--white-400-hover);
        }

        svg {
            width: 30px;
            height: 30px;
            fill: var(--asset-400);
        }
    }
</style>
