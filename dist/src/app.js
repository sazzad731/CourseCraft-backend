import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
// import router from "./routes";
// import { notFound } from "./middlewares/notFound";
// import { errorHandler } from "./middlewares/globalErrorHandler";
const app = express();
// parsers
app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:3000",
    ],
    credentials: true,
}));
app.use(cookieParser());
// application routes
// app.use("/api/v1", router);
app.get("/", (req, res) => {
    res.send("Hello from Learning");
});
// app.use(errorHandler);
// app.use(notFound);
export default app;
