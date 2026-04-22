import { prisma } from "../../lib/prisma.js";
import {
  ILessonProgressResponse,
  ICourseProgressResponse,
} from "./lessonProgress.interface.js";
import { LESSON_PROGRESS_MESSAGES } from "./lessonProgress.constant.js";

// Mark lesson as completed
const markLessonComplete = async (
  studentId: string,
  lessonId: string
): Promise<ILessonProgressResponse> => {
  // Verify lesson exists
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });

  if (!lesson) {
    throw new Error(LESSON_PROGRESS_MESSAGES.LESSON_NOT_FOUND);
  }

  // Find or create progress record
  let progress = await prisma.lessonProgress.findUnique({
    where: {
      user_id_lesson_id: {
        user_id: studentId,
        lesson_id: lessonId,
      },
    },
  });

  if (!progress) {
    progress = await prisma.lessonProgress.create({
      data: {
        user_id: studentId,
        lesson_id: lessonId,
        completed: true,
      },
    });
  } else {
    progress = await prisma.lessonProgress.update({
      where: {
        user_id_lesson_id: {
          user_id: studentId,
          lesson_id: lessonId,
        },
      },
      data: { completed: true },
    });
  }

  return progress;
};

// Get course progress for student
const getCourseProgress = async (
  studentId: string,
  courseId: string
): Promise<ICourseProgressResponse> => {
  // Get all lessons for the course
  const lessons = await prisma.lesson.findMany({
    where: { course_id: courseId },
    orderBy: { position: "asc" },
  });

  // Get progress for each lesson
  const progressRecords = await prisma.lessonProgress.findMany({
    where: {
      user_id: studentId,
      lesson: {
        course_id: courseId,
      },
    },
  });

  const completedCount = progressRecords.filter((p) => p.completed).length;
  const totalLessons = lessons.length;
  const completionPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return {
    total_lessons: totalLessons,
    completed_lessons: completedCount,
    completion_percentage: Math.round(completionPercentage),
    lessons: progressRecords,
  };
};

// Get all completed lessons for a course
const getCompletedLessons = async (
  studentId: string,
  courseId: string
): Promise<ILessonProgressResponse[]> => {
  const progress = await prisma.lessonProgress.findMany({
    where: {
      user_id: studentId,
      completed: true,
      lesson: {
        course_id: courseId,
      },
    },
  });

  return progress;
};

// Check if lesson is completed
const isLessonCompleted = async (studentId: string, lessonId: string): Promise<boolean> => {
  const progress = await prisma.lessonProgress.findUnique({
    where: {
      user_id_lesson_id: {
        user_id: studentId,
        lesson_id: lessonId,
      },
    },
  });

  return progress ? progress.completed : false;
};

// Get student progress in all enrolled courses
const getStudentEnrollmentProgress = async (studentId: string): Promise<any[]> => {
  const enrollments = await prisma.enrollment.findMany({
    where: { user_id: studentId },
    include: {
      course: {
        include: {
          lessons: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  const progressData = await Promise.all(
    enrollments.map(async (enrollment) => {
      const progress = await getCourseProgress(studentId, enrollment.course_id);
      return {
        courseId: enrollment.course_id,
        courseName: enrollment.course.title,
        ...progress,
      };
    })
  );

  return progressData;
};

export const LessonProgressService = {
  markLessonComplete,
  getCourseProgress,
  getCompletedLessons,
  isLessonCompleted,
  getStudentEnrollmentProgress,
};
