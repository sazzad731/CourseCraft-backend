import express from "express";
import { LessonProgressController } from "./lessonProgress.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

// Student routes
router.patch(
  "/lesson/:lessonId/complete",
  auth(Role.STUDENT),
  LessonProgressController.markLessonComplete
);

router.get(
  "/course/:courseId",
  auth(Role.STUDENT),
  LessonProgressController.getCourseProgress
);

router.get(
  "/course/:courseId/completed",
  auth(Role.STUDENT),
  LessonProgressController.getCompletedLessons
);

router.get(
  "/lesson/:lessonId/completed",
  auth(Role.STUDENT),
  LessonProgressController.isLessonCompleted
);

router.get(
  "/my-progress",
  auth(Role.STUDENT),
  LessonProgressController.getStudentEnrollmentProgress
);

export const LessonProgressRoutes = router;
