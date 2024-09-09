<script setup lang="ts">
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import type { EventModel, FetchErrorWithMessage } from '~/types/api';
dayjs.extend(LocalizedFormat);

const route = useRoute();
const eventId = route.params.id as string;
const loading = ref(false);

const { $api, $toast } = useNuxtApp();
const eventData = ref<EventModel | null>(null);

async function fetchEventData()
{
    try
    {
        loading.value = true;

        const { data } = await useAsyncData(() => $api.get<EventModel>(`events/${eventId}`));

        eventData.value = data.value;
    }
    catch (error)
    {
        const { message } = useCustomError(error as FetchErrorWithMessage);

        if (message)
            $toast.error(message);
    }
    finally
    {
        loading.value = false;
    }
}

await fetchEventData();
</script>

<template>
    <section v-if="eventData" class="event-details">
        <div class="details-info">
            <div class="host">
                <UiUserAvatar :image-url="eventData.organiser.image">
                    <div class="host-info">
                        <p class="host-label">
                            Event host:
                        </p>
                        <p class="host-email">
                            {{ eventData.organiser.email }}
                        </p>
                    </div>
                </UiUserAvatar>
            </div>
            <div class="left-column event-data-column">
                <div v-if="eventData.image" class="image-wrapper">
                    <img :src="eventData.image" alt="event promoting photo">
                </div>
                <h1>{{ eventData.name }}</h1>
                <p class="event-desc">
                    {{ eventData.description }}
                </p>
                <div class="time">
                    <div class="label-with-icon hours">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" stroke="#F47D99" stroke-width="1.5" /> <path d="M12 8V12L14.5 14.5" stroke="#F47D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /> </g></svg>
                        <span>{{ dayjs(eventData.startDate).format('HH A') }} - {{ dayjs(eventData.endDate).format('HH A') }}</span>
                    </div>
                    <div class="label-with-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C20.1752 21.4816 19.3001 21.7706 18 21.8985" stroke-width="1.5" stroke-linecap="round" /> <path d="M7 4V2.5" stroke-width="1.5" stroke-linecap="round" /> <path d="M17 4V2.5" stroke-width="1.5" stroke-linecap="round" /> <path d="M21.5 9H16.625H10.75M2 9H5.875" stroke-width="1.5" stroke-linecap="round" /> <path d="M18 17C18 17.5523 17.5523 18 17 18C16.4477 18 16 17.5523 16 17C16 16.4477 16.4477 16 17 16C17.5523 16 18 16.4477 18 17Z" /> <path d="M18 13C18 13.5523 17.5523 14 17 14C16.4477 14 16 13.5523 16 13C16 12.4477 16.4477 12 17 12C17.5523 12 18 12.4477 18 13Z" /> <path d="M13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16C12.5523 16 13 16.4477 13 17Z" /> <path d="M13 13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13C11 12.4477 11.4477 12 12 12C12.5523 12 13 12.4477 13 13Z" /> <path d="M8 17C8 17.5523 7.55228 18 7 18C6.44772 18 6 17.5523 6 17C6 16.4477 6.44772 16 7 16C7.55228 16 8 16.4477 8 17Z" /> <path d="M8 13C8 13.5523 7.55228 14 7 14C6.44772 14 6 13.5523 6 13C6 12.4477 6.44772 12 7 12C7.55228 12 8 12.4477 8 13Z" /> </g></svg>
                        <span>{{ dayjs(eventData.startDate).format('DD dddd, MMMM') }}</span>
                    </div>
                </div>
            </div>
            <div class="right-column event-data-column">
                <LMap
                    style="height: 350px; border-radius: 10px;"
                    :zoom="16"
                    :center="[50.0369, 21.9993]"
                    :use-global-leaflet="false"
                >
                    <LTileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                        layer-type="base"
                        name="OpenStreetMap"
                    />

                    <!-- Add a marker at Lenartowicza Street -->
                    <LMarker :lat-lng="[50.0369, 21.9993]">
                        <LPopup>
                            Lenartowicza Street, Rzeszów
                        </LPopup>
                    </LMarker>
                </LMap>
                <div class="additional-info">
                    <div class="label-with-icon">
                        <div class="icon-circle">
                            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="#000000" /> <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="#000000" /> </g></svg>
                        </div>
                        People joined: {{ eventData.participantsNumber }}
                    </div>
                    <div class="label-with-icon">
                        <div class="icon-circle">
                            <svg fill="#000000" viewBox="-3 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"><path d="m8.075 23.52c-6.811-9.878-8.075-10.891-8.075-14.52 0-4.971 4.029-9 9-9s9 4.029 9 9c0 3.629-1.264 4.64-8.075 14.516-.206.294-.543.484-.925.484s-.719-.19-.922-.48l-.002-.004zm.925-10.77c2.07 0 3.749-1.679 3.749-3.75s-1.679-3.75-3.75-3.75-3.75 1.679-3.75 3.75c0 2.071 1.679 3.75 3.75 3.75z" /></g></svg>
                        </div>
                        Location: {{ eventData.location }}
                    </div>
                </div>
            </div>
        </div>
        <section class="lectures">
            <h2>Lectures to choose from:</h2>
            <div class="lectures-list">
                <LecturesCard
                    v-for="lecture in eventData.lectures"
                    :key="lecture.id"
                    :lecture="lecture"
                />
            </div>
        </section>
    </section>
</template>

<style lang="scss" scoped>
.event-details {
    display: grid;
    gap: 40px;
}

.details-info {
    display: grid;
    row-gap: 20px;

    @media screen and (width >= 968px){
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
}

.host {
    grid-column: span 2;

    p {
        margin: 0;
    }
}

.left-column, .right-column {
    grid-column: span 2;

    @media screen and (width >= 968px){
       grid-column: span 1;
    }
}

.host-label {
    text-transform: uppercase;
}

.host-email {
    color: var(--asset-400);
}

.image-wrapper {
    height: 350px;
    border-radius: var(--base-radius);
    overflow: hidden;

    img {
        max-height: 100%;
        width: 100%;
        object-fit: cover;
    }
}

.event-data-column {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

h1 {
    font-weight: 600;
    letter-spacing: 2px;
    font-size: 1.5rem;
}

h2 {
    font-size: 1.3rem;
    font-weight: 600;
    letter-spacing: 2px;
}

.event-desc {
    font-size: 1.125rem;
    font-weight: 300;
}

.time {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: space-between;

    @media screen and (width >= 968px){
        justify-content: flex-start;
    }

    svg {
        width: 45px;

        path {
            stroke: var(--asset-300);
        }
    }
}

.additional-info {
    background-color: var(--primary-100);
    border-radius: var(--base-radius);
    padding: 20px;
    font-size: 1.125rem;
    font-weight: 300;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.icon-circle {
    background-color: var(--white-400);
    width: 45px;
    height: 45px;

    svg {
        width: 25px;

        path {
            fill: var(--primary-400);
        }
    }

    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%
}

.lectures {
    max-width: 100%;
    overflow-x: auto;
}

.lectures-list {
    display: flex;
    gap: 15px;
}
</style>
