import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse.js";
import { QuizAttemptService } from "./quizAttempt.service.js";
import { QUIZ_ATTEMPT_MESSAGES } from "./quizAttempt.constant.js";

const submitAttempt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      throw new Error("User ID not found");
    }

    const result = await QuizAttemptService.submitAttempt(studentId, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: QUIZ_ATTEMPT_MESSAGES.ATTEMPT_SUBMITTED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAttemptById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { attemptId } = req.params;

    const result = await QuizAttemptService.getAttemptById(attemptId as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: QUIZ_ATTEMPT_MESSAGES.ATTEMPT_RETRIEVED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUserQuizAttempts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      throw new Error("User ID not found");
    }

    const result = await QuizAttemptService.getUserQuizAttempts(studentId, quizId as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: QUIZ_ATTEMPT_MESSAGES.ATTEMPTS_FETCHED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getQuizAttempts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await QuizAttemptService.getQuizAttempts(
      quizId as string,
      Number(page),
      Number(limit)
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: QUIZ_ATTEMPT_MESSAGES.ATTEMPTS_FETCHED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getBestAttempt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      throw new Error("User ID not found");
    }

    const result = await QuizAttemptService.getBestAttempt(studentId, quizId as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Best attempt retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAttemptsCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      throw new Error("User ID not found");
    }

    const count = await QuizAttemptService.getAttemptsCount(studentId, quizId as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Attempts count retrieved successfully",
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};

export const QuizAttemptController = {
  submitAttempt,
  getAttemptById,
  getUserQuizAttempts,
  getQuizAttempts,
  getBestAttempt,
  getAttemptsCount,
};
