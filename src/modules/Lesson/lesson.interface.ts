export interface ICreateLessonPayload {
  title: string;
  content?: string;
  video_url?: string;
  is_preview?: boolean;
  position: number;
}

export interface IUpdateLessonPayload extends Partial<ICreateLessonPayload> {}

export interface ILessonResponse {
  id: string;
  title: string;
  content?: string;
  video_url?: string;
  is_preview: boolean;
  position: number;
  course_id: string;
  created_at: Date;
  updated_at: Date;
}
