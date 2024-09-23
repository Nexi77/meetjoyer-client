<script setup lang="ts">
import dayjs from 'dayjs';
import type { FetchErrorWithMessage } from '~/types/api';
import ImagePlaceholder from '@images/image_placeholder.png';
import UserAvatar from '~/components/ui/UserAvatar.vue';

const route = useRoute();
const userId = route.params.id as string;
const loading = ref(false);
const userData = ref<UserData | null>(null);

const { $api, $toast } = useNuxtApp();

async function fetchUserData()
{
    try
    {
        loading.value = true;

        const { data } = await useAsyncData(() => $api.get<UserData>(`users/${userId}`));

        userData.value = data.value;
    }
    catch (error)
    {
        const { message } = useCustomError(error as FetchErrorWithMessage);

        if (message) $toast.error(message);
    }
    finally
    {
        loading.value = false;
    }
}

await fetchUserData();
</script>

<template>
    <section v-if="userData" class="user-details">
        <div class="details-info">
            <UserAvatar :image-url="userData.image || ImagePlaceholder" alt="user-avatar" :size="200" />
            <div class="info">
                <h1>{{ userData.email }}</h1>
                <p>
                    Roles:
                    <span v-for="(role, index) in userData.roles" :key="index">
                        {{ role }}<span v-if="index < userData.roles.length - 1">, </span>
                    </span>
                </p>
            </div>
        </div>
        <section class="additional-info">
            <h2>More Info</h2>
            <p v-if="userData.createdAt">
                Joined on: {{ dayjs(userData.createdAt).format('DD MMMM YYYY') }}
            </p>
        </section>
    </section>
</template>

<style lang="scss" scoped>
.user-details {
    display: grid;
    gap: 40px;

    @media screen and (width >= 768px) {
        place-items: center;
    }
}

h1 {
    color: var(--asset-300);
}

.details-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    max-width: 600px;

    .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;

        h1 {
            font-size: 1.75rem;
            font-weight: bold;
            text-align: center;
        }

        p {
            font-size: 1.125rem;
        }
    }
}

.additional-info {
    background-color: var(--primary-100);
    padding: 20px;
    width: 100%;
    border-radius: var(--base-radius);
    font-size: 1.125rem;
}
</style>
