# Job Application Tracker - Backend API

A RESTful API for managing job applications with authentication and CRUD operations.

## 🚀 Features

- JWT-based authentication
- User registration and login
- CRUD operations for job applications
- Job application statistics
- Search and filter functionality
- Secure password hashing
- Input validation

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 🌐 API Endpoints

### Authentication Routes

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

### Job Application Routes

All job routes require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Create Job Application
```
POST /api/jobs
Content-Type: application/json

{
  "company": "Google",
  "role": "Software Engineer",
  "link": "https://careers.google.com/job123",
  "location": "Mountain View, CA",
  "appliedDate": "2024-02-01",
  "status": "Applied",
  "notes": "Applied through referral"
}
```

#### Get All Job Applications
```
GET /api/jobs
Optional query parameters:
- status: Filter by status (Applied, OA, Interview, Offer, Rejected)
- search: Search by company or role
- sortBy: Field to sort by (default: createdAt)
- order: Sort order (asc/desc, default: desc)

Example: /api/jobs?status=Interview&search=Google&sortBy=appliedDate&order=desc
```

#### Get Single Job Application
```
GET /api/jobs/:id
```

#### Update Job Application
```
PUT /api/jobs/:id
Content-Type: application/json

{
  "status": "Interview",
  "notes": "Phone screen scheduled for next week"
}
```

#### Delete Job Application
```
DELETE /api/jobs/:id
```

#### Get Job Statistics
```
GET /api/jobs/stats

Response:
{
  "success": true,
  "data": {
    "total": 50,
    "Applied": 20,
    "OA": 10,
    "Interview": 8,
    "Offer": 2,
    "Rejected": 10
  }
}
```

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date
}
```

### JobApplication Model
```javascript
{
  userId: ObjectId (ref: User),
  company: String (required),
  role: String (required),
  link: String,
  location: String,
  appliedDate: Date,
  status: String (enum: Applied, OA, Interview, Offer, Rejected),
  notes: String,
  createdAt: Date
}
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected routes
- Input validation and sanitization
- Error handling middleware
- User authorization checks

## 📝 Response Format

All responses follow this format:

Success:
```json
{
  "success": true,
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## 🧪 Testing the API

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- Your frontend application

## 🚀 Deployment

This backend is ready to deploy on:
- Render
- Heroku
- Railway
- AWS
- DigitalOcean

Make sure to set environment variables on your hosting platform.

## 📈 Future Enhancements

- Email notifications
- Calendar integration
- File upload for resumes
- Analytics and graphs
- CSV import/export
- Interview scheduling
