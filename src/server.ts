import app from "./app";
import config from "./config";
import logger from "./utils/logger";

async function start(): Promise<void> {
  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port} [${config.nodeEnv}]`);
    logger.info(`API base: ${config.apiPrefix}`);
  });
}

start().catch((err) => {
  logger.error("Failed to start server", err);
  process.exit(1);
});
