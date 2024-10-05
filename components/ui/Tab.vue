<script setup lang="ts">
interface Props {
    title: string;
    index: number;
}
withDefaults(defineProps<Props>(), {
    title: 'Tab'
});

const selectedIndex = inject('selectedIndex');
</script>

<template>
    <div v-if="index === selectedIndex" class="tab">
        <slot />
    </div>
</template>
