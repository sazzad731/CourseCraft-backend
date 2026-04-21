import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";
import { Role } from "../../generated/prisma/client";

export interface TUser extends JwtPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TUser;
    }
  }
}

const auth = (...allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.token;

      if (!token) {
        throw new Error("Token not found");
      }

      const decoded = jwt.verify(token, config.secret as Secret) as TUser;

      const userData = await prisma.user.findUnique({
        where: {
          email: decoded.email,
        },
      });

      if (!userData) {
        throw new Error("Unauthorized access!");
      }

      if (userData.status !== "ACTIVE") {
        throw new Error("User account is not active!");
      }

      if (!allowedRoles.includes(decoded.role)) {
        throw new Error("Forbidden");
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
