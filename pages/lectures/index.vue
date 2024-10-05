<script setup lang="ts">
import { ROLES } from '~/types/global';

const route = useRoute();
const { type } = route.query;
</script>

<template>
    <section>
        <UiPermission :accept="[ROLES.ADMIN, ROLES.ORGANISER]">
            <UiActions>
                <NuxtLink class="asset-button label-with-icon" to="/lectures/create">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M12 6V18" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </g></svg>
                    Create lecture
                </NuxtLink>
            </UiActions>
        </UiPermission>
        <UiTabs :active-index="type === 'mine' ? 1 : 0">
            <UiTab title="Lectures" :index="0">
                <ListsLecturesList />
            </UiTab>
            <UiTab title="Chosen lectures" :index="1">
                <ListsLecturesList type="mine" />
            </UiTab>
        </UiTabs>
    </section>
</template>
