import { Difficulty, PriceType } from "../../../generated/prisma/enums.js";

export interface ICreateCoursePayload {
  title: string;
  description?: string;
  category: string;
  difficulty?: Difficulty;
  price_type?: PriceType;
  thumbnail?: string;
}

export interface IUpdateCoursePayload extends Partial<ICreateCoursePayload> {}

export interface IApproveCoursePayload {
  courseId: string;
  status: "PUBLISHED" | "REJECTED";
  rejection_reason?: string;
}

export interface ICourseResponse {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: string;
  price_type: string;
  status: string;
  thumbnail?: string;
  instructor_id: string;
  created_at: Date;
}
