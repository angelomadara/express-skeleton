import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import config from "./config";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { generalLimiter } from "./middleware/rateLimiter";
import { requestId } from "./middleware/requestId";

const app = express();

// ── Security Middleware (order matters) ─────────────

// 1. Request ID — earliest for full traceability
app.use(requestId);

// 2. Security headers
app.use(helmet());

// 3. CORS — locked to configured origins
app.use(
  cors({
    origin: config.corsAllowedOrigins,
    credentials: true,
  }),
);

// 4. Body parsing with size limit (prevents memory exhaustion)
app.use(express.json({ limit: config.bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: config.bodyLimit }));

// 5. NoSQL injection prevention — strips $ and . from body/params/query
app.use(mongoSanitize());

// 6. HTTP parameter pollution protection
// Add param names to whitelist[] when you need to accept duplicate values
app.use(hpp({ whitelist: [] }));

// 7. Global rate limiting
app.use(generalLimiter);

// ── Routes ──────────────────────────────────────────
app.use(config.apiPrefix, routes);

// ── Error Handling ──────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
