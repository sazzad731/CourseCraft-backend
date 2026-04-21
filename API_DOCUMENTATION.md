# Online Course & Quiz Platform - Backend API Documentation

## Project Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── index.ts                 # Configuration (port, database, JWT secret)
│   ├── lib/
│   │   └── prisma.ts               # Prisma client initialization
│   ├── middlewares/
│   │   ├── auth.ts                 # JWT authentication & role-based access
│   │   ├── globalErrorHandler.ts   # Global error handling middleware
│   │   └── notFound.ts             # 404 handler
│   ├── modules/
│   │   ├── Auth/
│   │   │   ├── auth.constant.ts    # Constants
│   │   │   ├── auth.interface.ts   # Type definitions
│   │   │   ├── auth.service.ts     # Business logic
│   │   │   ├── auth.controller.ts  # Request handlers
│   │   │   └── auth.route.ts       # Route definitions
│   │   ├── User/                   # User management (admin operations)
│   │   ├── Course/                 # Course CRUD & workflow
│   │   ├── Lesson/                 # Lesson management & ordering
│   │   ├── Enrollment/             # Student enrollments
│   │   ├── Quiz/                   # Quiz management
│   │   ├── QuizAttempt/           # Quiz submission & scoring
│   │   ├── LessonProgress/         # Student progress tracking
│   │   └── Certificate/            # Certificate management
│   ├── utils/
│   │   └── sendResponse.ts         # Response formatter
│   ├── routes/
│   │   └── index.ts                # Route aggregator
│   ├── app.ts                      # Express app setup
│   └── server.ts                   # Server entry point
├── prisma/
│   ├── schema/
│   │   ├── schema.prisma           # Main schema (generator config)
│   │   ├── user.prisma             # User model
│   │   ├── course.prisma           # Course model
│   │   ├── lesson.prisma           # Lesson model
│   │   ├── enrollment.prisma       # Enrollment model
│   │   ├── quiz.prisma             # Quiz model
│   │   ├── question.prisma         # Question model
│   │   ├── option.prisma           # Quiz option model
│   │   ├── quizAttempt.prisma      # Quiz attempt model
│   │   ├── lessonProgress.prisma   # Lesson progress model
│   │   └── certificate.prisma      # Certificate model
│   └── migrations/                 # Database migrations
├── generated/
│   └── prisma/
│       └── client/                 # Prisma client (auto-generated)
├── package.json
├── tsconfig.json
└── .env
```

## API Base URL
```
http://localhost:5000/api/v1
```

---

## Authentication API

### 1. Register User
**POST** `/auth/register`

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT" // or "INSTRUCTOR"
}
```

Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "status": "PENDING"
  }
}
```

---

### 2. Login User
**POST** `/auth/login`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT",
      "status": "ACTIVE"
    }
  }
}
```

---

### 3. Get Current User
**GET** `/auth/me`

Headers: `Cookie: token=jwt_token`

Response (200):
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "status": "ACTIVE",
    "phone": "+1234567890",
    "address": "123 Main St"
  }
}
```

---

## User Management API (Admin Only)

### 1. Get Pending Users
**GET** `/users/pending`

Auth: `ADMIN` role required

Response (200):
```json
{
  "success": true,
  "message": "Pending users fetched successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Jane Instructor",
      "email": "jane@example.com",
      "role": "INSTRUCTOR",
      "status": "PENDING"
    }
  ]
}
```

---

### 2. Get All Users
**GET** `/users?page=1&limit=10&role=INSTRUCTOR&status=ACTIVE`

Auth: `ADMIN` role required

Response (200):
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "users": [...],
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

---

### 3. Approve/Reject User
**PATCH** `/users/:userId/status`

Auth: `ADMIN` role required

Request Body:
```json
{
  "status": "ACTIVE", // or "REJECTED"
  "rejection_reason": "Reason for rejection (required if rejected)"
}
```

Response (200): User with updated status

---

### 4. Update User Profile
**PATCH** `/users/profile/update`

Auth: Any authenticated user

Request Body:
```json
{
  "name": "New Name",
  "phone": "+1234567890",
  "address": "New Address",
  "image": "image_url"
}
```

---

## Course API

### 1. Create Course (Instructor)
**POST** `/courses`

Auth: `INSTRUCTOR` role required

Request Body:
```json
{
  "title": "JavaScript Basics",
  "description": "Learn JavaScript from scratch",
  "category": "Programming",
  "difficulty": "Beginner", // Beginner, Intermediate, Advanced
  "price_type": "FREE", // FREE, PAID
  "thumbnail": "image_url"
}
```

Response (201): Course (DRAFT status)

---

### 2. Update Course
**PATCH** `/courses/:courseId`

Auth: `INSTRUCTOR` role (must be course owner)

Request Body: Same as create

---

### 3. Submit Course for Review
**PATCH** `/courses/:courseId/submit`

Auth: `INSTRUCTOR` role (must be course owner)

Changes status from DRAFT → PENDING

---

### 4. Approve/Reject Course (Admin)
**PATCH** `/courses/:courseId/status`

Auth: `ADMIN` role required

Request Body:
```json
{
  "status": "PUBLISHED", // or "REJECTED"
  "rejection_reason": "Optional rejection reason"
}
```

---

### 5. Get Published Courses (Public)
**GET** `/courses/published?page=1&limit=10`

Response: Paginated list of PUBLISHED courses

---

### 6. Get Course by ID (Public)
**GET** `/courses/:courseId`

Response: Course with lessons and enrollment count

---

### 7. Get Pending Courses (Admin)
**GET** `/courses/pending?page=1&limit=10`

Auth: `ADMIN` role required

---

### 8. Get My Courses (Instructor)
**GET** `/courses/instructor/my-courses`

Auth: `INSTRUCTOR` role required

---

## Lesson API

### 1. Create Lesson
**POST** `/lessons/course/:courseId`

Auth: `INSTRUCTOR` role required

Request Body:
```json
{
  "title": "Lesson Title",
  "content": "Lesson content",
  "video_url": "https://video-url.com",
  "is_preview": false,
  "position": 1
}
```

---

### 2. Update Lesson
**PATCH** `/lessons/:lessonId`

Auth: `INSTRUCTOR` role (must be owner)

---

### 3. Delete Lesson
**DELETE** `/lessons/:lessonId`

Auth: `INSTRUCTOR` role (must be owner)

---

### 4. Get Lessons by Course
**GET** `/lessons/course/:courseId`

Response: Lessons ordered by position

---

### 5. Reorder Lessons
**PATCH** `/lessons/course/:courseId/reorder`

Auth: `INSTRUCTOR` role required

Request Body:
```json
{
  "lessons": [
    { "id": "lesson-id-1", "position": 1 },
    { "id": "lesson-id-2", "position": 2 }
  ]
}
```

---

## Enrollment API

### 1. Enroll Student in Course
**POST** `/enrollments/course/:courseId`

Auth: `STUDENT` role required

Response: Enrollment created

---

### 2. Get My Enrollments
**GET** `/enrollments/my-enrollments`

Auth: `STUDENT` role required

Response: List of enrolled courses with details

---

### 3. Get Course Enrollments (Instructor)
**GET** `/enrollments/course/:courseId/students`

Auth: `INSTRUCTOR` role required

Response: List of students enrolled in course

---

### 4. Remove Enrollment
**DELETE** `/enrollments/course/:courseId`

Auth: `STUDENT` role required

---

## Quiz API

### 1. Create Quiz
**POST** `/quizzes/course/:courseId`

Auth: `INSTRUCTOR` role required

Request Body:
```json
{
  "title": "Quiz Title",
  "time_limit": 30, // in minutes
  "pass_percentage": 80
}
```

**Note:** One quiz per course

---

### 2. Update Quiz
**PATCH** `/quizzes/:quizId`

Auth: `INSTRUCTOR` role required

---

### 3. Delete Quiz
**DELETE** `/quizzes/:quizId`

Auth: `INSTRUCTOR` role required

---

### 4. Get Quiz by ID
**GET** `/quizzes/:quizId`

Response: Quiz with all questions and options

---

### 5. Get Quiz by Course
**GET** `/quizzes/course/:courseId`

Response: Quiz with questions (correct answers hidden for students)

---

## Quiz Attempt API

### 1. Submit Quiz Attempt
**POST** `/quiz-attempts/submit`

Auth: `STUDENT` role required

Request Body:
```json
{
  "quizId": "uuid",
  "answers": [
    {
      "questionId": "uuid",
      "selectedOptionId": "uuid"
    }
  ]
}
```

Response (201):
```json
{
  "success": true,
  "message": "Quiz attempt submitted successfully",
  "data": {
    "id": "uuid",
    "score": 85.5,
    "is_passed": true,
    "totalQuestions": 10,
    "correctAnswers": 8,
    "passPercentage": 80
  }
}
```

**Note:** If score >= pass_percentage, a certificate is auto-generated

---

### 2. Get My Quiz Attempts
**GET** `/quiz-attempts/quiz/:quizId/my-attempts`

Auth: `STUDENT` role required

Response: All attempts for this quiz (ordered by most recent)

---

### 3. Get Best Attempt
**GET** `/quiz-attempts/quiz/:quizId/best`

Auth: `STUDENT` role required

Response: Highest score attempt

---

### 4. Get Attempts Count
**GET** `/quiz-attempts/quiz/:quizId/count`

Auth: `STUDENT` role required

Response: `{ "count": 2 }`

---

### 5. Get Quiz Attempts (Instructor)
**GET** `/quiz-attempts/quiz/:quizId/attempts?page=1&limit=10`

Auth: `INSTRUCTOR` role required

Response: All student attempts for the quiz

---

## Lesson Progress API

### 1. Mark Lesson as Complete
**PATCH** `/progress/lesson/:lessonId/complete`

Auth: `STUDENT` role required

---

### 2. Get Course Progress
**GET** `/progress/course/:courseId`

Auth: `STUDENT` role required

Response:
```json
{
  "total_lessons": 10,
  "completed_lessons": 7,
  "completion_percentage": 70,
  "lessons": [...]
}
```

---

### 3. Get Student Progress Summary
**GET** `/progress/my-progress`

Auth: `STUDENT` role required

Response: Progress for all enrolled courses

---

## Certificate API

### 1. Get My Certificates
**GET** `/certificates/my-certificates`

Auth: `STUDENT` role required

Response: All earned certificates

---

### 2. Check Certificate for Course
**GET** `/certificates/course/:courseId/check`

Auth: `STUDENT` role required

Response: Certificate if exists, null otherwise

---

### 3. Get Course Certificates (Instructor)
**GET** `/certificates/course/:courseId/certificates?page=1&limit=10`

Auth: `INSTRUCTOR` role required

Response: All certificates issued for this course

---

### 4. Get Course Statistics
**GET** `/certificates/course/:courseId/statistics`

Auth: `INSTRUCTOR` role required

Response:
```json
{
  "courseId": "uuid",
  "totalCertificates": 5,
  "totalEnrollments": 20,
  "completionRate": 25
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

### Common Status Codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## Authentication Flow

1. **Register** → User created with status `PENDING`
2. **Admin approves** → Status changes to `ACTIVE`
3. **User logs in** → JWT token issued
4. **Token sent in Cookie** → Authenticated for protected routes
5. **Token contains user role** → Used for role-based access control

---

## Role-Based Access Control

| Endpoint | STUDENT | INSTRUCTOR | ADMIN |
|----------|---------|-----------|-------|
| Register | ✓ | ✓ | ✗ |
| Create Course | ✗ | ✓ | ✗ |
| Submit Quiz | ✓ | ✗ | ✗ |
| Approve Users | ✗ | ✗ | ✓ |
| View Certificates | ✓ | ✓ | ✗ |
| Enroll Course | ✓ | ✗ | ✗ |

---

## Environment Variables (.env)

```
PORT=5000
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=online_quiz_platform
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

---

## Setup & Running

1. Install dependencies:
```bash
npm install
```

2. Setup database:
```bash
npx prisma migrate dev --name init
```

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

---
