const express = require("express");
const connectDB = require("./database/config/mongoose.config");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./http/config/swagger.config");
const mainRouter = require("./http/Router/router");
const errorHandler = require("./http/middlewares/errorHandler");
const path = require("path");
const cors = require("cors")

const createServer = (mongoUrl, databaseName) => {
  const app = express();

  app.use(cors())
  // Connect to the database
  connectDB(mongoUrl, databaseName);

  // Middleware (if any)
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(express.static(path.join(__dirname, 'public')));
  // Use the Router
  app.use(mainRouter);

  // Use swagger
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(errorHandler);

  return app;
};

const startServer = (port, mongoUrl, databaseName) => {
  const app = createServer(mongoUrl, databaseName);

  const PORT = port || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

module.exports = { createServer, startServer };
