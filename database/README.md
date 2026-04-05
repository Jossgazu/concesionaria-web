# Database Setup - Concesionaria Web

## Prerequisites

- Docker and Docker Compose installed
- PostgreSQL client (optional, for direct connection)

## Quick Start

### 1. Start the Database

```bash
docker-compose up -d db
```

### 2. Run Migrations

The migrations run automatically on first container start (via Dockerfile init scripts).

To re-run manually:

```bash
docker-compose exec db psql -U postgres -d concesionaria -f /docker-entrypoint-initdb.d/001_initial_schema.sql
docker-compose exec db psql -U postgres -d concesionaria -f /docker-entrypoint-initdb.d/002_seed_data.sql
```

## Connection Details

| Property | Value |
|----------|-------|
| Host | localhost |
| Port | 5432 |
| Database | concesionaria |
| Username | postgres |
| Password | postgres |

## Connection String

```
postgresql://postgres:postgres@localhost:5432/concesionaria
```

## Migrations

| File | Description |
|------|-------------|
| `001_initial_schema.sql` | Complete schema: tables, indexes, views, triggers |
| `002_seed_data.sql` | Reference data: brands, body types, fuel types |

## Schema Overview

### Tables

- `users` - User accounts (buyers, sellers, admins)
- `vehicles` - Vehicle listings
- `vehicle_images` - Vehicle photo gallery
- `vehicle_specs` - Technical specifications
- `valuations` - Vehicle valuation requests
- `favorites` - User vehicle favorites
- `ratings` - User ratings and reviews
- `messages` - User-to-user messaging
- `transactions` - Purchase transactions
- `notifications` - User notifications

### Views

- `active_vehicle_listings` - Active listings with seller info
- `seller_ratings_summary` - Aggregated seller ratings

## Management Commands

```bash
# Connect to database
docker-compose exec db psql -U postgres -d concesionaria

# View tables
docker-compose exec db psql -U postgres -d concesionaria -c "\dt"

# View schema
docker-compose exec db psql -U postgres -d concesionaria -c "\d vehicles"

# Backup database
docker-compose exec db pg_dump -U postgres concesionaria > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T db psql -U postgres -d concesionaria
```

## Development

For local development without Docker, install PostgreSQL 15+ and run:

```bash
psql -U postgres -c "CREATE DATABASE concesionaria;"
psql -U postgres -d concesionaria -f migrations/001_initial_schema.sql
psql -U postgres -d concesionaria -f migrations/002_seed_data.sql
```
