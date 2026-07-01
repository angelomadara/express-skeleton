import mongoose from "mongoose";
import config from ".";
import logger from "../utils/logger";

/**
 * MongoDB Database Configuration
 * Handles MongoDB connection using Mongoose
 */

interface MongoDBConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

/**
 * Build MongoDB connection URI from environment variables
 * Priority: MONGO_URI (full URI) > individual DB_* vars > defaults
 */
const buildMongoURI = (): string => {
  // If a full MONGO_URI is provided, use it directly
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }

  const host = process.env.DB_HOST || "mongodb://127.0.0.1";
  const port = process.env.DB_PORT || "27017";
  const dbName = process.env.DB_NAME || "skeleton";
  const user = process.env.DB_USER || "";
  const password = process.env.DB_PASSWORD || "";

  // If user and password are provided, include them in the URI
  if (user && password) {
    const hostWithoutProtocol = host.replace("mongodb://", "");
    return `mongodb://${user}:${password}@${hostWithoutProtocol}:${port}/${dbName}`;
  }

  // Otherwise, use simple connection string
  const hostWithoutProtocol = host.replace("mongodb://", "");
  return `mongodb://${hostWithoutProtocol}:${port}/${dbName}`;
};

/**
 * MongoDB connection configuration
 */
const mongoConfig: MongoDBConfig = {
  get uri() {
    return buildMongoURI();
  },
  options: {
    retryWrites: true,
    w: "majority",
    maxPoolSize: 10,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  },
};

/**
 * Connect to MongoDB with retry logic
 * Retries up to MAX_RETRIES times with exponential backoff
 */
const MAX_RETRIES = 5;
const RETRY_BASE_DELAY_MS = 2000;

export const connectDB = async (): Promise<void> => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(mongoConfig.uri, mongoConfig.options);

      logger.info(`MongoDB Connected: ${conn.connection.host}`);
      logger.info(`Database: ${conn.connection.name}`);

      // Handle connection events
      mongoose.connection.on("error", (err) => {
        logger.error("MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        logger.warn("MongoDB disconnected");
      });

      mongoose.connection.on("reconnected", () => {
        logger.info("MongoDB reconnected");
      });

      return;
    } catch (error) {
      logger.error(
        `MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: ${
          error instanceof Error ? error.message : error
        }`,
      );

      if (attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
        logger.info(`Retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  logger.error("All MongoDB connection attempts failed.");
  process.exit(1);
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected successfully");
  } catch (error) {
    logger.error("Error disconnecting from MongoDB:", error);
  }
};

/**
 * Handle graceful shutdown
 */
process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});

export default mongoConfig;
