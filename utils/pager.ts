import type { PaginatedResource } from '~/types/pagination';
import { useAppStore } from '~~/stores/app';

export function createPager(identifier: string | number, currentPage: number | string, limit: number | null = 20, sortBy: string | null = null, sortOrder: 'ASC' | 'DESC' = 'ASC')
{
    const store = useAppStore();

    const fragments = { page: Number(currentPage), limit, sortOrder, sortBy };

    store.setPager(identifier, { ...fragments, total: 0 });

    return fragments;
}

export function updatePager(identifier: string | number, data: PaginatedResource<unknown>)
{
    const store = useAppStore();

    store.setPager(identifier, {
        ...store.pagers[identifier],
        total: data.total,
        page: data.page,
        limit: data.limit,
        sortOrder: 'ASC',
        sortBy: ''
    });
}
