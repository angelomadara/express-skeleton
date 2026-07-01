import { Router } from "express";
import { authController } from "../composition-root";
import { authenticate } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

// ── Public Routes (rate-limited) ────────────────────
router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);

// ── Protected Routes ────────────────────────────────
router.get("/me", authenticate, authController.me);

export default router;
