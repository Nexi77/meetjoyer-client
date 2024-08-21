<script setup lang="ts">
import type { EventModel } from '~/types/api';
import PlaceholderImage from '@images/image_placeholder.png';

interface Props {
    event: EventModel
}

const props = defineProps<Props>();

const eventJoinedUsersCount = computed(() =>
{
    return props.event.lectures.reduce((total, lecture) => total + lecture.participants.length, 0);
});

const eventImage = computed(() => props.event.image ?? PlaceholderImage);
</script>

<template>
    <NuxtLink class="event-card" to="events">
        <div class="image-wrapper">
            <img :src="eventImage" alt="">
        </div>
        <p class="event-title">
            {{ event.name }}
        </p>
        <p class="event-date label-with-icon">
            <svg
                viewBox="-4 0 32 32"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
            ><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <title>location</title> <desc>Created with Sketch Beta.</desc> <defs /> <g
                id="Page-1"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
                sketch:type="MSPage"
            > <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-104.000000, -411.000000)" fill="#000000"> <path id="location" d="M116,426 C114.343,426 113,424.657 113,423 C113,421.343 114.343,420 116,420 C117.657,420 119,421.343 119,423 C119,424.657 117.657,426 116,426 L116,426 Z M116,418 C113.239,418 111,420.238 111,423 C111,425.762 113.239,428 116,428 C118.761,428 121,425.762 121,423 C121,420.238 118.761,418 116,418 L116,418 Z M116,440 C114.337,440.009 106,427.181 106,423 C106,417.478 110.477,413 116,413 C121.523,413 126,417.478 126,423 C126,427.125 117.637,440.009 116,440 L116,440 Z M116,411 C109.373,411 104,416.373 104,423 C104,428.018 114.005,443.011 116,443 C117.964,443.011 128,427.95 128,423 C128,416.373 122.627,411 116,411 L116,411 Z" sketch:type="MSShapeGroup" /> </g> </g> </g></svg>
            {{ event.location }}
        </p>
        <div>
            <p class="label-with-icon joined-users">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M12 1.2A4.8 4.8 0 1 0 16.8 6 4.805 4.805 0 0 0 12 1.2zm0 8.6A3.8 3.8 0 1 1 15.8 6 3.804 3.804 0 0 1 12 9.8zM20 22H4v-4.5A5.506 5.506 0 0 1 9.5 12h5a5.506 5.506 0 0 1 5.5 5.5zM5 21h14v-3.5a4.505 4.505 0 0 0-4.5-4.5h-5A4.505 4.505 0 0 0 5 17.5z" /><path fill="none" d="M0 0h24v24H0z" /></g></svg>
                {{ eventJoinedUsersCount }} joined
            </p>
        </div>
    </NuxtLink>
</template>

<style lang="scss" scoped>
    .event-card {
        color: var(--black-400);
        padding: 10px;
        background-color: var(--white-400);
        border-radius: var(--base-radius2);
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: 1rem;

        img {
            border-radius: var(--base-radius2);
        }

        .image-wrapper {
            max-height: 188px;
            height: 188px;

            img {
                object-fit: cover;
                height: 100%;
                width: 100%;
            }
        }

        p {
            margin-bottom: 0;
        }

        .event-title {
            font-family: Gilroy, sans-serif;
            font-weight: 600;
            font-size: 1.5rem;
        }

        .event-date svg {
            path {
                fill: var(--asset-400);
            }
        }

        .joined-users svg {
            fill: var(--asset-400);
        }
    }
</style>
