<script setup lang="ts">
import { ROLES } from '~/types/global';

</script>

<template>
    <section>
        <UiPermission :accept="[ROLES.ADMIN]">
            <UiActions>
                <NuxtLink class="asset-button label-with-icon" to="/events/create">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M12 6V18" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </g></svg>
                    Create event
                </NuxtLink>
            </UiActions>
        </UiPermission>
        <UiTabs :active-index="0">
            <UiTab title="Ongoing Events" :index="0">
                <ListsEventList type="ongoing" />
            </UiTab>
            <UiTab title="Upcoming Events" :index="1">
                <ListsEventList type="upcoming" />
            </UiTab>
            <UiTab title="My Events" :index="2">
                <ListsEventList type="mine" />
            </UiTab>
        </UiTabs>
    </section>
</template>
