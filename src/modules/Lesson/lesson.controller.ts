import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { LessonService } from "./lesson.service";
import { LESSON_MESSAGES } from "./lesson.constant";

const createLesson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user?.id;

    if (!instructorId) {
      throw new Error("User ID not found");
    }

    const result = await LessonService.createLesson(courseId, req.body, instructorId);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: LESSON_MESSAGES.LESSON_CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateLesson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lessonId } = req.params;
    const instructorId = req.user?.id;

    if (!instructorId) {
      throw new Error("User ID not found");
    }

    const result = await LessonService.updateLesson(lessonId, req.body, instructorId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: LESSON_MESSAGES.LESSON_UPDATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLesson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lessonId } = req.params;
    const instructorId = req.user?.id;

    if (!instructorId) {
      throw new Error("User ID not found");
    }

    await LessonService.deleteLesson(lessonId, instructorId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: LESSON_MESSAGES.LESSON_DELETED,
    });
  } catch (error) {
    next(error);
  }
};

const getLessonsByCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;

    const result = await LessonService.getLessonsByCourse(courseId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: LESSON_MESSAGES.LESSONS_FETCHED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getLessonById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lessonId } = req.params;

    const result = await LessonService.getLessonById(lessonId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Lesson retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const reorderLessons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user?.id;
    const { lessons } = req.body;

    if (!instructorId) {
      throw new Error("User ID not found");
    }

    await LessonService.reorderLessons(courseId, lessons, instructorId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Lessons reordered successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const LessonController = {
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonsByCourse,
  getLessonById,
  reorderLessons,
};
