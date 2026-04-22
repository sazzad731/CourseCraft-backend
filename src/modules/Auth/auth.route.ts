import express from "express";
import { AuthController } from "./auth.controller.js";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = express.Router();

// Public routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Protected routes
router.get("/me", auth(Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN), AuthController.getCurrentUser);

export const AuthRoutes = router;
