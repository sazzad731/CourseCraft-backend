import express from "express";
import { CertificateController } from "./certificate.controller.js";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = express.Router();

// Student routes
router.get(
  "/my-certificates",
  auth(Role.STUDENT),
  CertificateController.getStudentCertificates
);

router.get(
  "/:certificateId",
  auth(Role.STUDENT, Role.INSTRUCTOR),
  CertificateController.getCertificateById
);

router.get(
  "/course/:courseId/check",
  auth(Role.STUDENT),
  CertificateController.hasCertificate
);

// Instructor routes
router.get(
  "/course/:courseId/certificates",
  auth(Role.INSTRUCTOR),
  CertificateController.getCourseCertificates
);

router.get(
  "/course/:courseId/statistics",
  auth(Role.INSTRUCTOR),
  CertificateController.getCourseStatistics
);

export const CertificateRoutes = router;
