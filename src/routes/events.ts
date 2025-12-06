import {ServerRoute} from "@hapi/hapi";
import * as EventValidators from '../validators/eventSchemas';
import {EventFilterParams} from "../models/types";
import * as EventService from "../services/eventService";

// MOCK DATA to be replaced with actual database calls later
const mockEvents = [
    {
        id: 1,
        title: "Finals Care Packages",
        host: "Office of Student Life",
        contact: "StudentLife@rellis.tamus.edu",
        summary: "Find care packages around campus during finals week!",
        url: "https://rellis.tamus.edu/academicalliance/event/finals-care-packages/",
        start: "2025-12-10T00:00:00.000Z",
        end: "2025-12-17T00:00:00.000Z",
        location: "RELLIS Academic Alliance",
        createdAt: "2025-12-05T00:00:00.000Z",
        updatedAt: "2025-12-05T00:00:00.000Z",
        tags: [
            {id: 1, name: "students"},
        ]
    },
    {
        id: 2,
        title: "RELLIS Commencement",
        host: "Office of Student Life",
        contact: "StudentLife@rellis.tamus.edu",
        summary: "Join us for fall commencement December 18th, 2025. The ceremony will begin at 2pm. Students, family and friends will be able to be let inside by 1pm. RSVP with the link below.",
        url: "https://forms.office.com/pages/responsepage.aspx?id=CdPwu_zL70WOnWqXm7ZFulL4wHAhZElNldLn2t3QpNpUQTdDUTRXVFdQVjFYR1dETU9ZTzJGNEVGMS4u&route=shorturl",
        start: "2025-12-18T20:00:00.000Z",
        end: "2025-12-18T22:00:00.000Z",
        location: "Brazos County Expo Center: 5827 Leonard Rd, Bryan, TX",
        createdAt: "2025-12-05T00:00:00.000Z",
        updatedAt: "2025-12-05T00:00:00.000Z",
        tags: [
            {id: 1, name: "students"},
            {id: 2, name: "event"},
            {id: 3, name: "family"},
            {id: 4, name: "friends"}
        ]
    },
    {
        id: 3,
        title: "Welcome Back Week",
        host: "Office of Student Life",
        contact: "StudentLife@rellis.tamus.edu",
        summary: "Kick off the semester with fun events all week long!",
        url: "https://rellis.tamus.edu/academicalliance/event/welcome-back-week/",
        start: "2026-01-12T00:00:00.000Z",
        end: "2026-01-16-00:00:00.000Z",
        location: "RELLIS Academic Alliance",
        createdAt: "2025-12-05T00:00:00.000Z",
        updatedAt: "2025-12-05T00:00:00.000Z",
        tags: [
            {id: 1, name: "students"},
        ]
    },
    {
        id: 4,
        title: "RELLIS Info Session",
        host: "Austin Burns",
        contact: "aburns@rellis.tamus.edu",
        summary: "Join RELLIS Academic Alliance admissions team members for a degree info session to discuss available bachelor’s degree programs, admissions requirements, and much more in a variety of exciting fields. Register for this in-person event using the button below.",
        url: "https://go.pardot.com/l/548402/2021-08-10/f29vgw",
        start: "2026-01-21T23:00:00.000Z",
        end: "2026-01-22T01:00:00.000Z",
        location: "RELLIS Campus, ACB2 room 112",
        createdAt: "2025-12-05T00:00:00.000Z",
        updatedAt: "2025-12-05T00:00:00.000Z",
        tags: [
            {id: 5, name: "recruitment"},
            {id: 3, name: "family"},
        ]
    },
    {
        id: 5,
        title: "RELLIS Recharge",
        host: "Office of Student Life",
        contact: "StudentLife@rellis.tamus.edu",
        start: "2026-02-11T00:00:00.000Z",
        end: "2026-02-11T00:00:00.000Z",
        location: "RELLIS Academic Alliance",
        createdAt: "2025-12-05T00:00:00.000Z",
        updatedAt: "2025-12-05T00:00:00.000Z",
        tags: [
            {id: 1, name: "students"},
            {id: 6, name: "recharge"},
        ]
    },
];

export const eventRoutes: ServerRoute[] = [
    // Get /api/events - List all events with optional filters
    {
        method: 'GET',
        path: '/api/events',
        options: {
            validate: EventValidators.listEventsSchema,
            description: 'Get all events with optional filters',
            tags: ['api', 'events'],
            notes: 'Query params: tag, startDate, endDate'
        },
        handler: async (request, h) => {
            try {
                const filters = request.query as EventFilterParams;

                if (filters.startDate && typeof filters.startDate === 'string') {
                    filters.startDate = new Date(filters.startDate);
                }
                if (filters.endDate && typeof filters.endDate === 'string') {
                    filters.endDate = new Date(filters.endDate);
                }
                const events = await EventService.getEvents(filters);
                const formattedEvents = events.map(e => ({
                    ...e,
                    tags: e.tags.map(t => t.tag.name)
                }))
                return h.response(formattedEvents).code(200);
            } catch (error) {
                console.error('Error fetching events:', error);
                return h.response({
                    error: 'Failed to fetch events',
                    message: error instanceof Error ? error.message : 'Unknown error occurred'
                }).code(500);
            }
        }
    },

    // Get /api/events/{id} -Get a single event by id
    {
        method: 'GET',
        path: '/api/events/{id}',
        options: {
            validate: EventValidators.getEventByIdSchema,
            description: 'Get a single event by id',
            tags: ['api', 'events']
        },
        handler: async (request, h) => {
            const id = Number(request.params.id);
            const event = mockEvents.find(e => e.id === id);

            if (!event) {
                return h.response({
                    error: 'Event not found',
                    message: `No event exists with id ${id}`
                }).code(404);
            }

            return h.response(event).code(200);
        }
    },

    // POST /api/events - Create a new event
    {
        method: 'POST',
        path: '/api/events',
        options: {
            validate: EventValidators.createEventSchema,
            description: 'Create a new event',
            tags: ['api', 'events']
        },
        handler: async (request, h) => {
            const payload = request.payload as any;

            // Mock created event
            const newEvent = {
                id: mockEvents.length + 1,
                ...payload,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tags: payload.tags?.map((name: string, idx: number) => ({
                    id: idx + 100,
                    name
                })) || []
            };

            // TODO: Actually save to database
            mockEvents.push(newEvent);

            return h.response(newEvent).code(201);
        }
    },
    {
        method: 'PUT',
        path: '/api/events/{id}',
        options: {
            validate: EventValidators.updateEventSchema,
            description: 'Update an existing event',
            tags: ['api', 'events']
        },
        handler: async (request, h) => {
            const id = Number(request.params.id);
            const payload = request.payload as any;
            const eventIndex = mockEvents.findIndex(e => e.id === id);

            if (eventIndex === -1) {
                return h.response({
                    error: 'Event not found',
                    message: `No event exists with id ${id}`
                }).code(404);
            }

            // Mock update
            const updatedEvent = {
                ...mockEvents[eventIndex],
                ...payload,
                updatedAt: new Date().toISOString(),
                tags: payload.tags?.map((name: string, idx: number) => ({
                    id: idx + 100,
                    name
                })) || mockEvents[eventIndex].tags
            };

            // TODO: Actually update in database
            mockEvents[eventIndex] = updatedEvent;

            return h.response(updatedEvent).code(200);
        }
    },
    {
        method: 'DELETE',
        path: '/api/events/{id}',
        options: {
            validate: EventValidators.deleteEventSchema,
            description: 'Delete an event',
            tags: ['api', 'events']
        },
        handler: async (request, h) => {
            const id = Number(request.params.id);
            const eventIndex = mockEvents.findIndex(e => e.id === id);

            if (eventIndex === -1) {
                return h.response({
                    error: 'Event not found',
                    message: `No event exists with id ${id}`
                }).code(404);
            }

            // TODO: Actually delete from database
            mockEvents.splice(eventIndex, 1);

            return h.response({
                message: 'Event deleted successfully',
                id
            }).code(200);
        }
    }
];