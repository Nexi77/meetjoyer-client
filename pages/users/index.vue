<script setup lang="ts">
import type { FetchErrorWithMessage } from '~/types/api';
import type { PaginatedResource } from '~/types/pagination';

const storeApp = useAppStore();
const loading = ref(false);
const users = ref<UserData[]>([]);
const route = useRoute();
const page = Number(route.query.page) || 1;
const pager = computed(() => storeApp.pagers['users-list']);
const { $api, $toast } = useNuxtApp();

function onDeleteClick(id: number)
{
    const event = new CustomEvent('confirm', {
        detail: { id }
    });

    window.dispatchEvent(event);
}

async function fetchUsers(filters?: Record<string, unknown>)
{
    try
    {
        loading.value = true;

        const { data } = await useAsyncData('users-list', () => $api.get<PaginatedResource<UserData>>('users', { page: pager.value?.page, limit: pager.value?.limit, ...filters }));

        if (!data.value) return;

        users.value = data.value.data;
        updatePager('users-list', data.value);
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

async function deleteUser(id: number)
{
    try
    {
        await $api.delete<UserData>(`users/${id}`);
        await fetchUsers();

        $toast.success('User was successfully deleted');
    }
    catch (error)
    {
        const { message } = useCustomError(error as FetchErrorWithMessage);

        if (message)
            $toast.error(message);
    }
}

createPager('events-list', page);

fetchUsers();
</script>

<template>
    <div>
        <UiConfirm
            title="Delete user"
            message="Are you sure you want to delete this user?"
            @confirm="deleteUser"
        />
        <Filters @search="fetchUsers">
            <FormKit
                type="text"
                name="email"
                label="Email"
                placeholder=""
            />
            <FormKit
                type="select"
                name="role"
                label="Role"
                placeholder="Pick a role"
                :options="rolesArray"
            />
        </Filters>

        <UiLoader v-if="loading" />
        <div v-else-if="users?.length === 0" class="empty-list">
            No record was found
        </div>
        <div v-else>
            <div class="users-list">
                <UsersCard v-for="user in users" :key="user.id" :user="user">
                    <template v-if="useAuthStore().user?.id !== user.id" #actions>
                        <button type="button" class="asset-button label-with-icon" title="delete user" @click.prevent="() => onDeleteClick(user.id)">
                            <svg
                                id="Capa_1"
                                fill="var(--white-400)"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 490.646 490.646"
                                xml:space="preserve"
                            ><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M399.179,67.285l-74.794,0.033L324.356,0L166.214,0.066l0.029,67.318l-74.802,0.033l0.025,62.914h307.739L399.179,67.285z M198.28,32.11l94.03-0.041l0.017,35.262l-94.03,0.041L198.28,32.11z" /> <path d="M91.465,490.646h307.739V146.359H91.465V490.646z M317.461,193.372h16.028v250.259h-16.028V193.372L317.461,193.372z M237.321,193.372h16.028v250.259h-16.028V193.372L237.321,193.372z M157.18,193.372h16.028v250.259H157.18V193.372z" /> </g> </g> </g></svg>
                            Delete
                        </button>
                    </template>
                </UsersCard>
            </div>
            <ListsPagination pager-indentifier="users-list" @change="fetchUsers" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.users-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
