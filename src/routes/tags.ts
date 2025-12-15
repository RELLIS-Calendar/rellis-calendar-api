import {ServerRoute} from "@hapi/hapi";
import * as TagService from "../services/tagService";

export const tagRoutes: ServerRoute[] = [
    // GET /api/tags - Get all unique tags
    {
        method: 'GET',
        path: '/api/tags',
        options: {
            description: 'Get all unique tags',
            tags: ['api', 'tags']
        },
        handler: async (request, h) => {
            try {
                const tags = await TagService.getAllTags();
                return h.response(tags).code(200);
            } catch (error) {
                console.error('Error fetching tags:', error);
                return h.response({
                    error: 'Failed to fetch tags',
                    message: error instanceof Error ? error.message : 'Unknown error occurred'
                }).code(500);
            }
        }
    },

    // GET /api/tags/popular - Get popular tags
    {
        method: 'GET',
        path: '/api/tags/popular',
        options: {
            description: 'Get popular tags',
            tags: ['api', 'tags']
        },
        handler: async (request, h) => {
            try {
                const popularTags = await TagService.getPopularTags();
                return h.response(popularTags).code(200);
            } catch (error) {
                console.error('Error fetching popular tags:', error);
                return h.response({
                    error: 'Failed to fetch popular tags',
                    message: error instanceof Error ? error.message : 'Unknown error occurred'
                }).code(500);
            }
        }
    }
];