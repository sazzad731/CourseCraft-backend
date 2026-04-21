import { prisma } from "../../lib/prisma";
import {
  ICreateCoursePayload,
  IUpdateCoursePayload,
  IApproveCoursePayload,
  ICourseResponse,
} from "./course.interface";
import { COURSE_MESSAGES } from "./course.constant";
import { CourseStatus } from "../../../generated/prisma/enums";

// Create course (DRAFT by default)
const createCourse = async (
  instructorId: string,
  payload: ICreateCoursePayload
): Promise<ICourseResponse> => {
  const course = await prisma.course.create({
    data: {
      title: payload.title,
      description: payload.description,
      category: payload.category,
      difficulty: payload.difficulty || "Beginner",
      price_type: payload.price_type || "FREE",
      thumbnail: payload.thumbnail,
      status: CourseStatus.DRAFT,
      instructor_id: instructorId,
    },
  });

  return course as ICourseResponse;
};

// Update course
const updateCourse = async (
  courseId: string,
  instructorId: string,
  payload: IUpdateCoursePayload
): Promise<ICourseResponse> => {
  // Verify instructor owns the course
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error(COURSE_MESSAGES.COURSE_NOT_FOUND);
  }

  if (course.instructor_id !== instructorId) {
    throw new Error("You can only update your own courses");
  }

  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: payload,
  });

  return updatedCourse as ICourseResponse;
};

// Submit course for review (change status to PENDING)
const submitForReview = async (
  courseId: string,
  instructorId: string
): Promise<ICourseResponse> => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error(COURSE_MESSAGES.COURSE_NOT_FOUND);
  }

  if (course.instructor_id !== instructorId) {
    throw new Error("You can only submit your own courses");
  }

  if (course.status !== CourseStatus.DRAFT) {
    throw new Error("Only DRAFT courses can be submitted for review");
  }

  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: { status: CourseStatus.PENDING },
  });

  return updatedCourse as ICourseResponse;
};

// Approve or reject course (ADMIN only)
const updateCourseStatus = async (payload: IApproveCoursePayload): Promise<ICourseResponse> => {
  const { courseId, status } = payload;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error(COURSE_MESSAGES.COURSE_NOT_FOUND);
  }

  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: { status: status as CourseStatus },
  });

  return updatedCourse as ICourseResponse;
};

// Get all courses (public - only PUBLISHED)
const getPublishedCourses = async (page: number = 1, limit: number = 10): Promise<any> => {
  const skip = (page - 1) * limit;

  const courses = await prisma.course.findMany({
    where: { status: CourseStatus.PUBLISHED },
    skip,
    take: limit,
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
          lessons: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  const total = await prisma.course.count({
    where: { status: CourseStatus.PUBLISHED },
  });

  return {
    courses,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

// Get instructor's courses
const getInstructorCourses = async (instructorId: string): Promise<ICourseResponse[]> => {
  const courses = await prisma.course.findMany({
    where: { instructor_id: instructorId },
    orderBy: { created_at: "desc" },
  });

  return courses as ICourseResponse[];
};

// Get pending courses (ADMIN only)
const getPendingCourses = async (page: number = 1, limit: number = 10): Promise<any> => {
  const skip = (page - 1) * limit;

  const courses = await prisma.course.findMany({
    where: { status: CourseStatus.PENDING },
    skip,
    take: limit,
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  const total = await prisma.course.count({
    where: { status: CourseStatus.PENDING },
  });

  return {
    courses,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

// Get course by ID
const getCourseById = async (courseId: string): Promise<any> => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      lessons: {
        orderBy: { position: "asc" },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  });

  if (!course) {
    throw new Error(COURSE_MESSAGES.COURSE_NOT_FOUND);
  }

  return course;
};

// Delete course
const deleteCourse = async (courseId: string, instructorId: string): Promise<void> => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error(COURSE_MESSAGES.COURSE_NOT_FOUND);
  }

  if (course.instructor_id !== instructorId) {
    throw new Error("You can only delete your own courses");
  }

  await prisma.course.delete({
    where: { id: courseId },
  });
};

export const CourseService = {
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
