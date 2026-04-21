import express from "express";
import { EnrollmentController } from "./enrollment.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";


const router = express.Router();

// Student routes
router.post(
  "/course/:courseId",
  auth(Role.STUDENT),
  EnrollmentController.enrollStudent
);

router.get(
  "/my-enrollments",
  auth(Role.STUDENT),
  EnrollmentController.getStudentEnrollments
);

router.delete(
  "/course/:courseId",
  auth(Role.STUDENT),
  EnrollmentController.removeEnrollment
);

// Instructor routes
router.get(
  "/course/:courseId/students",
  auth(Role.INSTRUCTOR),
  EnrollmentController.getCourseEnrollments
);

export const EnrollmentRoutes = router;
