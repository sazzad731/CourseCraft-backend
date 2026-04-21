import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { QuizService } from "./quiz.service";
import { QUIZ_MESSAGES } from "./quiz.constant";

const createQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user?.id;

    if (!instructorId) {
      throw new Error("User ID not found");
    }

    const result = await QuizService.createQuiz(courseId, req.body, instructorId);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: QUIZ_MESSAGES.QUIZ_CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId } = req.params;
    const instructorId = req.user?.id;

    if (!instructorId) {
      throw new Error("User ID not found");
    }

    const result = await QuizService.updateQuiz(quizId, req.body, instructorId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: QUIZ_MESSAGES.QUIZ_UPDATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId } = req.params;
    const instructorId = req.user?.id;

    if (!instructorId) {
      throw new Error("User ID not found");
    }

    await QuizService.deleteQuiz(quizId, instructorId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: QUIZ_MESSAGES.QUIZ_DELETED,
    });
  } catch (error) {
    next(error);
  }
};

const getQuizById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId } = req.params;

    const result = await QuizService.getQuizById(quizId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Quiz retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getQuizByCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;

    const result = await QuizService.getQuizByCourse(courseId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result ? "Quiz retrieved successfully" : "No quiz found for this course",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const QuizController = {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizById,
  getQuizByCourse,
};
