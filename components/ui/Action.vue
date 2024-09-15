<script setup lang="ts">
import Loader from './Loader.vue';

interface Props {
    variant?: 'primary' | 'secondary' | 'asset';
    disabled?: boolean;
    loading?: boolean;
}

withDefaults(defineProps<Props>(), {
    variant: 'asset',
    disabled: false,
    loading: false,
    gentle: false
});
</script>

<template>
    <div class="action" :class="[variant, { 'is-disabled': disabled, 'is-loading': loading }]">
        <slot />
        <div class="loader">
            <Loader />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.action > :slotted(*){
    width: 100%;
    background-color: transparent;
    border: 0;
    padding: 1rem;
}

.action .loader {
    display: none;
}

.action.action.is-loading {
    padding: 0.5rem;

    .loader {
        display: block;
    }
}

.action.is-loading  > :slotted(*) {
    display: none;
    pointer-events: none;
}

.action.asset {
    border: 0;
    color: var(--white-400);
    background-color: var(--asset-400);
    border-radius: var(--base-radius);
    text-align: center;
    text-decoration: none;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: var(--asset-400-hover);
    }
}

.action.asset > :slotted(*){
    color: var(--white-400);
}
</style>
