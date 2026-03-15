/**
 * Bookstore API Server - Main Entry Point
 * Enhanced with Clean Architecture, Security, and Production-Ready Patterns
 */

require("express-async-errors");
require("dotenv").config();

const app = require("./src/app");
const logger = require("./src/utils/logger");
const config = require("./src/config/environment");

const PORT = config.PORT;

// Start server only when not imported
if (require.main === module) {
  const server = app.listen(PORT, () => {
    logger.info(`
╔════════════════════════════════════════════╗
║     🚀 BOOKSTORE API SERVER STARTED        ║
╠════════════════════════════════════════════╣
║  Port: ${PORT}                               ║
║  Mode: ${config.NODE_ENV}                      ║
║  URL:  ${config.API_URL}      ║
║  Version: 2.0 (Enterprise Architecture)   ║
╚════════════════════════════════════════════╝
    `);
  });

  // Handle graceful shutdown
  process.on("SIGTERM", () => {
    logger.info("SIGTERM received, starting graceful shutdown");
    server.close(() => {
      logger.info("Server closed");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    logger.info("SIGINT received, starting graceful shutdown");
    server.close(() => {
      logger.info("Server closed");
      process.exit(0);
    });
  });
}

// Always export for Serverless (Vercel) and testing
module.exports = app;
