import { jwtDecode } from 'jwt-decode';
import type { UserData } from '~/stores/auth';
import type { Role } from '@/types/global';

interface TokenData {
    sub: number;
    email: string;
    roles: Role[];
}

export default defineNuxtRouteMiddleware((to) =>
{
    const { $api } = useNuxtApp();
    const { ssrContext } = useNuxtApp();
    const authStore = useAuthStore();

    if (process.server)
    {
        const token = useCookie('token');

        authStore.token = token.value || '';

        if (token.value)
            $api.setHeader({ ...ssrContext?.event.node.req.headers, Authorization: `Bearer ${authStore.token.value}` });
    }

    if (authStore.token)
    {
        $api.setHeader({ Authorization: `Bearer ${authStore.token}` });
    }

    if (!authStore.user && authStore.token)
    {
        const tokenData = jwtDecode<TokenData>(authStore.token);
        const userModel: UserData = { id: tokenData.sub, email: tokenData.email, roles: tokenData.roles };

        authStore.user = userModel;
    }

    const isUnauthorizedPage = ['login', 'register'].includes((to.name ?? '') as string);

    if (authStore.token && isUnauthorizedPage)
        return navigateTo('/');

    if (authStore.token || isUnauthorizedPage)
        return;

    return navigateTo({ name: 'login' });
});
