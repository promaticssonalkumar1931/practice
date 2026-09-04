# Simple Auth API

A simple Node.js + Express + MongoDB authentication API for user registration and login.

## Folder structure

- `src/config` – database connection setup
- `src/controllers` – business logic for auth routes
- `src/middleware` – JWT protection middleware
- `src/models` – MongoDB Mongoose models
- `src/routes` – API route definitions
- `src/utils` – helper utilities
- `src/app.js` – Express app setup
- `src/server.js` – server bootstrapping

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Make sure MongoDB is running locally on `mongodb://127.0.0.1:27017`
3. Start the server:
   ```bash
   npm start
   ```
4. Or run in development mode with nodemon:
   ```bash
   npm run dev
   ```

## API endpoints

### Register user

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Login user

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}
```

### Get authenticated user

```http
GET /api/auth/me
Authorization: Bearer <token>
```

## Notes

- Passwords are hashed using `bcryptjs`
- JWT tokens are used for authentication
- The app expects a MongoDB database named `simple-auth-api`
# practice
