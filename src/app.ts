import express from "express";
import setupSwagger from "../config/swagger";

import {
    accessLogger,
    errorLogger,
    consoleLogger,
} from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
import router from "../src/api/v1/routes/Routes";
import morgan from "morgan";

/**
 * Initialize Express application
 */
const app = express();

// Initialize Swagger API documentation
setupSwagger(app);

app.use(morgan("combined"));
/**
 * Development logger
 * 
 * Logs HTTP requests to the console for easier debugging during development.
 */
app.use(consoleLogger);

/**
 * Access logger
 * 
 * Logs all HTTP requests to a file or stream for auditing and monitoring purposes.
 */
app.use(accessLogger);

/**
 * Error logger
 * 
 * Logs HTTP requests with status codes 4xx or 5xx to a file for tracking errors.
 */
app.use(errorLogger);

/**
 * Body parsing middleware
 * 
 * Allows the server to parse JSON request bodies automatically.
 */
app.use(express.json());

/**
 * API routes
 * 
 * All endpoints defined in the router are prefixed with `/api/v1`.
 */
app.use("/api/v1", router);

/**
 * Global error handling middleware
 * 
 * Catches errors thrown from any route or middleware and handles them consistently.
 * MUST be applied last in the middleware chain.
 */
app.use(errorHandler);

export default app;