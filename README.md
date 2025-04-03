# Node.js Serverless API with TypeScript and Prisma 🚀

[![Build Status](https://img.shields.io/github/workflow/status/yourusername/node-base/CI)](https://github.com/yourusername/node-base/actions)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A modern, production-ready Node.js API template built with TypeScript, Serverless Framework, and Prisma ORM. This template provides a solid foundation for building scalable, maintainable, and testable serverless applications.

**Key Features:**

- 🚀 Serverless-first architecture with Express.js compatibility
- 🛠️ Type-safe development with TypeScript
- 📊 Database integration with Prisma ORM
- 🔒 Built-in security features and best practices
- 📝 API documentation with Swagger/OpenAPI
- 🧪 Testing infrastructure with Jest
- 🔄 CI/CD workflows with GitHub Actions
- 🐳 Containerization with Docker

## Table of Contents

- [🚀 Quick Start](#quick-start)
- [📂 Project Structure](#project-structure)
- [⚙️ Tech Stack](#tech-stack)
- [👨‍💻 Development Guide](#development-guide)
  - [📋 Prerequisites](#prerequisites)
  - [🏁 Getting Started](#getting-started)
  - [🔑 Environment Variables](#environment-variables)
  - [💻 Development Workflow](#development-workflow)
  - [🧪 Testing](#testing)
  - [📚 API Documentation](#api-documentation)
- [🚢 Deployment](#deployment)
- [🤝 Contributing](#contributing)
- [❓ Troubleshooting](#troubleshooting)
- [🏗️ Architecture](#architecture)
- [📖 Documentation](#documentation)
- [📄 License](#license)

## 🚀 Quick Start

```bash
# Clone the repository
git clone [repository-url]
cd node-base

# Install dependencies
npm install

# Set up environment variables
cp env.example .env

# Start database
docker-compose up -d

# Run migrations
npm run prisma:migrate:dev

# Start development server
npm start
```

Visit `http://localhost:3000/api-docs` to see the API documentation.

## 📂 Project Structure

```
├── src/                    # Source code
│   ├── config/            # Configuration files
│   ├── constants/         # Application constants
│   ├── controllers/       # Request handlers
│   ├── dtos/              # Data Transfer Objects
│   ├── interfaces/        # TypeScript interfaces
│   ├── lib/               # Library code
│   ├── middleware/        # Express middleware
│   ├── models/            # Data models
│   ├── prisma/            # Prisma schema and migrations
│   ├── repos/             # Repository layer
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── swagger/           # API documentation
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── app.ts             # Express application setup
│   ├── handler.ts         # Serverless handler
│   └── local.ts           # Local development server
├── tests/                 # Test files
├── dockers/               # Docker configuration
├── .github/               # GitHub configuration (Actions, PR templates)
├── .husky/                # Git hooks
├── .vscode/               # VS Code settings
└── [config files]         # Various configuration files
```

## ⚙️ Tech Stack

### 🧰 Core Technologies

- **Runtime**: Node.js (>=22.0.0)
- **Framework**: Express.js
- **Serverless**: Serverless Framework
- **Database**: Prisma ORM
- **Language**: TypeScript

### 🛠️ Development & Testing

- **Testing**: Jest
- **Linting**: ESLint + Prettier
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

### 🔒 Security & Performance

- 🛡️ Request validation with express-validator
- 🔰 Security headers with helmet
- 🚦 Rate limiting
- 🌐 CORS configuration
- 🔑 JWT authentication

## 👨‍💻 Development Guide

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js >= 22.0.0
- npm >= 9.0.0
- Docker and Docker Compose
- Serverless Framework CLI (`npm install -g serverless`)
- Git

### 🏁 Getting Started

1. **Clone the repository** 📥

   ```bash
   git clone [repository-url]
   cd node-base
   ```

2. **Install dependencies** 📦

   ```bash
   npm install
   ```

3. **Set up environment variables** 🔧

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup** 🗄️

   ```bash
   # Start database
   docker-compose up -d

   # Run migrations
   npm run prisma:migrate:dev

   # Generate Prisma client
   npm run prisma:generate
   ```

5. **Start development server** 🚀
   ```bash
   npm start
   ```

### 🔑 Environment Variables

The following environment variables are required:

| Variable       | Description                                 | Default       |
| -------------- | ------------------------------------------- | ------------- |
| `NODE_ENV`     | Environment (development, test, production) | `development` |
| `PORT`         | Port for the API server                     | `3000`        |
| `DATABASE_URL` | Prisma database connection string           | -             |
| `JWT_SECRET`   | Secret for JWT token generation             | -             |
| `API_PREFIX`   | Prefix for API routes                       | `/api`        |
| `LOG_LEVEL`    | Logging level                               | `info`        |

See `.env.example` for a complete list of environment variables.

### 💻 Development Workflow

#### 🧹 Code Style

We enforce consistent code style using:

- 🔍 ESLint for linting
- 💅 Prettier for formatting
- 🪝 Husky for git hooks
- 📝 Commitlint for commit message validation

#### 📝 Commit Types

We follow conventional commit messages:

| Type       | Description                                                                      |
| ---------- | -------------------------------------------------------------------------------- |
| `build`    | Changes that affect the build system or external dependencies                    |
| `chore`    | Regular maintenance tasks and updates                                            |
| `ci`       | Changes to CI configuration files and scripts                                    |
| `docs`     | Documentation only changes                                                       |
| `feat`     | A new feature implementation                                                     |
| `fix`      | A bug fix                                                                        |
| `hotfix`   | Hotfix                                                                           |
| `perf`     | A code change that improves performance                                          |
| `refactor` | A code change that neither fixes a bug nor adds a feature                        |
| `revert`   | Reverting a previous commit                                                      |
| `style`    | Changes that do not affect the meaning of the code (whitespace, formatting, etc) |
| `test`     | Adding or modifying tests                                                        |

#### 💬 Example Commit Messages

```
feat: add user authentication endpoints
fix: resolve issue with password reset email
docs: update API documentation for auth endpoints
refactor: improve error handling in authentication middleware
```

#### 📜 Available Scripts

```bash
npm start              # Start local development server
npm run build          # Build the project
npm run deploy         # Deploy to serverless
npm run offline        # Start serverless offline
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
npm run prisma:studio  # Open Prisma Studio
npm test               # Run tests
npm run test:coverage  # Run tests with coverage
npm run test:watch     # Run tests in watch mode
```

### 🧪 Testing

We use Jest for unit and integration tests:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

#### ✏️ Writing Tests

Place your test files in the `tests` directory, matching the structure of the `src` directory. For example:

```
src/services/user.service.ts → tests/services/user.service.test.ts
```

Example test:

```typescript
import { UserService } from '../../src/services/user.service';

describe('UserService', () => {
  it('should create a user', async () => {
    // Test implementation
  });
});
```

### 📚 API Documentation

Swagger documentation is available at `/api-docs` when running the server. To generate updated documentation:

```bash
npm run swagger:generate
```

## 🚢 Deployment

### ☁️ Serverless Deployment

To deploy to AWS Lambda:

```bash
npm run deploy
```

This uses the Serverless Framework configuration in `serverless.yml`.

### 🐳 Docker Deployment

Build and run the Docker container:

```bash
docker build -t node-api .
docker run -p 3000:3000 node-api
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Create a new branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them following our commit message conventions

3. Push your branch and create a pull request:

   ```bash
   git push origin feature/your-feature-name
   ```

4. Fill out the PR template with all required information

5. Request a review from a team member

### 📋 Pull Request Process

1. ✅ Ensure your code passes all tests and linting
2. 📝 Update documentation if needed
3. 🧪 Add tests for new features
4. 👀 Get approval from at least one reviewer
5. 🔀 Squash and merge once approved

## ❓ Troubleshooting

### 🔍 Common Issues

#### 🗄️ Database Connection Issues

If you're having trouble connecting to the database:

1. Ensure the database container is running:

   ```bash
   docker ps | grep postgres
   ```

2. Check your `.env` file has the correct `DATABASE_URL`

3. Try resetting the database:
   ```bash
   npm run prisma:reset
   ```

#### ⚡ Serverless Offline Issues

If serverless offline isn't working:

1. Ensure you have the latest version of the Serverless Framework:

   ```bash
   npm install -g serverless
   ```

2. Try clearing the cache:
   ```bash
   serverless offline --clear-caches
   ```

## 🏗️ Architecture

### 🔎 High-Level Architecture

This project follows a layered architecture:

1. **Routes** - Define API endpoints and map them to controllers
2. **Controllers** - Handle HTTP requests and responses
3. **Services** - Implement business logic
4. **Repositories** - Handle data access and storage
5. **Models** - Define data structures

### 🔄 Data Flow

```
Request → Routes → Controllers → Services → Repositories → Database
Response ← Controllers ← Services ← Repositories ← Database
```

### ⚠️ Error Handling

We use a centralized error handling approach:

1. Custom error classes in `src/utils/errors`
2. Error handling middleware in `src/middleware/error.middleware.ts`
3. Consistent error responses with proper HTTP status codes

## 📖 Documentation

For more detailed documentation, please refer to the following resources:

- 📚 [API Documentation](docs/API.md) - Detailed API endpoints, authentication, and error handling
- 🏗️ [Architecture Documentation](docs/ARCHITECTURE.md) - System design, patterns, and data flow
- 🤝 [Contributing Guide](docs/CONTRIBUTING.md) - Guidelines for contributing to the project

## 📄 License

This project is licensed under the MIT License

---

Built with ❤️ by [Le Gia Quan](https://www.linkedin.com/in/legiaquan/)
