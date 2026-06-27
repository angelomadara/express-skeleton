import express from "express";
import cors from "cors";
import config from "./config";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/errorHandler";

const app = express();

// ── Middleware ──────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────
app.use(config.apiPrefix, routes);

// ── Error Handling ──────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
