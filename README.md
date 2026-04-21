# Online Course & Quiz Platform - Backend

A production-ready backend for an online course and quiz platform built with Node.js, Express, Prisma, MySQL, and JWT authentication.

## Features

✅ **Authentication & Authorization**
- User registration and login with JWT tokens
- Role-based access control (RBAC) - Student, Instructor, Admin
- User approval workflow by admin
- Secure password hashing with bcryptjs

✅ **Course Management**
- Instructors can create, edit, and submit courses for review
- Admin can approve or reject courses
- Course status workflow: DRAFT → PENDING → PUBLISHED
- Public course listing with pagination

✅ **Lesson Management**
- Create and organize lessons under courses
- Reorder lessons (position-based)
- Preview lessons before course is published
- Support for video URLs and rich content

✅ **Student Enrollment**
- Students can enroll in published courses
- Prevent duplicate enrollments
- Track enrollment history
- View enrolled courses with progress

✅ **Quiz System**
- Create MCQ quizzes with 4 options per question
- Set time limits and passing percentages
- One quiz per course (unique constraint)
- Multiple quiz attempts with tracking

✅ **Quiz Submission & Scoring**
- Students submit quiz answers
- Automatic score calculation
- Pass/Fail determination based on pass_percentage
- Auto-generate certificates on passing

✅ **Lesson Progress Tracking**
- Mark lessons as completed
- Track course completion percentage
- View progress across all enrolled courses

✅ **Certificate Management**
- Auto-generate certificates when student passes quiz
- View earned certificates
- Instructor can view course completion stats

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js (TypeScript)
- **Database:** MySQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Environment Config:** dotenv

---

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MySQL Server
- Git

---

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (MariaDB/MySQL)
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=online_quiz_platform

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-in-production

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 4. Setup Database

Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

This will:
- Create the database if it doesn't exist
- Create all tables based on Prisma models
- Generate the Prisma client

### 5. (Optional) Seed Admin User

Create a script file `src/script/seedAdmin.ts`:

```typescript
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log("Admin created:", admin);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
```

Then run:
```bash
npm run seed:admin
```

---

## Running the Application

### Development Mode
```bash
npm run dev
```

The server will start on `http://localhost:5000` with hot reload enabled.

### Production Build
```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── config/               # Configuration files
├── lib/                  # External libraries setup (Prisma)
├── middlewares/          # Express middlewares
│   ├── auth.ts          # JWT authentication & RBAC
│   ├── globalErrorHandler.ts
│   └── notFound.ts
├── modules/             # Feature modules
│   ├── Auth/            # Authentication
│   ├── User/            # User management (admin)
│   ├── Course/          # Course management
│   ├── Lesson/          # Lesson management
│   ├── Enrollment/      # Student enrollments
│   ├── Quiz/            # Quiz management
│   ├── QuizAttempt/     # Quiz submission
│   ├── LessonProgress/  # Progress tracking
│   └── Certificate/     # Certificate management
├── utils/               # Utility functions
├── routes/              # Route aggregator
├── app.ts               # Express app setup
└── server.ts            # Entry point

prisma/
├── schema/              # Prisma models
│   ├── user.prisma
│   ├── course.prisma
│   ├── lesson.prisma
│   ├── enrollment.prisma
│   ├── quiz.prisma
│   ├── question.prisma
│   ├── option.prisma
│   ├── quizAttempt.prisma
│   ├── lessonProgress.prisma
│   └── certificate.prisma
└── migrations/          # Database migrations
```

---

## Module Structure

Each module follows this standard pattern:

```
Module/
├── {module}.constant.ts     # Constants (messages, statuses)
├── {module}.interface.ts    # TypeScript interfaces
├── {module}.service.ts      # Business logic
├── {module}.controller.ts   # Request handlers
└── {module}.route.ts        # Route definitions
```

This ensures:
- ✅ Clean separation of concerns
- ✅ Easy testing
- ✅ Code reusability
- ✅ Maintainability

---

## Database Models

### User
```typescript
- id (UUID)
- name, email, password
- role (STUDENT, INSTRUCTOR, ADMIN)
- status (PENDING, ACTIVE, REJECTED, SUSPENDED)
- phone, address, image (optional)
- rejection_reason (optional)
- timestamps
```

### Course
```typescript
- id (UUID)
- title, description, category
- difficulty, price_type
- status (DRAFT, PENDING, PUBLISHED)
- instructor_id (foreign key)
- thumbnail (optional)
- timestamps
```

### Lesson
```typescript
- id (UUID)
- title, content, video_url
- is_preview, position (ordering)
- course_id (foreign key)
- timestamps
```

### Enrollment
```typescript
- id (UUID)
- user_id, course_id (unique combination)
- enrolled_at
```

### Quiz
```typescript
- id (UUID)
- title, time_limit, pass_percentage
- course_id (unique - one quiz per course)
- timestamps
```

### Question
```typescript
- id (UUID)
- question_text
- quiz_id (foreign key)
```

### Option
```typescript
- id (UUID)
- text, is_correct
- question_id (foreign key)
```

### QuizAttempt
```typescript
- id (UUID)
- user_id, quiz_id (foreign keys)
- score, is_passed
- attempted_at
```

### LessonProgress
```typescript
- id (UUID)
- user_id, lesson_id (unique combination)
- completed
- updated_at
```

### Certificate
```typescript
- id (UUID)
- user_id, course_id (unique combination)
- score, issued_at
```

---

## API Endpoints Summary

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (protected)

### User Management (Admin)
- `GET /api/v1/users/pending` - Get pending users (admin)
- `GET /api/v1/users` - Get all users (admin)
- `PATCH /api/v1/users/:userId/status` - Approve/reject user (admin)
- `PATCH /api/v1/users/profile/update` - Update profile (protected)

### Courses
- `GET /api/v1/courses/published` - Get published courses (public)
- `GET /api/v1/courses/:courseId` - Get course details (public)
- `POST /api/v1/courses` - Create course (instructor)
- `PATCH /api/v1/courses/:courseId` - Update course (instructor)
- `PATCH /api/v1/courses/:courseId/submit` - Submit for review (instructor)
- `GET /api/v1/courses/pending` - Get pending courses (admin)
- `PATCH /api/v1/courses/:courseId/status` - Approve/reject (admin)

### Lessons
- `GET /api/v1/lessons/course/:courseId` - Get lessons (public)
- `POST /api/v1/lessons/course/:courseId` - Create lesson (instructor)
- `PATCH /api/v1/lessons/:lessonId` - Update lesson (instructor)
- `DELETE /api/v1/lessons/:lessonId` - Delete lesson (instructor)
- `PATCH /api/v1/lessons/course/:courseId/reorder` - Reorder lessons (instructor)

### Enrollments
- `POST /api/v1/enrollments/course/:courseId` - Enroll (student)
- `GET /api/v1/enrollments/my-enrollments` - Get my courses (student)
- `GET /api/v1/enrollments/course/:courseId/students` - Get enrollments (instructor)
- `DELETE /api/v1/enrollments/course/:courseId` - Remove enrollment (student)

### Quizzes
- `POST /api/v1/quizzes/course/:courseId` - Create quiz (instructor)
- `GET /api/v1/quizzes/:quizId` - Get quiz with questions (public)
- `GET /api/v1/quizzes/course/:courseId` - Get course quiz (public)
- `PATCH /api/v1/quizzes/:quizId` - Update quiz (instructor)
- `DELETE /api/v1/quizzes/:quizId` - Delete quiz (instructor)

### Quiz Attempts
- `POST /api/v1/quiz-attempts/submit` - Submit attempt (student)
- `GET /api/v1/quiz-attempts/quiz/:quizId/my-attempts` - Get my attempts (student)
- `GET /api/v1/quiz-attempts/quiz/:quizId/best` - Get best attempt (student)
- `GET /api/v1/quiz-attempts/quiz/:quizId/count` - Get attempt count (student)
- `GET /api/v1/quiz-attempts/quiz/:quizId/attempts` - Get all attempts (instructor)

### Lesson Progress
- `PATCH /api/v1/progress/lesson/:lessonId/complete` - Mark complete (student)
- `GET /api/v1/progress/course/:courseId` - Get course progress (student)
- `GET /api/v1/progress/my-progress` - Get all progress (student)

### Certificates
- `GET /api/v1/certificates/my-certificates` - Get my certificates (student)
- `GET /api/v1/certificates/course/:courseId/check` - Check certificate (student)
- `GET /api/v1/certificates/course/:courseId/certificates` - Get course certificates (instructor)
- `GET /api/v1/certificates/course/:courseId/statistics` - Get stats (instructor)

---

## Error Handling

The API follows a consistent error response format:

```json
{
  "success": false,
  "message": "User-friendly error message",
  "error": "Detailed error information"
}
```

### Common HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

## Authentication & Authorization

### JWT Token Structure
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "STUDENT|INSTRUCTOR|ADMIN",
  "status": "ACTIVE|PENDING|REJECTED",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Token Expiry
- Access Token: 7 days
- Refresh: Not implemented (use same token)

### Cookie Setup
- Name: `token`
- HttpOnly: Yes (prevents XSS)
- Secure: Yes (in production)
- SameSite: Strict

---

## Role-Based Access Control

| Feature | STUDENT | INSTRUCTOR | ADMIN |
|---------|---------|-----------|-------|
| Register | ✓ | ✓ | ✗ |
| Create Course | ✗ | ✓ | ✗ |
| Enroll Course | ✓ | ✗ | ✗ |
| Submit Quiz | ✓ | ✗ | ✗ |
| Create Quiz | ✗ | ✓ | ✗ |
| Mark Lesson Done | ✓ | ✗ | ✗ |
| View Certificate | ✓ | ✓ | ✗ |
| Approve Users | ✗ | ✗ | ✓ |
| Publish Courses | ✗ | ✗ | ✓ |
| View All Users | ✗ | ✗ | ✓ |

---

## Common Workflows

### 1. User Registration & Approval
```
1. User registers → status = PENDING
2. Admin views pending users
3. Admin approves → status = ACTIVE
4. User can now login
```

### 2. Course Creation & Publishing
```
1. Instructor creates course → status = DRAFT
2. Instructor adds lessons
3. Instructor submits for review → status = PENDING
4. Admin reviews and approves → status = PUBLISHED
5. Students can now enroll
```

### 3. Student Learning Path
```
1. Student enrolls in published course
2. Student views lessons (progress 0%)
3. Student marks lessons as complete
4. Student takes quiz (all lessons completed optional)
5. If score >= pass_percentage:
   - Certificate auto-generated
   - Status = PASSED
6. If score < pass_percentage:
   - Can retry quiz (up to max attempts)
   - Status = FAILED
```

### 4. Instructor Dashboard
```
1. View my courses (all statuses)
2. View enrollments per course
3. View quiz attempts
4. View certificates issued
5. View course statistics
```

---

## Best Practices Implemented

✅ **Security**
- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens for stateless authentication
- HttpOnly cookies prevent XSS
- Role-based access control
- Input validation

✅ **Database**
- Foreign key constraints
- Unique constraints (prevent duplicates)
- Indexes on frequently queried columns
- Cascade delete for related records

✅ **Code Quality**
- TypeScript for type safety
- Consistent error handling
- Modular architecture
- Clear separation of concerns
- RESTful API design

✅ **Performance**
- Pagination on list endpoints
- Efficient database queries
- Proper indexing

---

## Troubleshooting

### Database Connection Error
```
Error: Cannot connect to database
→ Check DATABASE_* env variables
→ Ensure MySQL is running
→ Verify database exists
```

### JWT Token Error
```
Error: Token not found / Invalid token
→ Check cookie is being sent
→ Verify JWT_SECRET matches
→ Check token expiration
```

### Prisma Migration Error
```
Error: Migration failed
→ Delete migrations and start fresh:
  rm -rf prisma/migrations
  npx prisma migrate dev --name init
```

### Port Already in Use
```
Error: Port 5000 already in use
→ Change PORT in .env
→ Or kill process: lsof -ti :5000 | xargs kill -9
```

---

## Next Steps

1. **Add Question/Option Management**: Create endpoints to manage quiz questions and options
2. **Add Refresh Token**: Implement refresh token rotation
3. **Add File Upload**: Integrate file storage for course thumbnails and videos
4. **Add Search**: Implement course search and filtering
5. **Add Notifications**: Send emails on status changes
6. **Add Analytics**: Track user behavior and course engagement
7. **Add Wishlist**: Allow students to save courses for later
8. **Add Ratings**: Enable course reviews and ratings

---

## Support & Documentation

- Full API documentation: See `API_DOCUMENTATION.md`
- Postman Collection: See `postman_collection.json` (to be created)
- Database schema: See `prisma/schema/`

---

## License

ISC

---

## Contact

For issues or questions, please open an issue in the repository.
