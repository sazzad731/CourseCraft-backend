import { prisma } from "../../lib/prisma";
import { ICertificateResponse } from "./certificate.interface";
import { CERTIFICATE_MESSAGES } from "./certificate.constant";

// Get student certificates
const getStudentCertificates = async (studentId: string): Promise<ICertificateResponse[]> => {
  const certificates = await prisma.certificate.findMany({
    where: { user_id: studentId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
    },
    orderBy: { issued_at: "desc" },
  });

  return certificates;
};

// Get certificate by ID
const getCertificateById = async (certificateId: string): Promise<ICertificateResponse> => {
  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
    },
  });

  if (!certificate) {
    throw new Error(CERTIFICATE_MESSAGES.CERTIFICATE_NOT_FOUND);
  }

  return certificate;
};

// Check if student has certificate for a course
const hasCertificate = async (studentId: string, courseId: string): Promise<ICertificateResponse | null> => {
  const certificate = await prisma.certificate.findUnique({
    where: {
      user_id_course_id: {
        user_id: studentId,
        course_id: courseId,
      },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
    },
  });

  return certificate;
};

// Get all certificates for a course (instructor view)
const getCourseCertificates = async (courseId: string, page: number = 1, limit: number = 10): Promise<any> => {
  const skip = (page - 1) * limit;

  const certificates = await prisma.certificate.findMany({
    where: { course_id: courseId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: { issued_at: "desc" },
  });

  const total = await prisma.certificate.count({
    where: { course_id: courseId },
  });

  return {
    certificates,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

// Get statistics for a course (certificates issued, etc.)
const getCourseStatistics = async (courseId: string): Promise<any> => {
  const totalCertificates = await prisma.certificate.count({
    where: { course_id: courseId },
  });

  const enrollmentCount = await prisma.enrollment.count({
    where: { course_id: courseId },
  });

  const completionRate = enrollmentCount > 0 ? (totalCertificates / enrollmentCount) * 100 : 0;

  return {
    courseId,
    totalCertificates,
    totalEnrollments: enrollmentCount,
    completionRate: Math.round(completionRate),
  };
};

export const CertificateService = {
  getStudentCertificates,
  getCertificateById,
  hasCertificate,
  getCourseCertificates,
  getCourseStatistics,
};
