import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route.js";
import { UserRoutes } from "../modules/User/user.route.js";
import { CourseRoutes } from "../modules/Course/course.route.js";
import { LessonRoutes } from "../modules/Lesson/lesson.route.js";
import { EnrollmentRoutes } from "../modules/Enrollment/enrollment.route.js";
import { QuizRoutes } from "../modules/Quiz/quiz.route.js";
import { QuizAttemptRoutes } from "../modules/QuizAttempt/quizAttempt.route.js";
import { LessonProgressRoutes } from "../modules/LessonProgress/lessonProgress.route.js";
import { CertificateRoutes } from "../modules/Certificate/certificate.route.js";
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
