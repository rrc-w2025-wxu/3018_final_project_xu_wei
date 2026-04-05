import swaggerJsdoc from "swagger-jsdoc";

/**
 * Swagger configuration options for generating OpenAPI documentation.
 *
 * This configuration defines the API metadata, server information,
 * authentication method, and the file paths where Swagger annotations
 * are located.
 */
const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Final Project - Xu Wei - 0420438",
            version: "1.0.0",
            description:
                "This is the API documentation for the Task Management application.",
        },
        servers: [
            {
                url: "http://localhost:3000/api/v1",
                description: "Local server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/api/v1/routes/*.ts", "./src/api/v1/validations/*.ts"], // Path to the API docs and schemas
};

// Generate the Swagger spec
export const generateSwaggerSpec = (): object => {
    return swaggerJsdoc(swaggerOptions);
};