import { useAuthStore } from '~/stores/auth';
import type { Tokens } from '~/types/api';

export async function useAuthLogin(email:string, password: string)
{
    const api = useApi();
    const authStore = useAuthStore();
    const data = await api.post<Tokens>('auth/local/signin', { email, password });

    authStore.token = data.access_token;
    localStorage.setItem('refresh_token', data.refresh_token);
    useCookie('token', { maxAge: 60 * 1000 * 15 }).value = data.access_token;
    navigateTo('/');
}
