# Rellis Calendar API

A RESTful API for managing events at the Rellis Academic Alliance, built with TypeScript, Hapi.js, and Prisma ORM.

## Features

- **Event Management**: Create, read, update, and delete events
- **Tag System**: Organize events with tags
- **Filtering**: Filter events by tag, host, date range, and featured status
- **Validation**: Comprehensive input validation with Joi
- **Testing**: Automated tests with Mocha and Chai
- **Database**: MySQL with Prisma ORM

## Prerequisites

- Node.js (v18 or higher)
- MariaDB/MySQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   cd rellis-calendar-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=rellis_calendar
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

## Usage

### Development Mode
```bash
npm run dev
```
Starts the server on `http://localhost:3000` with hot reloading.

### Production Build
```bash
npm run build
npm start
```

### Run Tests
```bash
npm test
```

### Watch Tests
```bash
npm run test:watch
```

## API Endpoints

### Events

#### Get All Events
```http
GET /api/events
```
**Query Parameters:**
- `tag` (string): Filter by tag name
- `host` (string): Filter by host name
- `startDate` (ISO date): Filter events starting after this date
- `endDate` (ISO date): Filter events ending before this date
- `featured` (boolean): Filter featured events

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Workshop on AI",
    "host": "Computer Science Department",
    "contact": "cs@tamu.edu",
    "summary": "Learn about AI fundamentals",
    "url": "https://example.com",
    "start": "2025-12-20T10:00:00Z",
    "end": "2025-12-20T12:00:00Z",
    "location": "Rellis Campus",
    "featured": true,
    "tags": ["academic", "workshop"],
    "createdAt": "2025-12-15T00:00:00Z",
    "updatedAt": "2025-12-15T00:00:00Z"
  }
]
```

#### Get Event by ID
```http
GET /api/events/{id}
```
**Response:** `200 OK` or `404 Not Found`

#### Create Event
```http
POST /api/events
```
**Request Body:**
```json
{
  "title": "Workshop on AI",
  "host": "CS Department",
  "contact": "cs@tamu.edu",
  "summary": "Learn about AI",
  "url": "https://example.com",
  "start": "2025-12-20T10:00:00Z",
  "end": "2025-12-20T12:00:00Z",
  "location": "Rellis Campus",
  "tags": ["academic", "workshop"],
  "featured": true
}
```
**Response:** `201 Created`

#### Update Event
```http
PUT /api/events/{id}
```
**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "featured": true
}
```
**Response:** `200 OK` or `404 Not Found`

#### Delete Event
```http
DELETE /api/events/{id}
```
**Response:** `200 OK` or `404 Not Found`

### Tags

#### Get All Tags
```http
GET /api/tags
```
**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "academic"
  },
  {
    "id": 2,
    "name": "social"
  }
]
```

## Testing

The project includes comprehensive automated tests covering:
- Event validation logic
- Payload structure validation
- API response formatting
- Tag service logic
- Error handling

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## Project Structure

```
rellis-calendar-api/
├── src/
│   ├── config/
│   │   └── database.ts          # Database configuration
│   ├── models/
│   │   └── types.ts             # TypeScript interfaces
│   ├── routes/
│   │   ├── index.ts             # Route registration
│   │   ├── events.ts            # Event routes
│   │   └── tags.ts              # Tag routes
│   ├── services/
│   │   ├── eventService.ts      # Event business logic
│   │   └── tagService.ts        # Tag business logic
│   ├── validators/
│   │   └── eventSchemas.ts      # Joi validation schemas
│   └── server.ts                # Server initialization
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
├── test/
│   └── api.test.ts              # Automated tests
├── package.json
├── tsconfig.json
└── README.md
```

## Technologies Used

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Hapi.js
- **Database:** MariaDB
- **ORM:** Prisma
- **Validation:** Joi
- **Testing:** Mocha + Chai
- **Environment:** dotenv

## Database Schema

### Event Table
- `id`: Auto-increment primary key
- `title`: Event title
- `host`: Event host/organizer
- `contact`: Contact email (optional)
- `summary`: Event description (optional)
- `url`: Event URL (optional)
- `start`: Start date/time
- `end`: End date/time
- `location`: Event location (optional)
- `featured`: Featured flag
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp

### Tag Table
- `id`: Auto-increment primary key
- `name`: Unique tag name

### EventTag (Junction Table)
- `eventId`: Foreign key to Event
- `tagId`: Foreign key to Tag
