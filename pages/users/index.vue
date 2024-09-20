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

createPager('events-list', page);

fetchUsers();
</script>

<template>
    <div>
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
                <UsersCard v-for="user in users" :key="user.id" :user="user" />
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
