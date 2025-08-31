# User Management Backend API

A simple RESTful API for user management built with Node.js, Express, and PostgreSQL.

## Features

- User registration and login with JWT authentication
- CRUD operations for user management
- Password hashing with bcrypt
- PostgreSQL database integration
- JWT-based authentication for protected routes
- **🐳 Docker support for easy deployment**

## Prerequisites

### For Local Development:
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### For Docker Development:
- Docker
- Docker Compose

## Installation & Running

### 🐳 Option 1: Docker (Recommended)

#### Quick Start
```bash
# Navigate to backend directory
cd backend

# Start development environment (builds and runs both backend and database)
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

#### Using Helper Scripts
**Windows:**
```cmd
# Start development environment
docker.bat dev

# Start in background
docker.bat dev-detached

# View logs
docker.bat logs

# Stop services
docker.bat stop

# Clean up
docker.bat clean
```

**Linux/Mac:**
```bash
# Make script executable
chmod +x docker.sh

# Start development environment
./docker.sh dev

# Start in background
./docker.sh dev-detached

# View logs
./docker.sh logs

# Stop services
./docker.sh stop

# Clean up
./docker.sh clean
```

#### Full Stack with Database (from DB directory)
```bash
# Navigate to DB directory and start everything
cd ../DB
docker-compose up --build
```

### 📦 Option 2: Local Development

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the database credentials and JWT secret in `.env`

4. Create the PostgreSQL database:
```sql
CREATE DATABASE user_management;
```

5. Initialize the database tables:
```bash
npm run init-db
```

## Running the Application

### 🐳 Docker Development
```bash
# Start all services (backend + database)
docker-compose up --build

# Start in background
docker-compose up -d --build

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Initialize database in container
docker-compose exec backend npm run init-db
```

### 📦 Local Development

#### Development mode (with auto-reload):
```bash
npm run dev
```

#### Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## 🐳 Docker Configuration

### Images
- **Backend**: Node.js 18 Alpine (multi-stage build)
- **Database**: PostgreSQL 15 Alpine

### Services
- **Backend**: `http://localhost:5000`
- **PostgreSQL**: `localhost:5432`
- **pgAdmin**: `http://localhost:8080` (when using full stack)

### Environment Variables
Docker services use these environment variables:
```
DATABASE_HOST=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres123
DATABASE_NAME=user_management
DATABASE_PORT=5432
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

### Docker Commands
```bash
# Build backend image only
docker build -t user-management-backend .

# Run backend with local PostgreSQL
docker run -p 5000:5000 --env-file .env user-management-backend

# Full stack from DB directory
cd ../DB && docker-compose up --build
```

## API Endpoints

### Public Endpoints

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Protected Endpoints (Require JWT Token)

- `PUT /api/users/:id` - Update user information
- `PUT /api/users/:id/password` - Update user password
- `DELETE /api/users/:id` - Delete user

### Authentication

Protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Request/Response Examples

### Register User
```json
POST /api/users/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Login
```json
POST /api/users/login
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Update User
```json
PUT /api/users/:id
Authorization: Bearer <token>
{
  "username": "newusername",
  "email": "newemail@example.com",
  "first_name": "Updated",
  "last_name": "Name"
}
```

### Update Password
```json
PUT /api/users/:id/password
Authorization: Bearer <token>
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Database configuration
│   ├── controllers/
│   │   └── userController.js # User controller logic
│   ├── middleware/
│   │   └── authMiddleware.js # JWT authentication middleware
│   ├── models/
│   │   └── userModel.js      # User model and database queries
│   ├── routes/
│   │   └── userRoutes.js     # User route definitions
│   ├── scripts/
│   │   └── initDb.js         # Database initialization script
│   └── server.js             # Express server setup
├── .env                      # Environment variables (create from .env.example)
├── .env.example              # Example environment variables
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `500` - Internal Server Error