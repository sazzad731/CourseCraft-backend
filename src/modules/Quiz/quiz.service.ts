import { prisma } from "../../lib/prisma";
import {
  ICreateQuizPayload,
  IUpdateQuizPayload,
  IQuizResponse,
  IQuizWithQuestions,
} from "./quiz.interface";
import { QUIZ_MESSAGES } from "./quiz.constant";

// Create quiz for a course
const createQuiz = async (
  courseId: string,
  payload: ICreateQuizPayload,
  instructorId: string
): Promise<IQuizResponse> => {
  // Verify course exists and instructor owns it
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error(QUIZ_MESSAGES.COURSE_NOT_FOUND);
  }

  if (course.instructor_id !== instructorId) {
    throw new Error("You can only create quizzes for your own courses");
  }

  // Check if quiz already exists for this course
  const existingQuiz = await prisma.quiz.findUnique({
    where: { course_id: courseId },
  });

  if (existingQuiz) {
    throw new Error(QUIZ_MESSAGES.QUIZ_ALREADY_EXISTS);
  }

  const quiz = await prisma.quiz.create({
    data: {
      title: payload.title,
      time_limit: payload.time_limit,
      pass_percentage: payload.pass_percentage || 80,
      course_id: courseId,
    },
  });

  return quiz;
};

// Update quiz
const updateQuiz = async (
  quizId: string,
  payload: IUpdateQuizPayload,
  instructorId: string
): Promise<IQuizResponse> => {
  // Verify quiz exists and instructor owns it
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { course: true },
  });

  if (!quiz) {
    throw new Error(QUIZ_MESSAGES.QUIZ_NOT_FOUND);
  }

  if (quiz.course.instructor_id !== instructorId) {
    throw new Error("You can only update your own quizzes");
  }

  const updatedQuiz = await prisma.quiz.update({
    where: { id: quizId },
    data: payload,
  });

  return updatedQuiz;
};

// Delete quiz
const deleteQuiz = async (quizId: string, instructorId: string): Promise<void> => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { course: true },
  });

  if (!quiz) {
    throw new Error(QUIZ_MESSAGES.QUIZ_NOT_FOUND);
  }

  if (quiz.course.instructor_id !== instructorId) {
    throw new Error("You can only delete your own quizzes");
  }

  await prisma.quiz.delete({
    where: { id: quizId },
  });
};

// Get quiz by ID (with questions and options)
const getQuizById = async (quizId: string): Promise<IQuizWithQuestions> => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          options: {
            select: {
              id: true,
              text: true,
              is_correct: true,
              question_id: true,
            },
          },
        },
      },
    },
  });

  if (!quiz) {
    throw new Error(QUIZ_MESSAGES.QUIZ_NOT_FOUND);
  }

  return quiz;
};

// Get quiz by course ID
const getQuizByCourse = async (courseId: string): Promise<IQuizWithQuestions | null> => {
  const quiz = await prisma.quiz.findUnique({
    where: { course_id: courseId },
    include: {
      questions: {
        include: {
          options: {
            select: {
              id: true,
              text: true,
              is_correct: false, // Don't return correct answers to students
              question_id: true,
            },
          },
        },
      },
    },
  });

  return quiz;
};

export const QuizService = {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizById,
  getQuizByCourse,
};
