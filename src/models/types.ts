export interface EventFilterParams {
    tag?: string;
    host?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface CreateEventPayload {
    title: string;
    host: string;
    contact?: string;
    summary?: string;
    url?: string;
    start: Date;
    end: Date;
    location?: string;
    tags?: string[];
}

export interface UpdateEventPayload {
    title?: string;
    host?: string;
    contact?: string;
    summary?: string;
    url?: string;
    start?: Date;
    end?: Date;
    location?: string;
    tags?: string[];
}