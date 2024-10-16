<script setup lang="ts">
import type { LectureModel } from '~/types/api';
import { ROLES } from '~/types/global';

interface Props {
    lecture: LectureModel;
}

const props = defineProps<Props>();

function onDeleteClick(id: number)
{
    const event = new CustomEvent('confirm', {
        detail: { id }
    });

    window.dispatchEvent(event);
}

const authStore = useAuthStore();
const canEdit = computed(() => authStore.userRoles?.includes(ROLES.ADMIN) || authStore.userRoles?.includes(ROLES.ORGANISER));
const doIParticipate = computed(() => props.lecture.participants.some(participant => participant.id === authStore.user?.id));
</script>

<template>
    <div class="lecture-card">
        <div v-if="doIParticipate" class="badge" aria-label="You joined this lecture" />
        <div class="actions-box">
            <button v-if="canEdit" type="button" class="label-with-icon edit-button" @click.prevent="navigateTo(`lectures/${lecture.id}/update`)">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M8.29289 3.70711L1 11V15H5L12.2929 7.70711L8.29289 3.70711Z" fill="#000000" /> <path d="M9.70711 2.29289L13.7071 6.29289L15.1716 4.82843C15.702 4.29799 16 3.57857 16 2.82843C16 1.26633 14.7337 0 13.1716 0C12.4214 0 11.702 0.297995 11.1716 0.828428L9.70711 2.29289Z" fill="#000000" /> </g></svg>
            </button>
            <button v-if="canEdit" type="button" class="label-with-icon edit-button" title="delete user" @click.prevent="() => onDeleteClick(lecture.id)">
                <svg
                    id="Capa_1"
                    fill="var(--white-400)"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 490.646 490.646"
                    xml:space="preserve"
                ><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M399.179,67.285l-74.794,0.033L324.356,0L166.214,0.066l0.029,67.318l-74.802,0.033l0.025,62.914h307.739L399.179,67.285z M198.28,32.11l94.03-0.041l0.017,35.262l-94.03,0.041L198.28,32.11z" /> <path d="M91.465,490.646h307.739V146.359H91.465V490.646z M317.461,193.372h16.028v250.259h-16.028V193.372L317.461,193.372z M237.321,193.372h16.028v250.259h-16.028V193.372L237.321,193.372z M157.18,193.372h16.028v250.259H157.18V193.372z" /> </g> </g> </g></svg>
            </button>
        </div>
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
    position: relative;
    min-width: min(100%, 500px);
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
    font-size: 1rem;
    overflow: hidden;
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

.badge {
    background-color: green;
    position: absolute;
    transform: rotate(45deg);
    right: -10px;
    width: 50px;
    height: 10px;
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
