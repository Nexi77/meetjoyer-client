<script setup lang="ts">
const route = useRoute();
const userId = route.params.id as string;
</script>

<template>
    <section class="user-details">
        UserId is {{ userId }}
    </section>
</template>
