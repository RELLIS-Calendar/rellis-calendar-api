import { prisma } from "../config/database";

export async function getAllTags() {
    return await prisma.tag.findMany({
        orderBy: {
            name: 'asc'
        }
    });
}
