import { prisma } from "../../lib/prisma";
import { IApproveUserPayload, IUserResponse } from "./user.interface";
import { USER_MESSAGES } from "./user.constant";

// Get all pending users (for admin approval)
const getPendingUsers = async (): Promise<IUserResponse[]> => {
  const users = await prisma.user.findMany({
    where: {
      status: "PENDING",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      address: true,
      createdAt: true,
    },
  });

  return users;
};

// Get all users (for admin dashboard)
const getAllUsers = async (
  page: number = 1,
  limit: number = 10,
  role?: string,
  status?: string
): Promise<any> => {
  const skip = (page - 1) * limit;

  const where: any = {};
  if (role) where.role = role;
  if (status) where.status = status;

  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      address: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.user.count({ where });

  return {
    users,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

// Approve or reject user
const updateUserStatus = async (payload: IApproveUserPayload): Promise<IUserResponse> => {
  const { userId, status, rejection_reason } = payload;

  // Validate status
  if (!["ACTIVE", "REJECTED", "SUSPENDED"].includes(status)) {
    throw new Error(USER_MESSAGES.INVALID_STATUS);
  }

  // If rejecting, rejection_reason is required
  if (status === "REJECTED" && !rejection_reason) {
    throw new Error("Rejection reason is required when rejecting a user");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      status,
      rejection_reason: status === "REJECTED" ? rejection_reason : null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      address: true,
      createdAt: true,
    },
  });

  return user;
};

// Get user by ID
const getUserById = async (userId: string): Promise<IUserResponse> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      address: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error(USER_MESSAGES.USER_NOT_FOUND);
  }

  return user;
};

// Update user profile
const updateUserProfile = async (
  userId: string,
  updateData: Partial<{
    name: string;
    phone: string;
    address: string;
    image: string;
  }>
): Promise<IUserResponse> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      address: true,
      createdAt: true,
    },
  });

  return user;
};

export const UserService = {
  getPendingUsers,
  getAllUsers,
  updateUserStatus,
  getUserById,
  updateUserProfile,
};
