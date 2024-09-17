import { jwtDecode } from 'jwt-decode';
import type { UserData } from '~/stores/auth';
import type { Role } from '@/types/global';

interface TokenData {
    sub: number;
    email: string;
    roles: Role[];
}

export default defineNuxtRouteMiddleware(async (to) =>
{
    const { $api } = useNuxtApp();
    const { ssrContext } = useNuxtApp();
    const authStore = useAuthStore();

    const token = useCookie('token');

    if (process.server)
    {
        authStore.token = token.value || '';

        if (token.value)
            $api.setHeader({ ...ssrContext?.event.node.req.headers as Record<string, unknown>, Authorization: `Bearer ${token.value}` });
    }

    if (authStore.token)
    {
        $api.setHeader({ Authorization: `Bearer ${authStore.token}` });
    }

    if (!authStore.user && authStore.token)
    {
        const tokenData = jwtDecode<TokenData>(authStore.token);

        try
        {
            const userResponse = await $api.get<UserData>(`users/${tokenData.sub}`);
            const userModel: UserData = { id: userResponse.id, email: userResponse.email, roles: userResponse.roles, image: userResponse.image };

            authStore.user = userModel;
        }
        catch (err)
        {
            authStore.token = '';
            authStore.user = null;
            navigateTo('/');
        }
    }

    const isUnauthorizedPage = ['login', 'register'].includes((to.name ?? '') as string);

    if (authStore.token && isUnauthorizedPage)
        return navigateTo('/');

    if (authStore.token || isUnauthorizedPage)
        return;

    return navigateTo({ name: 'login' });
});
