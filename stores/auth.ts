import { acceptHMRUpdate, defineStore } from 'pinia';
import type { Role } from '~/types/global';

export interface UserData {
    id: number;
    email: string;
    roles: Role[];
    image?: string;
    createdAt?: string;
}
export interface AuthState {
    token: string;
    user: UserData | null;
}

export const useAuthStore = defineStore('authStore', {
    state: (): AuthState => ({
        token: '',
        user: null
    }),
    getters: {
        userRoles(state)
        {
            return state.user?.roles;
        },
        userImage(state)
        {
            return state.user?.image;
        }
    }
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
