export default defineNuxtRouteMiddleware((to) =>
{
    const api = useApi();
    const { ssrContext } = useNuxtApp();
    const authStore = useAuthStore();

    if (process.server)
    {
        const token = useCookie('token');

        authStore.token = token.value || '';
        api.setHeader((ssrContext?.event.node.req.headers as Record<string, string>) ?? {});
    }

    const isUnauthorizedPage = ['login', 'register'].includes((to.name ?? '') as string);

    if (authStore.token && isUnauthorizedPage)
        return navigateTo('/');

    if (authStore.token || isUnauthorizedPage)
        return;

    return navigateTo({ name: 'login' });
});
