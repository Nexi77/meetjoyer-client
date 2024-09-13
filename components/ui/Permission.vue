<script setup lang="ts">
import type { Role } from '~/types/global';

interface Props {
    accept: Role[];
}

const props = defineProps<Props>();

const authStore = useAuthStore();
const roles = computed(() => authStore.userRoles ?? []);
const acceptRoles = computed(() => roles.value.some(role => props.accept.includes(role)));
</script>

<template>
    <div>
        <div v-if="authStore.user && acceptRoles">
            <slot />
        </div>
    </div>
</template>
