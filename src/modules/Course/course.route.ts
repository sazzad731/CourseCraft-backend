import express from "express";
import { CourseController } from "./course.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";


const router = express.Router();

// Public routes
router.get("/published", CourseController.getPublishedCourses);
router.get("/:courseId", CourseController.getCourseById);

// Instructor routes
router.post(
  "/",
  auth(Role.INSTRUCTOR),
  CourseController.createCourse
);

router.patch(
  "/:courseId",
  auth(Role.INSTRUCTOR),
  CourseController.updateCourse
);

router.patch(
  "/:courseId/submit",
  auth(Role.INSTRUCTOR),
  CourseController.submitForReview
);

router.delete(
  "/:courseId",
  auth(Role.INSTRUCTOR),
  CourseController.deleteCourse
);

router.get(
  "/instructor/my-courses",
  auth(Role.INSTRUCTOR),
  CourseController.getInstructorCourses
);

// Admin routes
router.get("/pending", auth(Role.ADMIN), CourseController.getPendingCourses);

router.patch(
  "/:courseId/status",
  auth(Role.ADMIN),
  CourseController.updateCourseStatus
);

export const CourseRoutes = router;
