import Joi from 'joi';

// POST /api/events - Create event
export const createEventSchema = {
    payload: Joi.object({
        title: Joi.string().required().max(255),
        summary: Joi.string().optional(),
        host: Joi.string().optional(),
        contact: Joi.string().email().optional(),
        url: Joi.string().uri().optional(),
        start: Joi.date().iso().required(),
        end: Joi.date().iso().required(),
        location: Joi.string().optional(),
        tags: Joi.array().items(Joi.string()).optional(),
        featured: Joi.boolean().optional(),
        createdAt: Joi.date().iso().optional(),
        updatedAt: Joi.date().iso().optional(),
    })
};

// Get /api/events - Get events with query params
export const listEventsSchema = {
    query: Joi.object({
        host: Joi.string().optional(),
        tag: Joi.string().optional(),
        startDate: Joi.date().iso().optional(),
        endDate: Joi.date().iso().optional()
    })
};

// Get /api/events/{id} - Get an event by its ID
export const getEventByIdSchema = {
    params: Joi.object({
        id: Joi.number().integer().positive().required()
    })
};

// PUT /api/events/{id} - Update event
export const updateEventSchema = {
    params: Joi.object({
        id: Joi.number().integer().positive().required()
    }),
    payload: Joi.object({
        title: Joi.string().max(255),
        host: Joi.string().optional(),
        contact: Joi.string().email().optional(),
        summary: Joi.string().optional(),
        url: Joi.string().uri().optional(),
        start: Joi.date().iso().optional(),
        end: Joi.date().iso().optional(),
        location: Joi.string().optional(),
        tags: Joi.array().items(Joi.string()).optional()
    })
};

export const deleteEventSchema = {
    params: Joi.object({
        id: Joi.number().integer().positive().required()
    })
};