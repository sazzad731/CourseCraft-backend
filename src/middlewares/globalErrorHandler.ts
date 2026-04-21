import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  let statusCode = 500;
  let message = "Internal server error!";
  let errorDetails = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid input. Please check your data types and required fields.";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 404;
      message = "Record not found.";
    } else if (err.code === "P2002") {
      statusCode = 409;
      message = "Duplicate entry. This record already exists.";
    } else if (err.code === "P2003") {
      statusCode = 400;
      message = "Foreign key constraint failed.";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    message = "Error occurred during database query.";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500;
    message = "Database connection error.";
  } else if (
    err.message === "Unauthorized access!" ||
    err.message === "Unauthorized access!!" ||
    err.message === "Unauthorized access!!!" ||
    err.message === "Token not found"
  ) {
    statusCode = 401;
    message = "You are not authorized.";
    errorDetails = err.message;
  } else if (err.message?.includes("Forbidden")) {
    statusCode = 403;
    message = "Access forbidden.";
    errorDetails = err.message;
  } else {
    errorDetails = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
  });
}
