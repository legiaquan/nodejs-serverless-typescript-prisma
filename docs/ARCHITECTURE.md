# 🏗️ Architecture Documentation

This document outlines the architecture of the Node.js Serverless API, explaining the design patterns, component relationships, and data flow.

## 🔍 System Overview

This application follows a layered architecture with clear separation of concerns:

```
┌─────────────────┐
│    API Layer    │ ← Routes, Controllers, Middleware
├─────────────────┤
│  Business Layer │ ← Services, DTOs
├─────────────────┤
│    Data Layer   │ ← Repositories, Models, Prisma
└─────────────────┘
```

## 🧩 Core Components

### 🌐 API Layer

#### 🛣️ Routes (`src/routes`)

- Define API endpoints and HTTP methods
- Map requests to appropriate controllers
- Group related endpoints

#### 🎮 Controllers (`src/controllers`)

- Handle HTTP requests and responses
- Input validation and sanitization
- Delegate business logic to services
- Format responses

#### 🔌 Middleware (`src/middleware`)

- Authentication and authorization
- Request validation
- Error handling
- Request logging
- Rate limiting

### 💼 Business Layer

#### ⚙️ Services (`src/services`)

- Implement business logic
- Orchestrate data access through repositories
- Handle business rules and validation
- Manage transactions

#### 📝 DTOs (`src/dtos`)

- Define data transfer objects
- Provide type safety
- Document request/response structures

### 💾 Data Layer

#### 📚 Repositories (`src/repos`)

- Abstract database access
- Implement data access patterns
- Handle database queries

#### 📊 Models (`src/models` and `src/prisma`)

- Define data structures
- Specify database schema
- Define relationships

## 🔄 Data Flow

### 📥 Request Flow

1. **Client Request** → HTTP request to an API endpoint
2. **Routes** → Match request to appropriate controller method
3. **Middleware** → Process request (auth, validation, etc.)
4. **Controller** → Handle request and delegate to service
5. **Service** → Execute business logic
6. **Repository** → Access data store
7. **Prisma** → Execute database operations
8. **Response** → Return data to client

### ⚠️ Error Handling Flow

1. **Error occurs** → In any layer
2. **Custom error** → Thrown with type and details
3. **Error middleware** → Catches and formats error
4. **Response** → Returns appropriate error status and message

## 📐 Design Patterns

### 📚 Repository Pattern

- Abstracts data access logic
- Makes services independent of data storage mechanisms
- Enables easier testing through mocking

```typescript
// Example of Repository Pattern
export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }
}
```

### 💉 Dependency Injection

- Components receive their dependencies from outside
- Enhances testability and modularity
- Implemented through constructor injection

```typescript
// Example of Dependency Injection
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}
```

### 📋 DTO Pattern

- Defines shapes of data for API requests and responses
- Ensures type safety
- Decouples API contracts from internal models

```typescript
// Example of DTO Pattern
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  name: string;
}
```

## ☁️ Serverless Architecture

This application is designed to work both as a serverless application and as a traditional Express.js application:

### 🚀 Serverless Mode

- Functions deployed as AWS Lambda functions
- API Gateway for HTTP routing
- Stateless execution model
- Pay-per-use pricing model

### 🖥️ Traditional Mode

- Runs as an Express.js server
- Suitable for local development
- Can be deployed as a container or on a VM

The entry points are:

- `src/handler.ts` - For serverless deployment
- `src/local.ts` - For traditional Express.js server

## 🗄️ Database Access

### 🔗 Prisma ORM

- Type-safe database client
- Schema-based database modeling
- Migration management
- Database agnostic (PostgreSQL, MySQL, SQLite, etc.)

```typescript
// Example of Prisma schema
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🔐 Authentication & Authorization

### �� JWT Authentication

- Stateless authentication using JSON Web Tokens
- Token verification middleware
- Role-based access control

### 🛡️ Middleware-based Authorization

- Route-specific middleware for authorization
- Role and permission checks
- Resource ownership validation

## 📊 Monitoring & Logging

- 📝 Structured logging with Winston
- 🔍 Request ID tracking
- ⚠️ Error tracking
- 📈 Performance monitoring

## 🧪 Testing Strategy

### 🔬 Unit Tests

- Test individual functions and methods
- Mock dependencies
- Focus on business logic

### 🔌 Integration Tests

- Test interactions between components
- Use in-memory or test databases
- Verify correct data flow

### 🌐 End-to-End Tests

- Test complete API endpoints
- Verify complete request-response cycle
- Test authentication and authorization

## 📈 Scalability Considerations

- 🔄 Stateless design for horizontal scaling
- 🌊 Database connection pooling
- ⚡ Caching strategies (Redis optional)
- 🚦 Rate limiting and throttling

## 🔮 Future Architecture Considerations

- 🧩 Microservices decomposition
- 📨 Event-driven architecture
- 📱 GraphQL API
- 🔄 Real-time capabilities with WebSockets
