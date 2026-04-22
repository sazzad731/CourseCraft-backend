import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse.js";
import { AuthService } from "./auth.service.js";
import { AUTH_MESSAGES } from "./auth.constant.js";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Prevent ADMIN role registration
    if (req.body.role === "ADMIN") {
      throw new Error("You cannot register as an ADMIN");
    }

    const result = await AuthService.register(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: AUTH_MESSAGES.REGISTER_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    // Set token in httpOnly cookie
    res.cookie("token", result.token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.user?.email;

    if (!email) {
      throw new Error("User email not found in token");
    }

    const result = await AuthService.getCurrentUser(email);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  register,
  login,
  getCurrentUser,
};
