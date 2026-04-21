export interface ILessonProgressResponse {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  updated_at: Date;
}

export interface ICourseProgressResponse {
  total_lessons: number;
  completed_lessons: number;
  completion_percentage: number;
  lessons: ILessonProgressResponse[];
}
