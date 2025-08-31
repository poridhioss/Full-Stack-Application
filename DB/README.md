# Database Setup with Docker

This directory contains the Docker configuration for running PostgreSQL database for the backend service.

## Quick Start

1. **Start the PostgreSQL database:**
   ```bash
   docker-compose up -d postgres
   ```

2. **Start PostgreSQL with pgAdmin (optional):**
   ```bash
   docker-compose up -d
   ```

## Services

### PostgreSQL Database
- **Image:** postgres:15-alpine
- **Container Name:** user_management_db
- **Port:** 5432
- **Database:** user_management
- **Username:** postgres
- **Password:** postgres123

### pgAdmin (Optional)
- **Image:** dpage/pgadmin4:latest
- **Container Name:** user_management_pgadmin
- **Port:** 8080
- **Email:** admin@admin.com
- **Password:** admin123

## Environment Configuration

The database credentials are:
- Host: localhost (when connecting from host machine)
- Port: 5432
- Database: user_management
- Username: postgres
- Password: postgres123

## Backend Connection

Update your backend `.env` file with these values:
```
DATABASE_HOST=localhost
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres123
DATABASE_NAME=user_management
DATABASE_PORT=5432
```

## Commands

### Start Services
```bash
# Start only PostgreSQL
docker-compose up -d postgres

# Start PostgreSQL and pgAdmin
docker-compose up -d

# View logs
docker-compose logs postgres
docker-compose logs pgadmin
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

### Database Management
```bash
# Connect to PostgreSQL container
docker exec -it user_management_db psql -U postgres -d user_management

# Backup database
docker exec user_management_db pg_dump -U postgres user_management > backup.sql

# Restore database
docker exec -i user_management_db psql -U postgres user_management < backup.sql
```

## Data Persistence

Database data is persisted in Docker volumes:
- `postgres_data`: PostgreSQL data
- `pgadmin_data`: pgAdmin configuration

## Network

All services run on the `app_network` bridge network, allowing communication between containers.

## Health Check

PostgreSQL includes a health check that verifies the database is ready to accept connections.

## Access pgAdmin

If you started pgAdmin:
1. Open http://localhost:8080
2. Login with admin@admin.com / admin123
3. Add server with:
   - Host: postgres
   - Port: 5432
   - Database: user_management
   - Username: postgres
   - Password: postgres123
