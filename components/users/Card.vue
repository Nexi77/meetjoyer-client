<script setup lang="ts">
interface Props {
    user: UserData;
}

defineProps<Props>();
</script>

<template>
    <NuxtLink class="user-card" :to="`/users/${user.id}`">
        <div class="avatar-with-email">
            <UiUserAvatar :image-url="user.image" />
            <span>{{ user.email }}</span>
        </div>
        <div class="user-roles">
            <span>Roles: </span>
            <span>{{ user.roles }}</span>
        </div>
        <div class="actions" @click.prevent.stop>
            <button type="button" class="asset-button label-with-icon" title="edit this user" @click="navigateTo(`/users/${user.id}/edit`)">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M8.29289 3.70711L1 11V15H5L12.2929 7.70711L8.29289 3.70711Z" fill="#000000" /> <path d="M9.70711 2.29289L13.7071 6.29289L15.1716 4.82843C15.702 4.29799 16 3.57857 16 2.82843C16 1.26633 14.7337 0 13.1716 0C12.4214 0 11.702 0.297995 11.1716 0.828428L9.70711 2.29289Z" fill="#000000" /> </g></svg>
                Edit
            </button>
            <slot name="actions" />
        </div>
    </NuxtLink>
</template>

<style lang="scss" scoped>
.user-card {
    background-color: var(--white-400);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-radius: var(--base-radius);
    container-name: card;
    color: var(--primary-400);
    container-type: inline-size;
    text-decoration: none;

    @media screen and (width >= 768px) {
        flex-direction: row;
        align-items: center;
    }

    &:hover {
        background-color: var(--white-400-hover);
    }

    .avatar-with-email {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-direction: column;
        color: var(--asset-400);
    }

    .actions {
        margin-left: auto;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
    }

    button {
        svg {
            path {
                fill: var(--white-400);
            }
        }
    }

    .user-roles {
        text-align: center;

        @media screen and (width >= 768px) {
            text-align: left;
        }

    }

    @container card (width > 60ch) {
        .avatar-with-email {
            flex-direction: row;
        }
    }
}
</style>
