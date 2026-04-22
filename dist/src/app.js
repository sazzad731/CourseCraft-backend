import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/globalErrorHandler.js";
const app = express();
// parsers
app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    credentials: true,
}));
app.use(cookieParser());
// application routes
app.use("/api/v1", router);
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Online Course & Quiz Platform API",
        version: "1.0.0",
    });
});
// Error handlers (must be last)
app.use(errorHandler);
app.use(notFound);
export default app;
