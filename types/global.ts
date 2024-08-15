export const ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    SPEAKER: 'SPEAKER',
    ORGANISER: 'ORGANISER'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
