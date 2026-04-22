import express from "express";
import { UserController } from "./user.controller.js";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = express.Router();

// Admin routes
router.get(
  "/pending",
  auth(Role.ADMIN),
  UserController.getPendingUsers
);

router.get(
  "/",
  auth(Role.ADMIN),
  UserController.getAllUsers
);

router.patch(
  "/:userId/status",
  auth(Role.ADMIN),
  UserController.updateUserStatus
);

router.get(
  "/:userId",
  auth(Role.ADMIN),
  UserController.getUserById
);

// User profile
router.patch(
  "/profile/update",
  auth(Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN),
  UserController.updateProfile
);

export const UserRoutes = router;
