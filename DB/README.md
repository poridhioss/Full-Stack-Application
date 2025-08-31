# Full Stack Application with Docker

This directory contains the Docker configuration for the complete User Management application stack.

## 🚀 Quick Start - Complete Application

**Start everything (Frontend + Backend + Database):**
```bash
docker-compose up --build
```

**Start in background:**
```bash
docker-compose up -d --build
```

## 📊 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **pgAdmin**: http://localhost:8080 (admin@admin.com / admin123)
- **PostgreSQL**: localhost:5432

## 🐳 Services

### Frontend (React)
- **Image:** Node.js 18 + Nginx
- **Container:** user_management_frontend
- **Port:** 3000 → 80
- **Features:** React TypeScript app with Nginx proxy

### Backend (Node.js)
- **Image:** Node.js 18 Alpine
- **Container:** user_management_backend
- **Port:** 5000
- **Features:** Express API with JWT authentication

### PostgreSQL Database
- **Image:** postgres:15-alpine
- **Container:** user_management_db
- **Port:** 5432
- **Database:** user_management
- **Username:** postgres
- **Password:** postgres123

### pgAdmin (Optional)
- **Image:** dpage/pgadmin4:latest
- **Container:** user_management_pgadmin
- **Port:** 8080
- **Email:** admin@admin.com
- **Password:** admin123

## 🔧 Development Commands

### Start Services
```bash
# Full stack
docker-compose up --build

# Specific services only
docker-compose up frontend backend postgres
docker-compose up -d postgres  # Database only

# Background mode
docker-compose up -d --build
```

### Monitor Services
```bash
# View logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs postgres

# Check status
docker-compose ps
```

### Stop Services
```bash
# Stop all
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

### Individual Service Management
```bash
# Restart a service
docker-compose restart backend

# Rebuild and restart
docker-compose up --build backend

# Scale frontend (multiple instances)
docker-compose up --scale frontend=2
```

## Environment Configuration

### Production Environment Variables
```bash
# Frontend
REACT_APP_API_URL=http://localhost:5000/api

# Backend
DATABASE_HOST=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres123
DATABASE_NAME=user_management
DATABASE_PORT=5432
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

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
