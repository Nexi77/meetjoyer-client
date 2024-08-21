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
    <div v-show="index === selectedIndex" class="tab">
        <slot />
    </div>
</template>
