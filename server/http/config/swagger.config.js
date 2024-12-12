const dotenv = require("dotenv");
dotenv.config({ path: process.cwd() + "/.env" });
const swaggerJSDoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "chatwoot App ",
      version: "1.0.0",
      description: "all routes for testing manually and documentation",
    },
    servers: [
      {
        url: `http://localhost:${process.env.EXPOSED_PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [process.cwd() + "/server/http/Router/swagger/*.swagger.js"], // Path to the API docs
};


const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
