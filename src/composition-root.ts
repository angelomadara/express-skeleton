/**
 * Composition Root
 *
 * The single place in the application where all dependencies are
 * wired together (repository → service → controller).
 *
 * This is the "one true place" that changes when you swap an
 * implementation — confirming OCP across the whole dependency graph.
 */
import { MongoUserRepository } from "./repositories";
import { UserService } from "./services/user.service";
import { AuthService } from "./services/auth.service";
import { UserController } from "./controllers/examples/user.controller";
import { AuthController } from "./controllers/auth.controller";

// ── Repositories ────────────────────────────────────
// Swap this line to use a different data source:
//   const userRepo = new PostgresUserRepository(db);
//   const userRepo = new MockUserRepository();
const userRepo = new MongoUserRepository();

// ── Services ─────────────────────────────────────────
// Swap a repository without touching the service layer.
const userService = new UserService(userRepo);
const authService = new AuthService(userRepo);

// ── Controllers ──────────────────────────────────────
// Swap a service without touching the controller layer.
const userController = new UserController(userService);
const authController = new AuthController(authService);

export { userController, authController };
