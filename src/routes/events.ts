import {ServerRoute} from "@hapi/hapi";
import * as EventValidators from '../validators/eventSchemas';
import {CreateEventPayload, EventFilterParams, UpdateEventPayload} from "../models/types";
import * as EventService from "../services/eventService";


export const eventRoutes: ServerRoute[] = [
    // Get /api/events - List all events with optional filters
    {
        method: 'GET',
        path: '/api/events',
        options: {
            validate: EventValidators.listEventsSchema,
            description: 'Get all events with optional filters',
            tags: ['api', 'events'],
            notes: 'Query params: tag, startDate, endDate, featured'
        },
        handler: async (request, h) => {
            try {
                const filters = request.query as EventFilterParams;
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
            try {
                const id = Number(request.params.id);
                const event = await EventService.getEventById(id);

                if (!event) {
                    return h.response({
                        error: 'Event not found',
                        message: `No event exists with id ${id}`
                    }).code(404);
                }

                const formattedEvent = {
                    ...event,
                    tags: event.tags.map(t => t.tag.name)
                }

                return h.response(formattedEvent).code(200);
            } catch (error) {
                console.error('Error fetching event by id:', error);
                return h.response({
                    error: 'Failed to fetch event',
                    message: error instanceof Error ? error.message : 'Unknown error occurred'
                }).code(500);
            }
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
            try {
                const payload = request.payload as CreateEventPayload;

                const eventData: CreateEventPayload = {
                    ...payload,
                    start: new Date(payload.start),
                    end: new Date(payload.end)
                };

                const newEvent = await EventService.createEvent(eventData);

                const formattedEvent = {
                    ...newEvent,
                    tags: newEvent.tags.map(t => t.tag.name)
                }

                return h.response(formattedEvent).code(201);
            } catch (error) {

                if (error instanceof Error && error.message.includes('Event end date must be after start date')) {
                    return h.response({
                        error: 'Validation Error',
                        message: error.message
                    }).code(400);
                }

                console.error('Error creating event:', error);
                return h.response({
                    error: 'Failed to create event',
                    message: error instanceof Error ? error.message : 'Unknown error occurred'
                }).code(500);
            }
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
            try {
                const id = Number(request.params.id);
                const payload = request.payload as UpdateEventPayload;
                const eventData: UpdateEventPayload = {
                    ...payload
                };
                if (payload.start) {
                    eventData.start = new Date(payload.start);
                }
                if (payload.end) {
                    eventData.end = new Date(payload.end);
                }

                const updatedEvent = await EventService.updateEvent(id, eventData);
                const formattedEvent = {
                    ...updatedEvent,
                    tags: updatedEvent.tags.map(t => t.tag.name)
                };
                return h.response(formattedEvent).code(200);
            } catch (error) {
                console.error('Error updating event:', error);

                if (error instanceof Error && error.message.includes('Record to update not found')) {
                    return h.response({
                        error: 'Event not found',
                        message: `No event exists with id ${request.params.id}`
                    }).code(404);
                }

                if (error instanceof Error && error.message.includes('end date must be after start date')) {
                    return h. response({
                        error: 'Validation error',
                        message: error.message
                    }).code(400);
                }

                return h.response({
                    error: 'Failed to update event',
                    message: error instanceof Error ? error. message : 'Unknown error occurred'
                }).code(500);
            }
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
            try {
                const id = Number(request. params.id);
                await EventService.deleteEvent(id);

                return h.response({
                    message: 'Event deleted successfully',
                    id
                }).code(200);
            } catch (error) {
                console.error('Error deleting event:', error);

                if (error instanceof Error && error.message. includes('Record to delete does not exist')) {
                    return h.response({
                        error: 'Event not found',
                        message: `No event exists with id ${request.params.id}`
                    }).code(404);
                }

                return h.response({
                    error: 'Failed to delete event',
                    message: error instanceof Error ? error.message : 'Unknown error occurred'
                }).code(500);
            }
        }
    }
];