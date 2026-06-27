import { Router } from "express";
import userController from "../controllers/examples/user.controller";
import healthController from "../controllers/examples/health.controller";

const router = Router();

// ── Health ──────────────────────────────────────────
router.get("/health", healthController.check);

// ── Users (full CRUD via InterfaceController) ────────
router.get("/users", userController.index);
router.post("/users", userController.store);
router.get("/users/:id", userController.show);
router.get("/users/:id/edit", userController.edit);
router.put("/users/:id", userController.update);
router.delete("/users/:id", userController.destroy);

export default router;
