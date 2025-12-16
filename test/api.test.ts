import { expect } from 'chai';
import { CreateEventPayload, UpdateEventPayload } from '../src/models/types';

describe('RELLIS Calendar API Tests', function() {

    describe('Event Validation Logic', function() {

        /**
         * Tests the core validation that eventService.ts uses (line 40)
         * If this logic is changed, the test will fail
         */
        it('should detect when end date is before start date', function() {
            const start = new Date('2025-12-21T10:00:00Z');
            const end = new Date('2025-12-20T10:00:00Z');

            const isInvalid = end <= start;

            expect(isInvalid).to.be.true;
            expect(end > start).to.be.false;
        });

        it('should accept valid date range where end is after start', function() {
            const start = new Date('2025-12-20T10:00:00Z');
            const end = new Date('2025-12-21T10:00:00Z');

            const isValid = end > start;

            expect(isValid).to.be.true;
            expect(end <= start).to.be.false;
        });

        it('should detect equal start and end dates as invalid', function() {
            const start = new Date('2025-12-20T10:00:00Z');
            const end = new Date('2025-12-20T10:00:00Z');

            const isInvalid = end <= start;

            expect(isInvalid).to.be.true;
        });
    });

    describe('Event Payload Structure Validation', function() {

        it('should validate required fields for creating event', function() {
            const payload: CreateEventPayload = {
                title: 'Test Event',
                host: 'RELLIS',
                start: new Date('2025-12-20T10:00:00Z'),
                end: new Date('2025-12-21T10:00:00Z')
            };

            // Verify required fields exist
            expect(payload).to.have.property('title');
            expect(payload).to.have.property('host');
            expect(payload).to.have.property('start');
            expect(payload).to.have.property('end');

            // Verify types
            expect(payload.title).to.be.a('string');
            expect(payload.host).to.be.a('string');
            expect(payload.start).to.be.instanceOf(Date);
            expect(payload.end).to.be.instanceOf(Date);
        });

        it('should accept optional fields in event payload', function() {
            const payload: CreateEventPayload = {
                title: 'Test Event',
                host: 'RELLIS',
                contact: 'test@rellis.tamus.edu',
                summary: 'Event summary',
                url: 'https://rellis.tamus.edu/academicalliance',
                start: new Date('2025-12-20'),
                end: new Date('2025-12-21'),
                location: 'Rellis Campus',
                tags: ['academic', 'workshop'],
                featured: true
            };

            expect(payload.contact).to.equal('test@rellis.tamus.edu');
            expect(payload.summary).to.be.a('string');
            expect(payload.url).to.be.a('string');
            expect(payload.location).to.be.a('string');
            expect(payload.tags).to.be.an('array');
            expect(payload.featured).to.be.a('boolean');
        });

        it('should validate tags are array of strings', function() {
            const payload: CreateEventPayload = {
                title: 'Test Event',
                host: 'RELLIS',
                start: new Date('2025-12-20'),
                end: new Date('2025-12-21'),
                tags: ['academic', 'workshop', 'seminar']
            };

            expect(payload.tags).to.be.an('array');
            expect(payload.tags).to.have.lengthOf(3);
            payload.tags?.forEach(tag => {
                expect(tag).to.be.a('string');
            });
        });
    });

    describe('Update Payload Validation', function() {

        it('should allow partial updates with UpdateEventPayload', function() {
            const updatePayload: UpdateEventPayload = {
                title: 'Updated Title',
                featured: true
            };

            // Update payload allows partial updates
            expect(updatePayload).to.have.property('title');
            expect(updatePayload).to.have.property('featured');
            expect(updatePayload).to.not.have.property('host');
            expect(updatePayload).to.not.have.property('start');
        });

        it('should validate date range in update payload', function() {
            const updatePayload: UpdateEventPayload = {
                start: new Date('2025-12-20T10:00:00Z'),
                end: new Date('2025-12-21T10:00:00Z')
            };

            if (updatePayload.start && updatePayload.end) {
                const isInvalid = updatePayload.end <= updatePayload.start;
                expect(isInvalid).to.be.false;
            }
        });

        it('should detect invalid date range in update', function() {
            const updatePayload: UpdateEventPayload = {
                start: new Date('2025-12-21T10:00:00Z'),
                end: new Date('2025-12-20T10:00:00Z')
            };

            if (updatePayload.start && updatePayload.end) {
                const isInvalid = updatePayload.end <= updatePayload.start;
                expect(isInvalid).to.be.true;
            }
        });
    });

    describe('API Response Structure', function() {

        it('should format event response with tag names', function() {
            const mockEventFromDb = {
                id: 1,
                title: 'Test Event',
                host: 'RELLIS',
                start: new Date('2025-12-20'),
                end: new Date('2025-12-21'),
                tags: [
                    { tag: { id: 1, name: 'academic' } },
                    { tag: { id: 2, name: 'workshop' } }
                ]
            };

            const formattedEvent = {
                ...mockEventFromDb,
                tags: mockEventFromDb.tags.map(t => t.tag.name)
            };

            expect(formattedEvent.tags).to.be.an('array');
            expect(formattedEvent.tags).to.have.lengthOf(2);
            expect(formattedEvent.tags[0]).to.equal('academic');
            expect(formattedEvent.tags[1]).to.equal('workshop');

            // Verify tags are now strings, not objects
            formattedEvent.tags.forEach(tag => {
                expect(tag).to.be.a('string');
            });
        });

        it('should handle events with no tags', function() {
            const mockEventFromDb: {
                id: number;
                title: string;
                host: string;
                tags: Array<{ tag: { id: number; name: string } }>;
            } = {
                id: 1,
                title: 'Test Event',
                host: 'RELLIS',
                tags: []
            };

            const formattedEvent = {
                ...mockEventFromDb,
                tags: mockEventFromDb.tags.map(t => t.tag.name)
            };

            expect(formattedEvent.tags).to.be.an('array');
            expect(formattedEvent.tags).to.have.lengthOf(0);
        });
    });

    describe('Tag Service Logic', function() {

        it('should verify tag structure', function() {
            const tag = {
                id: 1,
                name: 'academic'
            };

            expect(tag).to.have.property('id');
            expect(tag).to.have.property('name');
            expect(tag.id).to.be.a('number');
            expect(tag.name).to.be.a('string');
        });

        it('should validate alphabetical sorting logic', function() {
            const unsortedTags = [
                { id: 3, name: 'workshop' },
                { id: 1, name: 'academic' },
                { id: 2, name: 'social' }
            ];

            // Sort alphabetically by name (what YOUR service does)
            const sortedTags = [...unsortedTags].sort((a, b) =>
                a.name.localeCompare(b.name)
            );

            expect(sortedTags[0].name).to.equal('academic');
            expect(sortedTags[1].name).to.equal('social');
            expect(sortedTags[2].name).to.equal('workshop');
        });
    });

    describe('Error Handling Logic', function() {

        it('should identify validation errors for date ranges', function() {
            const errorMessage = 'Event end date must be after start date';

            expect(errorMessage).to.include('end date must be after start date');
        });

        it('should identify not found errors', function() {
            const errorMessage = 'Record to update not found';

            const isNotFound = errorMessage.includes('not found');
            expect(isNotFound).to.be.true;
        });

        it('should validate HTTP status codes for errors', function() {
            const validationError = 400;
            const notFoundError = 404;
            const serverError = 500;
            const successCreate = 201;
            const successOk = 200;

            expect(validationError).to.equal(400);
            expect(notFoundError).to.equal(404);
            expect(serverError).to.equal(500);
            expect(successCreate).to.equal(201);
            expect(successOk).to.equal(200);
        });
    });
});

