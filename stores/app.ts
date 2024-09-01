import { acceptHMRUpdate, defineStore } from 'pinia';
import type { PagerInfo } from '~/types/global';

export interface IAppState {
    pagers: Record<string, PagerInfo | null>;
}

export interface IAppStore extends IAppState {
    setPager(identifider: string | number, pager: PagerInfo): void;
}

export const useAppStore = defineStore('appStore', {
    state: (): IAppState => ({
        pagers: {}
    }),

    actions: {
        setPager(identifier: string | number, pager: PagerInfo): void
        {
            this.pagers[identifier] = pager;
        }
    }
});

if (import.meta.hot)
{
    import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
