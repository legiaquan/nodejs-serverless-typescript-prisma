# Node.js Serverless API with TypeScript and Prisma

A modern Node.js API template built with TypeScript, Serverless Framework, and Prisma ORM.

## 🚀 Project Structure

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
├── .husky/                # Git hooks
├── .vscode/               # VS Code settings
└── [config files]         # Various configuration files
```

## 🛠️ Tech Stack

- **Runtime**: Node.js (>=22.0.0)
- **Framework**: Express.js
- **Serverless**: Serverless Framework
- **Database**: Prisma ORM
- **Language**: TypeScript
- **Testing**: Jest
- **Linting**: ESLint + Prettier
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

## 📋 Prerequisites

- Node.js >= 22.0.0
- Docker and Docker Compose
- Serverless Framework CLI
- Prisma CLI

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd node-base
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # Start database
   docker-compose up -d
   
   # Run migrations
   npm run prisma:migrate:dev
   ```

5. **Start development server**
   ```bash
   npm start
   ```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🔧 Development Workflow

1. **Code Style**
   - ESLint for linting
   - Prettier for formatting
   - Husky for git hooks
   - Commitlint for commit message validation

2. **Available Scripts**
   ```bash
   npm start              # Start local development server
   npm run build          # Build the project
   npm run deploy         # Deploy to serverless
   npm run offline        # Start serverless offline
   npm run lint           # Run ESLint
   npm run format         # Format code with Prettier
   npm run prisma:studio  # Open Prisma Studio
   ```

## 📚 API Documentation

- Swagger documentation is available at `/api-docs` when running the server
- Generate new documentation:
  ```bash
  npm run swagger:generate
  ```

## 🐳 Docker Support

- Development environment:
  ```bash
  docker-compose up -d
  ```

- Test environment:
  ```bash
  docker-compose -f docker-compose.test.yml up -d
  ```

## 🔐 Security Features

- Helmet for security headers
- Rate limiting
- CORS configuration
- JWT authentication
- Environment variable management

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Run tests
4. Submit a pull request

## 📝 License

[Add your license information here]

## Table of Contents

- [Project Overview](#project-overview)
- [Source Code Structure](#source-code-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Onboarding Steps](#onboarding-steps)
  - [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
  - [Development with Docker](#development-with-docker)
  - [Development without Docker](#development-without-docker)
  - [API Documentation](#api-documentation)
- [Makefile Commands](#makefile-commands)
- [Testing](#testing)
  - [Test Environment](#test-environment)
  - [Running Tests](#running-tests)
- [Best Practices](#best-practices)
  - [Code Style](#code-style)
  - [Git Workflow](#git-workflow)
  - [Database Changes](#database-changes)
  - [API Design](#api-design)
  - [Error Handling](#error-handling)

## Project Overview

This project is a serverless Node.js API built with TypeScript and Prisma ORM. It's designed to be deployed as serverless functions but can also run as a traditional Express application for local development. The project follows modern practices for type safety, code quality, and testing.

## Source Code Structure



- **Runtime**: Node.js (>=22.0.0)
- **Framework**: Express.js
- **Serverless**: Serverless Framework
- **Database**: Prisma ORM
- **Language**: TypeScript
- **Testing**: Jest
- **Linting**: ESLint + Prettier
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

## 📋 Prerequisites

- Node.js >= 22.0.0
- Docker and Docker Compose
- Serverless Framework CLI
- Prisma CLI

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd node-base
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # Start database
   docker-compose up -d

   # Run migrations
   npm run prisma:migrate:dev
   ```

5. **Start development server**
   ```bash
   npm start
   ```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🔧 Development Workflow

1. **Code Style**
   - ESLint for linting
   - Prettier for formatting
   - Husky for git hooks
   - Commitlint for commit message validation

2. **Available Scripts**
   ```bash
   npm start              # Start local development server
   npm run build          # Build the project
   npm run deploy         # Deploy to serverless
   npm run offline        # Start serverless offline
   npm run lint           # Run ESLint
   npm run format         # Format code with Prettier
   npm run prisma:studio  # Open Prisma Studio
   ```

## 📚 API Documentation

- Swagger documentation is available at `/api-docs` when running the server
- Generate new documentation:
  ```bash
  npm run swagger:generate
  ```

## 🐳 Docker Support

- Development environment:
  ```bash
  docker-compose up -d
  ```

- Test environment:
  ```bash
  docker-compose -f docker-compose.test.yml up -d
  ```

## 🔐 Security Features

- Helmet for security headers
- Rate limiting
- CORS configuration
- JWT authentication
- Environment variable management

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Run tests
4. Submit a pull request
