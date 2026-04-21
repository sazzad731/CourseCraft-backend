import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { EnrollmentService } from "./enrollment.service";
import { ENROLLMENT_MESSAGES } from "./enrollment.constant";

const enrollStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      throw new Error("User ID not found");
    }

    const result = await EnrollmentService.enrollStudent(studentId, courseId);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: ENROLLMENT_MESSAGES.ENROLLMENT_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentEnrollments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      throw new Error("User ID not found");
    }

    const result = await EnrollmentService.getStudentEnrollments(studentId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: ENROLLMENT_MESSAGES.ENROLLMENTS_FETCHED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseEnrollments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;

    const result = await EnrollmentService.getCourseEnrollments(courseId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: ENROLLMENT_MESSAGES.ENROLLMENTS_FETCHED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const removeEnrollment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      throw new Error("User ID not found");
    }

    await EnrollmentService.removeEnrollment(studentId, courseId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Enrollment removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const EnrollmentController = {
  enrollStudent,
  getStudentEnrollments,
  getCourseEnrollments,
  removeEnrollment,
};
