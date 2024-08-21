export interface PaginatedResource<T> {
    data: T[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
    page: number;
    total: number;
}
