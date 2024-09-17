<script setup lang="ts">
import dayjs from 'dayjs';
import type { EventModel } from '~/types/api';
import PlaceholderImage from '@images/image_placeholder.png';
import { ROLES } from '~/types/global';

interface Props {
    event: EventModel
}

const props = defineProps<Props>();
const authStore = useAuthStore();

const eventJoinedUsersCount = computed(() =>
{
    return props.event.lectures.reduce((total, lecture) => total + lecture.participants.length, 0);
});

const eventImage = computed(() => props.event.image ?? PlaceholderImage);
const canEdit = computed(() => authStore.userRoles?.includes(ROLES.ADMIN) || props.event.organiser.id === authStore.user?.id);
</script>

<template>
    <NuxtLink class="event-card" :to="`events/${event.id}`">
        <button v-if="canEdit" type="button" class="label-with-icon edit-button" @click.prevent="navigateTo(`events/${event.id}/update`)">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M8.29289 3.70711L1 11V15H5L12.2929 7.70711L8.29289 3.70711Z" fill="#000000" /> <path d="M9.70711 2.29289L13.7071 6.29289L15.1716 4.82843C15.702 4.29799 16 3.57857 16 2.82843C16 1.26633 14.7337 0 13.1716 0C12.4214 0 11.702 0.297995 11.1716 0.828428L9.70711 2.29289Z" fill="#000000" /> </g></svg>
        </button>
        <div class="image-wrapper">
            <img :src="eventImage" alt="">
        </div>
        <p class="event-title">
            {{ event.name }}
        </p>
        <p class="event-location label-with-icon">
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
        <p class="event-date label-with-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C20.1752 21.4816 19.3001 21.7706 18 21.8985" stroke-width="1.5" stroke-linecap="round" /> <path d="M7 4V2.5" stroke-width="1.5" stroke-linecap="round" /> <path d="M17 4V2.5" stroke-width="1.5" stroke-linecap="round" /> <path d="M21.5 9H16.625H10.75M2 9H5.875" stroke-width="1.5" stroke-linecap="round" /> <path d="M18 17C18 17.5523 17.5523 18 17 18C16.4477 18 16 17.5523 16 17C16 16.4477 16.4477 16 17 16C17.5523 16 18 16.4477 18 17Z" /> <path d="M18 13C18 13.5523 17.5523 14 17 14C16.4477 14 16 13.5523 16 13C16 12.4477 16.4477 12 17 12C17.5523 12 18 12.4477 18 13Z" /> <path d="M13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16C12.5523 16 13 16.4477 13 17Z" /> <path d="M13 13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13C11 12.4477 11.4477 12 12 12C12.5523 12 13 12.4477 13 13Z" /> <path d="M8 17C8 17.5523 7.55228 18 7 18C6.44772 18 6 17.5523 6 17C6 16.4477 6.44772 16 7 16C7.55228 16 8 16.4477 8 17Z" /> <path d="M8 13C8 13.5523 7.55228 14 7 14C6.44772 14 6 13.5523 6 13C6 12.4477 6.44772 12 7 12C7.55228 12 8 12.4477 8 13Z" /> </g></svg>
            {{ dayjs(event.startDate).format('DD/MM/YYYY') }}
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
        position: relative;
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

        .event-location svg {
            path {
                fill: var(--asset-400);
            }
        }

        .event-date svg path {
            stroke: var(--asset-400);
        }

        .joined-users svg {
            fill: var(--asset-400);
        }
    }
</style>
