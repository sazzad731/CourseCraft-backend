import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./routes";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/globalErrorHandler";

const app: Application = express();

// parsers
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  }),
);
app.use(cookieParser());

// application routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to Online Course & Quiz Platform API",
    version: "1.0.0",
  });
});

// Error handlers (must be last)
app.use(errorHandler);
app.use(notFound);

export default app;
