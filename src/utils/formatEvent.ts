export function formatEvent(event: any) {
    return {
        id: event.id,
        title: event.title,
        host: event.host,
        contact: event.contact,
        summary: event.summary,
        url: event.url,
        start: event.start,
        end: event.end,
        location: event.location,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        tags: event.tags?.map((et: any) => et.tag.name) || []
    };
}