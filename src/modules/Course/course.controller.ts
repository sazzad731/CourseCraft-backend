import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse.js";
import { CourseService } from "./course.service.js";
import { COURSE_MESSAGES } from "./course.constant.js";
import { Role } from "../../../generated/prisma/enums.js";

const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== Role.INSTRUCTOR) {
      throw new Error(COURSE_MESSAGES.NOT_INSTRUCTOR);
    }

    const result = await CourseService.createCourse(req.user.id, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: COURSE_MESSAGES.COURSE_CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user?.id;

    if (!instructorId) {
      throw new Error("User ID not found");
    }

    const result = await CourseService.updateCourse(courseId as string, instructorId, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: COURSE_MESSAGES.COURSE_UPDATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const submitForReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user?.id;

    if (!instructorId) {
      throw new Error("User ID not found");
    }

    const result = await CourseService.submitForReview(courseId as string, instructorId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: COURSE_MESSAGES.COURSE_SUBMITTED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateCourseStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const { status, rejection_reason } = req.body;

    const result = await CourseService.updateCourseStatus({
      courseId: courseId as string,
      status,
      rejection_reason,
    });

    const message = status === "PUBLISHED" ? COURSE_MESSAGES.COURSE_APPROVED : COURSE_MESSAGES.COURSE_REJECTED;

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getPublishedCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await CourseService.getPublishedCourses(Number(page), Number(limit));

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: COURSE_MESSAGES.COURSES_FETCHED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getInstructorCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const instructorId = req.user?.id;

    if (!instructorId) {
      throw new Error("User ID not found");
    }

    const result = await CourseService.getInstructorCourses(instructorId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: COURSE_MESSAGES.COURSES_FETCHED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getPendingCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await CourseService.getPendingCourses(Number(page), Number(limit));

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Pending courses fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;

    const result = await CourseService.getCourseById(courseId as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Course retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user?.id;

    if (!instructorId) {
      throw new Error("User ID not found");
    }

    await CourseService.deleteCourse(courseId as string, instructorId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const CourseController = {
  createCourse,
  updateCourse,
  submitForReview,
  updateCourseStatus,
  getPublishedCourses,
  getInstructorCourses,
  getPendingCourses,
  getCourseById,
  deleteCourse,
};
