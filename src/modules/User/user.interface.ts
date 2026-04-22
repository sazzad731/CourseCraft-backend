export interface IApproveUserPayload {
  userId: string;
  status: "ACTIVE" | "REJECTED";
  rejection_reason?: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string | null;
  address?: string | null;
  createdAt: Date;
}
