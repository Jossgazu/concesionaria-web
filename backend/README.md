# Concesionaria Web Backend

A multi-vendor car marketplace backend API built with Go Fiber, GORM, and PostgreSQL.

## Features

- JWT Authentication
- Vehicle CRUD with image uploads
- Valuations with calculation logic
- Favorites management
- User ratings
- Messaging system
- RESTful API

## Tech Stack

- **Framework**: Go Fiber v2
- **ORM**: GORM
- **Database**: PostgreSQL
- **Authentication**: JWT
- **File Storage**: Local filesystem

## Project Structure

```
backend/
├── cmd/server/          # Application entry point
├── internal/
│   ├── config/          # Configuration
│   ├── database/        # Database connection
│   ├── domain/          # Domain models
│   ├── dto/             # Data transfer objects
│   ├── handler/         # HTTP handlers
│   ├── middleware/      # Middleware (auth, cors, rate limit)
│   ├── repository/      # Data access layer
│   └── service/         # Business logic
├── pkg/
│   ├── errors/          # Custom errors
│   └── response/        # Response helpers
├── uploads/             # File uploads
├── go.mod
└── Makefile
```

## Setup

### Prerequisites

- Go 1.21+
- PostgreSQL 14+

### Environment Variables

Create a `.env` file in the backend directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=concesionaria
JWT_SECRET=your-secret-key
SERVER_PORT=3000
UPLOAD_PATH=./uploads
```

### Installation

```bash
# Clone the repository
cd backend

# Install dependencies
go mod download

# Run the server
go run ./cmd/server
```

Or use Make:

```bash
make setup
make run
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/login | Login |
| GET | /api/v1/auth/me | Get current user |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/users/:id | Get user profile |
| PUT | /api/v1/users/profile | Update profile |
| POST | /api/v1/users/avatar | Upload avatar |
| GET | /api/v1/users/:id/vehicles | Get user vehicles |
| GET | /api/v1/users/:id/ratings | Get user ratings |

### Vehicles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/vehicles | List vehicles |
| GET | /api/v1/vehicles/featured | Get featured |
| GET | /api/v1/vehicles/:id | Get vehicle |
| POST | /api/v1/vehicles | Create vehicle |
| PUT | /api/v1/vehicles/:id | Update vehicle |
| DELETE | /api/v1/vehicles/:id | Delete vehicle |
| POST | /api/v1/vehicles/:id/images | Upload image |
| DELETE | /api/v1/vehicles/:id/images/:imageId | Delete image |
| PUT | /api/v1/vehicles/:id/images/:imageId/primary | Set primary |

### Valuations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/valuations | List valuations |
| GET | /api/v1/valuations/:id | Get valuation |
| GET | /api/v1/valuations/vehicle/:vehicleId | By vehicle |
| POST | /api/v1/valuations | Create valuation |

### Favorites

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/favorites | My favorites |
| POST | /api/v1/favorites | Add favorite |
| DELETE | /api/v1/favorites/:vehicleId | Remove |

### Ratings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/ratings/:id | Get user ratings |
| GET | /api/v1/ratings/:id/summary | Rating summary |
| POST | /api/v1/ratings | Create rating |

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/messages | My conversations |
| GET | /api/v1/messages/unread | Unread count |
| GET | /api/v1/messages/conversation/:userId | Conversation |
| POST | /api/v1/messages | Send message |
| PUT | /api/v1/messages/:id/read | Mark read |

## Makefile Commands

```bash
make build      # Build the application
make run        # Build and run
make test       # Run tests
make tidy       # Clean dependencies
make clean      # Clean build artifacts
make docker-build  # Build Docker image
make docker-run    # Run Docker container
make lint       # Run linter
```

## License

MIT
