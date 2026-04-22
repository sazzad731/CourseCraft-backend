export interface ICreateLessonPayload {
  title: string;
  content?: string | null;
  video_url?: string | null;
  is_preview?: boolean;
  position: number;
}

export interface IUpdateLessonPayload extends Partial<ICreateLessonPayload> {}

export interface ILessonResponse {
  id: string;
  title: string;
  content?: string | null;
  video_url?: string | null;
  is_preview: boolean;
  position: number;
  course_id: string;
  created_at: Date;
  updated_at: Date;
}
