export interface ICreateQuizPayload {
  title: string;
  time_limit?: number; // in minutes
  pass_percentage?: number;
  max_attempts?: number;
}

export interface IUpdateQuizPayload extends Partial<ICreateQuizPayload> {}

export interface IQuizResponse {
  id: string;
  title: string;
  time_limit?: number;
  pass_percentage: number;
  max_attempts?: number;
  course_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface IQuizWithQuestions extends IQuizResponse {
  questions: IQuestion[];
}

export interface IQuestion {
  id: string;
  question_text: string;
  quiz_id: string;
  options: IOption[];
}

export interface IOption {
  id: string;
  text: string;
  is_correct: boolean;
  question_id: string;
}
