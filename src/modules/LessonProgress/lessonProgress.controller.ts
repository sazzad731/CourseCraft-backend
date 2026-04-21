import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { LessonProgressService } from "./lessonProgress.service";
import { LESSON_PROGRESS_MESSAGES } from "./lessonProgress.constant";

const markLessonComplete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lessonId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      throw new Error("User ID not found");
    }

    const result = await LessonProgressService.markLessonComplete(studentId, lessonId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: LESSON_PROGRESS_MESSAGES.PROGRESS_UPDATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      throw new Error("User ID not found");
    }

    const result = await LessonProgressService.getCourseProgress(studentId, courseId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: LESSON_PROGRESS_MESSAGES.PROGRESS_FETCHED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCompletedLessons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      throw new Error("User ID not found");
    }

    const result = await LessonProgressService.getCompletedLessons(studentId, courseId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Completed lessons fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const isLessonCompleted = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lessonId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      throw new Error("User ID not found");
    }

    const isCompleted = await LessonProgressService.isLessonCompleted(studentId, lessonId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Lesson completion status retrieved successfully",
      data: { isCompleted },
    });
  } catch (error) {
    next(error);
  }
};

const getStudentEnrollmentProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      throw new Error("User ID not found");
    }

    const result = await LessonProgressService.getStudentEnrollmentProgress(studentId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Student progress retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const LessonProgressController = {
  markLessonComplete,
  getCourseProgress,
  getCompletedLessons,
  isLessonCompleted,
  getStudentEnrollmentProgress,
};
