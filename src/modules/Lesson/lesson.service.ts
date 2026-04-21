import { prisma } from "../../lib/prisma";
import {
  ICreateLessonPayload,
  IUpdateLessonPayload,
  ILessonResponse,
} from "./lesson.interface";
import { LESSON_MESSAGES } from "./lesson.constant";

// Create lesson
const createLesson = async (
  courseId: string,
  payload: ICreateLessonPayload,
  instructorId: string
): Promise<ILessonResponse> => {
  // Verify course exists and instructor owns it
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error(LESSON_MESSAGES.COURSE_NOT_FOUND);
  }

  if (course.instructor_id !== instructorId) {
    throw new Error("You can only add lessons to your own courses");
  }

  const lesson = await prisma.lesson.create({
    data: {
      ...payload,
      course_id: courseId,
    },
  });

  return lesson;
};

// Update lesson
const updateLesson = async (
  lessonId: string,
  payload: IUpdateLessonPayload,
  instructorId: string
): Promise<ILessonResponse> => {
  // Verify lesson exists and instructor owns it
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });

  if (!lesson) {
    throw new Error(LESSON_MESSAGES.LESSON_NOT_FOUND);
  }

  if (lesson.course.instructor_id !== instructorId) {
    throw new Error("You can only update your own lessons");
  }

  const updatedLesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: payload,
  });

  return updatedLesson;
};

// Delete lesson
const deleteLesson = async (lessonId: string, instructorId: string): Promise<void> => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });

  if (!lesson) {
    throw new Error(LESSON_MESSAGES.LESSON_NOT_FOUND);
  }

  if (lesson.course.instructor_id !== instructorId) {
    throw new Error("You can only delete your own lessons");
  }

  await prisma.lesson.delete({
    where: { id: lessonId },
  });
};

// Get lessons by course
const getLessonsByCourse = async (courseId: string): Promise<ILessonResponse[]> => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error(LESSON_MESSAGES.COURSE_NOT_FOUND);
  }

  const lessons = await prisma.lesson.findMany({
    where: { course_id: courseId },
    orderBy: { position: "asc" },
  });

  return lessons;
};

// Get lesson by ID
const getLessonById = async (lessonId: string): Promise<ILessonResponse> => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });

  if (!lesson) {
    throw new Error(LESSON_MESSAGES.LESSON_NOT_FOUND);
  }

  return lesson;
};

// Reorder lessons
const reorderLessons = async (
  courseId: string,
  lessons: { id: string; position: number }[],
  instructorId: string
): Promise<void> => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error(LESSON_MESSAGES.COURSE_NOT_FOUND);
  }

  if (course.instructor_id !== instructorId) {
    throw new Error("You can only reorder lessons in your own courses");
  }

  // Update positions
  for (const lesson of lessons) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: { position: lesson.position },
    });
  }
};

export const LessonService = {
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonsByCourse,
  getLessonById,
  reorderLessons,
};
