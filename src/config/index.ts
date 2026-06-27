import dotenv from "dotenv";
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  apiPrefix: process.env.API_PREFIX || "/api/v1",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/skeleton",
  pageLimit: parseInt(process.env.PAGE_LIMIT || "10", 10),
};

export default config;
