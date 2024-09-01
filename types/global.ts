export const ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    SPEAKER: 'SPEAKER',
    ORGANISER: 'ORGANISER'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export interface PagerInfo
{
    page: number;
    limit: number | null;
    total: number;
    sortOrder: 'ASC' | 'DESC',
    sortBy: string | null
}

export interface Option<V = string>
{
    value: V;
    text: string;
}
