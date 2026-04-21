import express from "express";
import { QuizController } from "./quiz.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

// Public routes
router.get("/:quizId", QuizController.getQuizById);
router.get("/course/:courseId", QuizController.getQuizByCourse);

// Instructor routes
router.post(
  "/course/:courseId",
  auth(Role.INSTRUCTOR),
  QuizController.createQuiz
);

router.patch(
  "/:quizId",
  auth(Role.INSTRUCTOR),
  QuizController.updateQuiz
);

router.delete(
  "/:quizId",
  auth(Role.INSTRUCTOR),
  QuizController.deleteQuiz
);

export const QuizRoutes = router;
