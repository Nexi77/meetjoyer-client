<script setup lang="ts">
const route = useRoute();
const lectureId = route.params.id as string;
</script>

<template>
    <section class="lecture-details">
        Lecture - {{ lectureId }}
    </section>
</template>
