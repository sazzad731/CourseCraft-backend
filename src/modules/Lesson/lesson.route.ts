import express from "express";
import { LessonController } from "./lesson.controller.js";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = express.Router();

// Get lessons by course (public)
router.get("/course/:courseId", LessonController.getLessonsByCourse);

// Get lesson by ID (public)
router.get("/:lessonId", LessonController.getLessonById);

// Instructor routes
router.post(
  "/course/:courseId",
  auth(Role.INSTRUCTOR),
  LessonController.createLesson
);

router.patch(
  "/:lessonId",
  auth(Role.INSTRUCTOR),
  LessonController.updateLesson
);

router.delete(
  "/:lessonId",
  auth(Role.INSTRUCTOR),
  LessonController.deleteLesson
);

router.patch(
  "/course/:courseId/reorder",
  auth(Role.INSTRUCTOR),
  LessonController.reorderLessons
);

export const LessonRoutes = router;
