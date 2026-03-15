# 🚀 Bookstore API - Enterprise Architecture Guide

## Overview

This is a production-ready MERN (MongoDB, Express, React, Node.js) bookstore application refactored to follow **clean architecture principles**, with **enterprise-level security**, **scalability**, and **performance optimization**.

## Architecture Layers

### 1. **Presentation Layer (Controllers)**

- `src/adapters/controllers/` - HTTP request/response handling
- Receives requests, delegates to use cases, returns responses
- No business logic here

### 2. **Application Layer (Use Cases)**

- `src/usecases/` - Orchestrate business logic
- Validate inputs, call repositories, handle domain rules
- Maps between controllers and repositories

### 3. **Domain Layer**

- `src/domain/entities/` - Data models (Mongoose schemas)
- `src/domain/repositories/` - Data access abstractions
- Pure business logic, framework-independent

### 4. **Infrastructure Layer**

- `src/config/` - Database, cache, environment setup
- `src/infra/` - External service integrations
- `src/middlewares/` - Cross-cutting concerns
- `src/utils/` - Helper functions and error handling

## Key Features Implemented

✅ **Security**

- JWT with refresh tokens
- Role-Based Access Control (RBAC)
- Helmet.js security headers
- Input validation & sanitization
- Rate limiting
- CORS protection

✅ **Performance**

- Redis caching layer
- Database indexes
- Pagination & lazy loading
- Response compression (gzip)
- Connection pooling

✅ **Features**

- Book search, filtering, sorting
- Reviews & ratings system
- Wishlist & shopping cart
- Stripe payment integration
- Email notifications
- Admin analytics dashboard

✅ **Observability**

- Winston structured logging
- Morgan HTTP access logging
- Request ID tracing
- Health check endpoints
- Swagger/OpenAPI documentation

✅ **Quality**

- Clean code architecture
- Error handling
- Input validation
- Jest testing setup
- Database optimization

✅ **Deployment**

- Docker containerization
- Docker Compose orchestration
- Nginx reverse proxy
- GitHub Actions CI/CD ready
- Environment-based configuration

## Project Structure

```
Backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── environment.js   # Env variables
│   │   ├── database.js      # MongoDB setup
│   │   ├── cache.js         # Redis setup
│   │   ├── swagger.js       # OpenAPI docs
│   │   └── logger.js        # Winston logger
│   │
│   ├── domain/              # Business domain
│   │   ├── entities/        # Mongoose models
│   │   └── repositories/    # Data access interfaces
│   │
│   ├── usecases/            # Application logic
│   │   ├── book/
│   │   ├── auth/
│   │   ├── order/
│   │   └── review/
│   │
│   ├── adapters/            # Framework integration
│   │   ├── controllers/     # HTTP handlers
│   │   ├── repositories/    # Concrete implementations
│   │   └── services/        # External services
│   │
│   ├── middlewares/         # Cross-cutting concerns
│   │   ├── auth.js          # JWT & RBAC
│   │   ├── security.js      # Helmet, CORS, rate limiting
│   │   ├── validation.js    # Input validation
│   │   └── logging.js       # Request logging
│   │
│   ├── utils/               # Helper functions
│   │   ├── logger.js
│   │   ├── tokenService.js
│   │   ├── validation.js
│   │   └── errors.js
│   │
│   ├── routes/              # API endpoints
│   │   ├── bookRoutes.js
│   │   ├── authRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── cartWishlistRoutes.js
│   │   └── ...
│   │
│   └── app.js               # Express app setup
│
├── tests/                   # Test files
│   ├── unit/
│   └── integration/
│
├── infra/                   # DevOps
│   ├── docker/Dockerfile
│   └── nginx/nginx.conf
│
├── index.js                 # Entry point
├── package.json
└── .env.example
```

## API Endpoints Summary

### Books

- `GET /api/books` - Get all books with pagination
- `GET /api/books/search?q=...` - Search books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (admin)
- `PATCH /api/books/:id` - Update book (admin)
- `DELETE /api/books/:id` - Delete book (admin)

### Reviews

- `GET /api/reviews/book/:bookId` - Get reviews
- `POST /api/reviews/book/:bookId` - Add review
- `DELETE /api/reviews/:reviewId` - Delete review

### Cart & Wishlist

- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PATCH /api/cart/:bookId` - Update cart item
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist

### Documentation

- `GET /api-docs` - Swagger UI
- `GET /api-docs.json` - OpenAPI JSON

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- Redis
- Docker & Docker Compose (for containerized setup)

### Local Setup

1. **Install dependencies**

   ```bash
   cd Backend
   npm install
   ```

2. **Create `.env` file**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB & Redis**

   ```bash
   docker run -d -p 27017:27017 mongo
   docker run -d -p 6379:6379 redis
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **API available at** `http://localhost:5000`
6. **API Docs at** `http://localhost:5000/api-docs`

### Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

## Environment Variables

See `.env.example` for all options:

- `MONGODB_URI` - MongoDB connection string
- `REDIS_HOST`, `REDIS_PORT` - Redis configuration
- `JWT_SECRET`, `JWT_REFRESH_SECRET` - JWT secrets
- `STRIPE_SECRET_KEY` - Stripe API key
- `SMTP_*` - Email configuration

## Security Best Practices

✅ **Implemented:**

- Helmet.js for security headers
- CORS whitelist (frontend origin only)
- Rate limiting per IP and endpoint
- JWT token-based authentication
- Password hashing with bcrypt
- Input validation & sanitization
- SQL injections prevented by Mongoose
- HTTPS ready (Nginx SSL config included)

⚠️ **Additional Recommendations:**

- Enable HTTPS in production
- Use strong JWT secrets
- Implement secret rotation
- Use AWS Secrets Manager or similar
- Monitor for suspicious activity
- Regular security audits

## Performance Optimization

✅ **Implemented:**

- Redis caching for hot data
- Database indexes on frequently queried fields
- Pagination for large datasets
- Connection pooling
- Gzip compression (Nginx)
- Response caching headers
- Lazy loading & cursor-based pagination

## Logging & Monitoring

- **Winston** - Structured JSON logging
- **Morgan** - HTTP request logging
- **Request ID** - Distributed tracing
- **Health checks** - `/health` and `/ready` endpoints
- **Error tracking** - Centralized error handling

## Testing

```bash
# Run unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Deployment

### Docker Production Build

```bash
docker build -f infra/docker/Dockerfile -t bookstore-api:latest .
docker run -d -p 5000:5000 --env-file .env bookstore-api:latest
```

### Docker Compose (Full Stack)

```bash
docker-compose -f docker-compose.yml up -d
```

### Kubernetes Ready

- Helm charts can be created from provided config
- Health checks configured
- Resource limits can be set
- Scaling ready (stateless API)

## CI/CD Pipeline

GitHub Actions workflow template available at `.github/workflows/`

**Automated checks:**

- Lint & format
- Unit & integration tests
- Security scanning
- Docker build
- Deploy to staging/production

## Monitoring & Analytics

Hooks for:

- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Log aggregation (ELK Stack, Datadog)
- Metrics collection (Prometheus)
- Alert configuration

## Scaling Considerations

**To scale tothousands of users:**

1. **Horizontal scaling** - Run multiple API instances with load balancer
2. **Database** - MongoDB replication, indexes, query optimization
3. **Cache** - Redis cluster for distributed caching
4. **CDN** - CloudFront for static assets & PDFs
5. **Message Queue** - RabbitMQ for async operations
6. **Microservices** - Split into independent services per domain

## Next Steps

1. ✅ Implement frontend integration
2. Setup CI/CD pipeline (GitHub Actions)
3. Configure Stripe webhooks
4. Setup email notification service
5. Create admin dashboard analytics
6. Deploy to staging environment
7. Production deployment with monitoring

## Support & Documentation

- OpenAPI Docs: http://localhost:5000/api-docs
- Health Check: http://localhost:5000/health
- Ready Check: http://localhost:5000/ready

## License

MIT License - See LICENSE file for details
