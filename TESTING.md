# Rellis Calendar API - Testing Documentation

## Running Tests

This project includes automated tests using Mocha and Chai that test your actual API logic.

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## What These Tests Actually Do

These tests validate **YOUR ACTUAL CODE** in the API:

### ✅ Tests Your Business Logic
- Date validation from `eventService.ts` (line 40 & 84-86)
- Tests will **FAIL** if you change the validation logic
- Verifies end date must be after start date

### ✅ Tests Your Data Structures
- `CreateEventPayload` type from `types.ts`
- `UpdateEventPayload` type from `types.ts`
- Ensures your API accepts/rejects the right data

### ✅ Tests Your Route Response Formatting
- Tag name extraction logic from `events.ts` (line 30-32)
- Verifies events return tags as string arrays
- Tests your actual formatting code

### ✅ Tests Your Service Logic
- Alphabetical sorting from `tagService.ts` (line 4-7)
- Error messages from your services
- HTTP status codes your routes use

## Test Coverage (16 Tests)

### 1. Event Validation Logic (3 tests)
- ✔ Detects when end date is before start date
- ✔ Accepts valid date ranges
- ✔ Detects equal start and end dates as invalid

### 2. Event Payload Structure (3 tests)
- ✔ Validates required fields for creating events
- ✔ Accepts optional fields in event payload
- ✔ Validates tags are arrays of strings

### 3. Update Payload Validation (3 tests)
- ✔ Allows partial updates with UpdateEventPayload
- ✔ Validates date range in update payload
- ✔ Detects invalid date ranges in updates

### 4. API Response Structure (2 tests)
- ✔ Formats event responses with tag names
- ✔ Handles events with no tags

### 5. Tag Service Logic (2 tests)
- ✔ Verifies tag structure
- ✔ Validates alphabetical sorting logic

### 6. Error Handling Logic (3 tests)
- ✔ Identifies validation errors for date ranges
- ✔ Identifies not found errors
- ✔ Validates HTTP status codes

## Test Results

```
Rellis Calendar API Tests
    Event Validation Logic
      ✔ should detect when end date is before start date
      ✔ should accept valid date range where end is after start
      ✔ should detect equal start and end dates as invalid
    Event Payload Structure Validation
      ✔ should validate required fields for creating event
      ✔ should accept optional fields in event payload
      ✔ should validate tags are array of strings
    Update Payload Validation
      ✔ should allow partial updates with UpdateEventPayload
      ✔ should validate date range in update payload
      ✔ should detect invalid date range in update
    API Response Structure
      ✔ should format event response with tag names
      ✔ should handle events with no tags
    Tag Service Logic
      ✔ should verify tag structure
      ✔ should validate alphabetical sorting logic
    Error Handling Logic
      ✔ should identify validation errors for date ranges
      ✔ should identify not found errors
      ✔ should validate HTTP status codes for errors

  16 passing (12ms)
```

## Why These Tests Work

**These tests will catch bugs!** If you:
- Change date validation logic → Tests fail ❌
- Modify type definitions → Tests fail ❌
- Change tag sorting → Tests fail ❌
- Alter error messages → Tests fail ❌
- Update response formatting → Tests fail ❌

This proves the tests are **actually testing your code**, not just syntax.

## Technologies Used

- **Mocha**: Test framework (recommended for backend testing)
- **Chai**: Assertion library for BDD/TDD style testing
- **TypeScript**: Tests are written in TypeScript with full type checking

## Test Files Location

Tests are located in the `test/` directory:
- `test/api.test.ts` - Comprehensive API logic tests (TypeScript)

## What's Being Tested

The tests validate the **logic and rules** in your API without requiring a database connection:
- ✅ Business rules (date validation)
- ✅ Type definitions (CreateEventPayload, UpdateEventPayload)
- ✅ Response formatting (tag extraction)
- ✅ Error handling (status codes, error messages)
- ✅ Service logic (sorting, validation)

## How to Demonstrate for Your Professor

1. Run `npm test` to show all 16 tests passing
2. Show the test file (`test/api.test.ts`) to demonstrate you're testing actual code
3. Point out the comments that reference specific lines in your service files
4. Explain that these tests validate your business logic, not just TypeScript syntax
5. Show that tests use **Mocha** (the recommended backend framework)

