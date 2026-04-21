export interface ISubmitAttemptPayload {
  quizId: string;
  answers: {
    questionId: string;
    selectedOptionId: string;
  }[];
}

export interface IQuizAttemptResponse {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  is_passed: boolean;
  attempted_at: Date;
}

export interface IAttemptResult extends IQuizAttemptResponse {
  totalQuestions: number;
  correctAnswers: number;
  passPercentage: number;
}
