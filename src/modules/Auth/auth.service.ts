import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import config from "../../config/index.js";
import { IRegisterPayload, ILoginPayload, IAuthResponse } from "./auth.interface.js";
import { AUTH_MESSAGES, TOKEN_EXPIRY } from "./auth.constant.js";

const register = async (payload: IRegisterPayload): Promise<any> => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new Error(AUTH_MESSAGES.USER_ALREADY_EXISTS);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // Create user with PENDING status by default
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role || "STUDENT",
      status: "PENDING", // Default status
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return user;
};

const login = async (email: string, password: string): Promise<IAuthResponse> => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  // Check if user is active
  if (user.status !== "ACTIVE") {
    throw new Error("User account is not active. Please wait for admin approval.");
  }

  // Create JWT token
  const tokenData = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
  };

  const token = jwt.sign(tokenData, config.secret as string, {
    expiresIn: TOKEN_EXPIRY.ACCESS as SignOptions["expiresIn"],
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

const getCurrentUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      address: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const AuthService = {
  register,
  login,
  getCurrentUser,
};
