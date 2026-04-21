export interface ICertificateResponse {
  id: string;
  user_id: string;
  course_id: string;
  score: number;
  issued_at: Date;
  user?: {
    name: string;
    email: string;
  };
  course?: {
    id: string;
    title: string;
    description?: string;
  };
}
