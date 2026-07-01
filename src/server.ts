import app from "./app";
import config from "./config";
import { connectDB } from "./config/database";
import logger from "./utils/logger";

async function start(): Promise<void> {
  // Connect to MongoDB first
  await connectDB();

  // Then start Express server
  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port} [${config.nodeEnv}]`);
    logger.info(`API base: ${config.apiPrefix}`);
  });
}

start().catch((err) => {
  logger.error("Failed to start server", err);
  process.exit(1);
});
