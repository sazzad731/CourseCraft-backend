import express from "express";
import { QuizAttemptController } from "./quizAttempt.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

// Student routes
router.post(
  "/submit",
  auth(Role.STUDENT),
  QuizAttemptController.submitAttempt
);

router.get(
  "/:attemptId",
  auth(Role.STUDENT, Role.INSTRUCTOR),
  QuizAttemptController.getAttemptById
);

router.get(
  "/quiz/:quizId/my-attempts",
  auth(Role.STUDENT),
  QuizAttemptController.getUserQuizAttempts
);

router.get(
  "/quiz/:quizId/best",
  auth(Role.STUDENT),
  QuizAttemptController.getBestAttempt
);

router.get(
  "/quiz/:quizId/count",
  auth(Role.STUDENT),
  QuizAttemptController.getAttemptsCount
);

// Instructor routes
router.get(
  "/quiz/:quizId/attempts",
  auth(Role.INSTRUCTOR),
  QuizAttemptController.getQuizAttempts
);

export const QuizAttemptRoutes = router;
