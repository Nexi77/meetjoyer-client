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

export const EVENT_TYPE = {
    CONFERENCE: 'CONFERENCE',
    MONASTERY: 'MONASTERY',
    WORKSHOP: 'WORKSHOP',
    MEETUP: 'MEETUP'
} as const;

export type EventType = typeof EVENT_TYPE[keyof typeof EVENT_TYPE];

export interface NominatimResponse {
    display_name: string;
    lat: string;
    lon: string;
}
