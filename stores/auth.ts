import { acceptHMRUpdate, defineStore } from 'pinia';

export interface AuthState {
    token: string;
}

export const useAuthStore = defineStore('authStore', {
    state: (): AuthState => ({
        token: ''
    })
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
