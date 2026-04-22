import { prisma } from "../../lib/prisma.js";
import { IEnrollmentResponse } from "./enrollment.interface.js";
import { ENROLLMENT_MESSAGES } from "./enrollment.constant.js";

// Enroll student in course
const enrollStudent = async (studentId: string, courseId: string): Promise<IEnrollmentResponse> => {
  // Check if course exists
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error(ENROLLMENT_MESSAGES.COURSE_NOT_FOUND);
  }

  // Check if already enrolled
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      user_id_course_id: {
        user_id: studentId,
        course_id: courseId,
      },
    },
  });

  if (existingEnrollment) {
    throw new Error(ENROLLMENT_MESSAGES.ALREADY_ENROLLED);
  }

  // Create enrollment
  const enrollment = await prisma.enrollment.create({
    data: {
      user_id: studentId,
      course_id: courseId,
    },
    include: {
      user: {
        select: {
          id: true,
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

  return enrollment;
};

// Get student enrollments
const getStudentEnrollments = async (studentId: string): Promise<IEnrollmentResponse[]> => {
  const enrollments = await prisma.enrollment.findMany({
    where: { user_id: studentId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          thumbnail: true,
          difficulty: true,
          instructor: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { enrolled_at: "desc" },
  });

  return enrollments as any;
};

// Get course enrollments (instructor view)
const getCourseEnrollments = async (courseId: string): Promise<any[]> => {
  const enrollments = await prisma.enrollment.findMany({
    where: { course_id: courseId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: { enrolled_at: "desc" },
  });

  return enrollments;
};

// Check if student is enrolled
const isEnrolled = async (studentId: string, courseId: string): Promise<boolean> => {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      user_id_course_id: {
        user_id: studentId,
        course_id: courseId,
      },
    },
  });

  return !!enrollment;
};

// Remove enrollment
const removeEnrollment = async (studentId: string, courseId: string): Promise<void> => {
  await prisma.enrollment.delete({
    where: {
      user_id_course_id: {
        user_id: studentId,
        course_id: courseId,
      },
    },
  });
};

export const EnrollmentService = {
  enrollStudent,
  getStudentEnrollments,
  getCourseEnrollments,
  isEnrolled,
  removeEnrollment,
};
