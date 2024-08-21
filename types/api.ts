export interface Tokens {
    access_token: string;
    refresh_token: string;
};

export interface ValidationMessageObject {
    property: string;
    message: string;
}

export interface FetchErrorWithMessage {
    statusCode: number;
    statusMessage: string;
    data: {
        message?: ValidationMessageObject[] | string;
        error: string;
        statusCode: number;
    }
}

export const EventType = {
    LECTURE: 'LECTURE',
    CONFERENCE: 'CONFERENCE',
    MONASTERY: 'MONASTERY',
    WORKSHOP: 'WORKSHOP',
    MEETUP: 'MEETUP'
} as const;

export interface LectureModel {
    id: number;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    speaker: UserData;
    eventId: number | null;
    participants: UserData[];
}

export interface EventModel {
    id: number;
    name: string;
    location: string;
    eventType: typeof EventType;
    organiser: UserData;
    lectures: LectureModel[];
    image: string | null;
}
