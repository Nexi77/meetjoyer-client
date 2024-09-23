<script setup lang="ts">
import type { LectureModel } from '~/types/api';

interface Props {
    lecture: LectureModel;
}

defineProps<Props>();
</script>

<template>
    <div class="lecture-card">
        <div class="host">
            <UiUserAvatar :image-url="lecture.speaker.image" :size="100" />

            <p>Lecture host: <span>{{ lecture.speaker.email }} </span></p>
        </div>
        <div class="title">
            <p> <span>{{ lecture.title }}</span> </p>
        </div>
        <div class="desc">
            <p>Description: <span>{{ lecture.description || '-' }}</span> </p>
        </div>
        <NuxtLink :to="`/lectures/${lecture.id}`" class="lecture-details-link">
            Check the details
        </NuxtLink>
    </div>
</template>

<style lang="scss" scoped>
.lecture-card {
    color: var(--black-400);
    padding: 10px 18px;
    background-color: var(--white-400);
    border-radius: var(--base-radius2);
    display: flex;
    min-width: min(100%, 500px);
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
    font-size: 1rem;
}

.host {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

p {
    margin-bottom: 0;
    font-weight: bold;

    span {
        font-weight: normal;
    }
}

.title {
    text-align: center;

}

.title p span {
    font-size: 1.5rem;
}

.host p span, .title p span{
    color: var(--asset-400);
}

.desc {
    p {
        white-space: initial;
    }
}

.lecture-details-link{
    align-self: flex-end;
    margin-top: auto;
    padding: 10px;
    background-color: var(--asset-400);
    color: var(--white-400);
    text-decoration: none;
    border-radius: var(--base-radius);
    transition: background-color 0.3s ease;

    &:hover {
        background-color: var(--asset-400-hover);
    }
}
</style>
