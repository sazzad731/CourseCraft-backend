import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse.js";
import { UserService } from "./user.service.js";
import { USER_MESSAGES } from "./user.constant.js";

const getPendingUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.getPendingUsers();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Pending users fetched successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, role, status } = req.query;

    const result = await UserService.getAllUsers(
      Number(page),
      Number(limit),
      role as string,
      status as string
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: USER_MESSAGES.USERS_FETCHED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { status, rejection_reason } = req.body;

    const result = await UserService.updateUserStatus({
      userId: userId as string,
      status,
      rejection_reason,
    });

    const message = status === "ACTIVE" ? USER_MESSAGES.USER_APPROVED : USER_MESSAGES.USER_REJECTED;

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const user = await UserService.getUserById(userId as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("User ID not found");
    }

    const result = await UserService.updateUserProfile(userId, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: USER_MESSAGES.USER_UPDATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  getPendingUsers,
  getAllUsers,
  updateUserStatus,
  getUserById,
  updateProfile,
};
