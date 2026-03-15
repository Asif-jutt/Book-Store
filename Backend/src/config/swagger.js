const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const config = require("./environment");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bookstore API",
      description:
        "Enterprise-level Bookstore REST API with comprehensive book management, user authentication, shopping cart, reviews, and payment integration.",
      version: "2.0.0",
      contact: {
        name: "Bookstore API Support",
        url: config.FRONTEND_URL,
      },
      license: {
        name: "MIT",
      },
    },
    servers: [
      {
        url: config.API_URL,
        description: "Production Server",
      },
      {
        url: "http://localhost:5000",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT access token",
        },
      },
      schemas: {
        Book: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            author: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            category: { type: "string", enum: ["free", "paid", "premium"] },
            genre: { type: "string" },
            image: { type: "string" },
            ratingAvg: { type: "number" },
            ratingCount: { type: "number" },
            totalStudents: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Review: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            bookId: { type: "string" },
            rating: { type: "number", minimum: 1, maximum: 5 },
            comment: { type: "string" },
            helpful: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            bookId: { type: "string" },
            quantity: { type: "number" },
            priceSnapshot: { type: "number" },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            books: { type: "array" },
            totalAmount: { type: "number" },
            paymentStatus: {
              type: "string",
              enum: ["pending", "paid", "failed"],
            },
            paymentMethod: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            code: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Books",
        description: "Book management and browsing",
      },
      {
        name: "Reviews",
        description: "Book reviews and ratings",
      },
      {
        name: "Cart",
        description: "Shopping cart management",
      },
      {
        name: "Wishlist",
        description: "Wishlist management",
      },
      {
        name: "Orders",
        description: "Order and purchase management",
      },
      {
        name: "Auth",
        description: "Authentication and authorization",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

/**
 * Setup Swagger UI
 */
const setupSwagger = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    }),
  );

  // Also serve the raw JSON
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });
};

module.exports = {
  setupSwagger,
  specs,
};
