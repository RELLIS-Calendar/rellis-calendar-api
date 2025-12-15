import { prisma } from "../config/database";

export async function getAllTags() {
    return await prisma.tag.findMany({
        orderBy: {
            name: 'asc'
        }
    });
}

export async function getPopularTags(limit: number = 10) {
    return await prisma.tag.findMany({
        include: {
            _count: {
                select: {
                    events: true
                }
            }
        },
        orderBy: {
            events: {
                _count: 'desc'
            }
        },
        take: limit
    });
}