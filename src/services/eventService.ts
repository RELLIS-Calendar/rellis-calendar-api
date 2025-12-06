import {prisma} from "../config/database";
import {EventFilterParams, CreateEventPayload, UpdateEventPayload} from "../models/types";


export async function getEvents(filters: EventFilterParams) {
    const {tag, host, startDate, endDate} = filters;

    return await prisma.event.findMany({
        where: {
            ...(tag && {
                tags: {
                    some: {
                        tag: {
                            name: tag
                        }
                    }
                }
            }),
            ...(host && {host: {contains: host}}),
            ...(startDate && {start: {gte: startDate}}),
            ...(endDate && {end: {lte: endDate}}),
        },
        include: {
            tags: {
                include: {
                    tag: true
                }
            },
        },
        orderBy: {
            start: 'asc'
        }
    });
}

export async function  createEvent(data: CreateEventPayload) {
    const {tags, ...eventData} = data;

    if (eventData.end <= eventData.start) {
        throw new Error('Event end date must be after start date');
    }

    return await prisma.event.create({
        data: {
            ...eventData,
            ...(tags && tags.length > 0 && {
                tags: {
                    create: tags.map(tagName => ({
                        tag: {
                            connectOrCreate: {
                                where: {name: tagName},
                                create: {name: tagName}
                            }
                        }
                    }))
                }
            })
        },
        include: {
            tags: {
                include: {
                    tag: true
                }
            }
        }
    });
}

export async function getEventById(id: number) {
    return await prisma.event.findUnique({
        where: {id},
        include: {
            tags: {
                include: {
                    tag: true
                }
            }
        }
    });
}

export async function updateEvent(id: number, data: UpdateEventPayload) {
    const {tags, ...eventData} = data;

    if (eventData.start && eventData.end && eventData.end <= eventData.start) {
        throw new Error('Event end date must be after start date');
    }

    return await prisma.event.update({
        where: {id},
        data: {
            ...eventData,
            ...(tags && {
                tags: {
                    deleteMany: {},
                    create: tags.map(tagName => ({
                        tag: {
                            connectOrCreate: {
                                where: {name: tagName},
                                create: {name: tagName}
                            }
                        }
                    }))
                }
            })
        },
        include: {
            tags: {
                include: {
                    tag: true
                }
            }
        }
    })
}
