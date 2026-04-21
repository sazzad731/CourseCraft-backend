import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { UserRoutes } from "../modules/User/user.route";
import { CourseRoutes } from "../modules/Course/course.route";
import { LessonRoutes } from "../modules/Lesson/lesson.route";
import { EnrollmentRoutes } from "../modules/Enrollment/enrollment.route";
import { QuizRoutes } from "../modules/Quiz/quiz.route";
import { QuizAttemptRoutes } from "../modules/QuizAttempt/quizAttempt.route";
import { LessonProgressRoutes } from "../modules/LessonProgress/lessonProgress.route";
import { CertificateRoutes } from "../modules/Certificate/certificate.route";

const router = Router();

const routeManager = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/courses",
    route: CourseRoutes,
  },
  {
    path: "/lessons",
    route: LessonRoutes,
  },
  {
    path: "/enrollments",
    route: EnrollmentRoutes,
  },
  {
    path: "/quizzes",
    route: QuizRoutes,
  },
  {
    path: "/quiz-attempts",
    route: QuizAttemptRoutes,
  },
  {
    path: "/progress",
    route: LessonProgressRoutes,
  },
  {
    path: "/certificates",
    route: CertificateRoutes,
  },
];

routeManager.forEach((route) => router.use(route.path, route.route));

export default router;
