import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

// Public routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Protected routes
router.get("/me", auth(Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN), AuthController.getCurrentUser);

export const AuthRoutes = router;
