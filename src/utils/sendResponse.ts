import { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const { statusCode, success, message, data: dataResponse } = data;

  res.status(statusCode).json({
    success,
    message,
    data: dataResponse,
  });
};

export default sendResponse;
