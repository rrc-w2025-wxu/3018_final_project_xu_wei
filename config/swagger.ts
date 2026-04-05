
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { generateSwaggerSpec } from "./swaggerOptions";

/**
 * Sets up Swagger UI documentation for the Express application.
 *
 * This function generates the OpenAPI (Swagger) specification using
 * a custom configuration and serves an interactive API documentation
 * interface at the `/api-docs` endpoint.
 *
 * @param app - The Express application instance
 *
 * Behavior:
 * - Calls `generateSwaggerSpec()` to build the API documentation schema
 * - Uses `swagger-ui-express` to serve the Swagger UI
 * - Mounts the documentation at `/api-docs`
 *
 * Result:
 * - Developers can visit http://localhost:PORT/api-docs
 *   to view and test API endpoints interactively
 */
const setupSwagger = (app: Express): void => {
    const specs = generateSwaggerSpec();
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
export default setupSwagger;