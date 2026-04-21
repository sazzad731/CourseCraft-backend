import { prisma } from "../../lib/prisma";
import {
  ISubmitAttemptPayload,
  IQuizAttemptResponse,
  IAttemptResult,
} from "./quizAttempt.interface";
import { QUIZ_ATTEMPT_MESSAGES } from "./quizAttempt.constant";

// Submit quiz attempt and calculate score
const submitAttempt = async (
  studentId: string,
  payload: ISubmitAttemptPayload
): Promise<IAttemptResult> => {
  const { quizId, answers } = payload;

  // Get quiz with questions and options
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  if (!quiz) {
    throw new Error(QUIZ_ATTEMPT_MESSAGES.QUIZ_NOT_FOUND);
  }

  // Check max attempts (if configured)
  if (quiz && 5) { // Default max attempts
    const attemptCount = await prisma.quizAttempt.count({
      where: {
        user_id: studentId,
        quiz_id: quizId,
      },
    });

    if (attemptCount >= 5) {
      throw new Error(QUIZ_ATTEMPT_MESSAGES.MAX_ATTEMPTS_EXCEEDED);
    }
  }

  // Calculate score
  let correctAnswers = 0;
  const totalQuestions = quiz.questions.length;

  for (const answer of answers) {
    const question = quiz.questions.find((q) => q.id === answer.questionId);
    if (!question) continue;

    const selectedOption = question.options.find((o) => o.id === answer.selectedOptionId);
    if (selectedOption && selectedOption.is_correct) {
      correctAnswers++;
    }
  }

  const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const isPassed = score >= quiz.pass_percentage;

  // Create quiz attempt record
  const attempt = await prisma.quizAttempt.create({
    data: {
      user_id: studentId,
      quiz_id: quizId,
      score,
      is_passed: isPassed,
    },
  });

  // If passed, create certificate
  if (isPassed) {
    const course = await prisma.course.findUnique({
      where: { id: quiz.course_id },
    });

    if (course) {
      try {
        await prisma.certificate.create({
          data: {
            user_id: studentId,
            course_id: course.id,
            score,
          },
        });
      } catch {
        // Certificate might already exist (unique constraint)
      }
    }
  }

  return {
    ...attempt,
    totalQuestions,
    correctAnswers,
    passPercentage: quiz.pass_percentage,
  };
};

// Get attempt by ID
const getAttemptById = async (attemptId: string): Promise<IQuizAttemptResponse> => {
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
  });

  if (!attempt) {
    throw new Error(QUIZ_ATTEMPT_MESSAGES.ATTEMPT_NOT_FOUND);
  }

  return attempt;
};

// Get user's attempts for a quiz
const getUserQuizAttempts = async (studentId: string, quizId: string): Promise<IQuizAttemptResponse[]> => {
  const attempts = await prisma.quizAttempt.findMany({
    where: {
      user_id: studentId,
      quiz_id: quizId,
    },
    orderBy: { attempted_at: "desc" },
  });

  return attempts;
};

// Get all attempts for a quiz (instructor view)
const getQuizAttempts = async (quizId: string, page: number = 1, limit: number = 10): Promise<any> => {
  const skip = (page - 1) * limit;

  const attempts = await prisma.quizAttempt.findMany({
    where: { quiz_id: quizId },
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
    orderBy: { attempted_at: "desc" },
  });

  const total = await prisma.quizAttempt.count({
    where: { quiz_id: quizId },
  });

  return {
    attempts,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

// Get best attempt for a quiz
const getBestAttempt = async (studentId: string, quizId: string): Promise<IQuizAttemptResponse | null> => {
  const attempt = await prisma.quizAttempt.findFirst({
    where: {
      user_id: studentId,
      quiz_id: quizId,
    },
    orderBy: { score: "desc" },
  });

  return attempt;
};

// Get attempts count
const getAttemptsCount = async (studentId: string, quizId: string): Promise<number> => {
  return await prisma.quizAttempt.count({
    where: {
      user_id: studentId,
      quiz_id: quizId,
    },
  });
};

export const QuizAttemptService = {
  submitAttempt,
  getAttemptById,
  getUserQuizAttempts,
  getQuizAttempts,
  getBestAttempt,
  getAttemptsCount,
};
