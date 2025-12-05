# CourseMaster - Learning Management System

A full-stack Learning Management System (LMS) built with React, Node.js, Express, and MongoDB. CourseMaster allows instructors to create and manage courses, while students can enroll, watch lessons, complete assignments, and take quizzes.
- ## Live link - https://coursemaster-df.netlify.app
## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Course Management**: Create, update, and manage courses with modules and lessons
- **Student Enrollment**: Students can enroll in courses and track their progress
- **Video Lessons**: Watch course videos and track completion
- **Assignments**: Submit assignments and receive instructor feedback
- **Quizzes**: Take quizzes to test knowledge
- **Admin Dashboard**: Comprehensive admin panel for course and user management 
- (Admin: admin@coursemaster.com / admin123)

- **Email Notifications**: Welcome emails sent to new users using nodemailer

## 📁 Project Structure

```
CourseMaster/
├── Coursemaster-Frontend/    # React + Vite frontend application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service functions
│   │   ├── features/         # Redux slices and logic
│   │   └── config/           # Configuration files
│   └── package.json
│
└── Server/                    # Node.js + Express backend API
    ├── src/
    │   ├── controllers/       # Request handlers
    │   ├── models/            # MongoDB models
    │   ├── routes/            # API routes
    │   ├── middlewares/      # Custom middlewares
    │   ├── services/          # Business logic services
    │   └── validators/        # Input validation schemas
    └── package.json
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the Server directory:
```bash
cd Server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `Server` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://Ahad:gpYktnfyoVxUpOfY@cluster0.h60wqpl.mongodb.net/CourseMaster?appName=Cluster0
JWT_SECRET=4f8e0f7c2c9a49a588b8fa4693c1d7a1e4d73c84a2f51b6763d995f4b6c87e59
EMAIL_USER=abdulahad.df1@gmail.com
EMAIL_PASSWORD=bkzj wygm uzro gsqe
```

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000` (or the PORT specified in your `.env` file).

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Coursemaster-Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `Coursemaster-Frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`.

### Production Build

**Frontend:**
```bash
cd Coursemaster-Frontend
npm run build
```

**Backend:**
```bash
cd Server
npm start
```

## 🔐 Environment Variables

### Backend (Server/.env)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port number | Yes | `5000` |
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for JWT token signing | Yes | `your-super-secret-jwt-key` |
| `EMAIL_USER` | Gmail address for sending emails | No* | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Gmail app password | No* | `your-app-password` |
| `CLIENT_URL` | Frontend URL for email links | No* | `https://your-frontend.netlify.app` |

*Email variables are optional but required if you want welcome emails to be sent.

### Frontend (Coursemaster-Frontend/.env)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | Yes | `https://your-api.vercel.app` |

## 📚 API Documentation

Base URL: `http://localhost:5000/api` (or your deployed server URL)

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

### 🔑 Authentication Endpoints

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### Logout
```http
POST /api/auth/logout
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### Get Current User
```http
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### 📖 Course Endpoints

#### Get All Courses
```http
GET /api/courses
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `q` (optional): Search query
- `category` (optional): Filter by category
- `tags` (optional): Comma-separated tags
- `sort` (optional): `price_asc`, `price_desc`, or default by date

**Example:**
```
GET /api/courses?page=1&limit=10&q=javascript&category=programming
```

**Response:**
```json
{
  "courses": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCourses": 50
  }
}
```

#### Get Course by Slug
```http
GET /api/courses/:slug
```

**Response:**
```json
{
  "course": {
    "_id": "course_id",
    "title": "Course Title",
    "description": "Course description",
    "price": 99.99,
    "category": "programming",
    "tags": ["javascript", "react"],
    "syllabus": [...],
    "instructor": {...},
    "enrollmentCount": 150
  }
}
```

#### Get Course by ID
```http
GET /api/courses/id/:id
```

**Response:** Same as Get Course by Slug

#### Create Course (Admin Only)
```http
POST /api/courses
```

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "title": "Complete JavaScript Course",
  "description": "Learn JavaScript from scratch",
  "price": 99.99,
  "category": "programming",
  "tags": ["javascript", "web-development"],
  "syllabus": [
    {
      "title": "Module 1: Basics",
      "description": "Introduction to JavaScript",
      "order": 0,
      "lessons": [
        {
          "title": "Introduction",
          "description": "Getting started",
          "videoUrl": "https://example.com/video.mp4",
          "duration": 600,
          "order": 0
        }
      ]
    }
  ],
  "batches": [
    {
      "name": "Batch 1",
      "startDate": "2025-01-01",
      "endDate": "2025-03-01"
    }
  ]
}
```

**Response:**
```json
{
  "course": {...}
}
```

#### Update Course (Admin Only)
```http
PUT /api/courses/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:** Same as Create Course

#### Delete Course (Admin Only)
```http
DELETE /api/courses/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "message": "Course deleted successfully"
}
```

---

### 🎓 Enrollment Endpoints

#### Create Enrollment
```http
POST /api/enrollments
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "courseId": "course_id",
  "batch": "batch_id"
}
```

**Response:**
```json
{
  "enrollment": {...}
}
```

#### Get My Enrollments
```http
GET /api/enrollments/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "enrollments": [...]
}
```

#### Get Course Students (Admin Only)
```http
GET /api/enrollments/course/:courseId/students
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "students": [...]
}
```

#### Complete Lesson
```http
POST /api/enrollments/:enrollmentId/lessons/:lessonId/complete
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Lesson marked as complete"
}
```

---

### 📝 Assignment Endpoints

#### Create Assignment Submission
```http
POST /api/assignments
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "courseId": "course_id",
  "module": "Module 1",
  "submission": "Assignment submission text or URL"
}
```

**Response:**
```json
{
  "assignment": {...}
}
```

#### Get Student Assignment
```http
GET /api/assignments/student/submission?courseId=course_id&module=Module%201
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `courseId`: Course ID
- `module`: Module name (URL encoded)

**Response:**
```json
{
  "assignment": {...}
}
```

#### Get Course Assignments (Admin Only)
```http
GET /api/assignments/course/:courseId
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "assignments": [...]
}
```

#### Review Assignment (Admin Only)
```http
PUT /api/assignments/:id/review
```

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "grade": 85,
  "feedback": "Great work! Well done."
}
```

**Response:**
```json
{
  "assignment": {...}
}
```

---

### 🧪 Quiz Endpoints

#### Create Quiz (Admin Only)
```http
POST /api/quizzes
```

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "courseId": "course_id",
  "module": "Module 1",
  "title": "JavaScript Basics Quiz",
  "questions": [
    {
      "question": "What is JavaScript?",
      "options": ["A programming language", "A database", "A framework"],
      "correctAnswer": 0
    }
  ],
  "timeLimit": 600
}
```

**Response:**
```json
{
  "quiz": {...}
}
```

#### Get Quiz by ID
```http
GET /api/quizzes/:quizId
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "quiz": {...}
}
```

#### Get Quiz by Course and Module
```http
GET /api/quizzes/course/:courseId?module=Module%201
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `module`: Module name (URL encoded)

**Response:**
```json
{
  "quiz": {...}
}
```

#### Submit Quiz
```http
POST /api/quizzes/:quizId/submit
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "answers": [0, 1, 2, 0]
}
```

**Response:**
```json
{
  "score": 85,
  "totalQuestions": 10,
  "correctAnswers": 8.5,
  "feedback": "Great job!"
}
```

---

### 🏥 Health Check

#### Server Health
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## 🔒 Authentication & Authorization

### User Roles

- **Student**: Default role for registered users
- **Admin**: Can create, update, and delete courses, review assignments, and manage quizzes

### Protected Routes

Routes marked with `authMiddleware` require a valid JWT token. Routes marked with `adminMiddleware` require both authentication and admin role.

---

## 🚢 Deployment

### Backend Deployment (Vercel)

1. Push your code to GitHub
2. Import the `Server` directory as a project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Frontend Deployment (Netlify)

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set `VITE_API_URL` environment variable in Netlify
4. Redeploy

---

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- Input validation with Zod
- MongoDB injection protection

---

## 📝 Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error message here"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👥 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using React, Node.js, Express, and MongoDB**

