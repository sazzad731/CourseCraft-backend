export interface IEnrollmentResponse {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  course?: {
    id: string;
    title: string;
    description?: string | null;
  };
}
