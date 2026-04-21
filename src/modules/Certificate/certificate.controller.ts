import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { CertificateService } from "./certificate.service";
import { CERTIFICATE_MESSAGES } from "./certificate.constant";

const getStudentCertificates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      throw new Error("User ID not found");
    }

    const result = await CertificateService.getStudentCertificates(studentId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.length > 0 ? CERTIFICATE_MESSAGES.CERTIFICATES_FETCHED : CERTIFICATE_MESSAGES.NO_CERTIFICATES,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCertificateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { certificateId } = req.params;

    const result = await CertificateService.getCertificateById(certificateId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: CERTIFICATE_MESSAGES.CERTIFICATE_FETCHED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const hasCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      throw new Error("User ID not found");
    }

    const result = await CertificateService.hasCertificate(studentId, courseId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result ? "Certificate found" : "No certificate found",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseCertificates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await CertificateService.getCourseCertificates(
      courseId,
      Number(page),
      Number(limit)
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: CERTIFICATE_MESSAGES.CERTIFICATES_FETCHED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;

    const result = await CertificateService.getCourseStatistics(courseId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Course statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const CertificateController = {
  getStudentCertificates,
  getCertificateById,
  hasCertificate,
  getCourseCertificates,
  getCourseStatistics,
};
