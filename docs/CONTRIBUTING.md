# 🤝 Contributing Guide

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## 📜 Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to help us maintain a healthy and welcoming community.

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js >= 22.0.0
- npm >= 9.0.0
- Docker and Docker Compose
- Git

### 🔧 Development Setup

1. **Fork the repository** 🍴

   Click the "Fork" button at the top right of the repository page.

2. **Clone your fork** 📥

   ```bash
   git clone https://github.com/YOUR_USERNAME/nodejs-serverless-typescript-prisma.git
   cd nodejs-serverless-typescript-prisma
   ```

3. **Add the upstream remote** 🔗

   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/nodejs-serverless-typescript-prisma.git
   ```

4. **Install dependencies** 📦

   ```bash
   npm install
   ```

5. **Set up environment variables** ⚙️

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

6. **Start the development environment** 🏁

   ```bash
   docker-compose up -d
   npm run prisma:migrate:dev
   npm start
   ```

## 💻 Development Workflow

### 🌿 Branching Strategy

- `main` - Main branch, contains production-ready code
- `develop` - Development branch, contains code for the next release
- `feature/*` - Feature branches, for new features and non-urgent bug fixes
- `bugfix/*` - Bug fix branches, for fixes that will be part of the next release
- `hotfix/*` - Hotfix branches, for urgent fixes to production

### ✨ Creating a New Feature

1. **Create a new branch from `develop`** 🌱

   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit them** 📝

   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

3. **Push your changes to your fork** 📤

   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** 🔄

   Go to the repository page on GitHub and click "New Pull Request".

### 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### 🏷️ Types

- `build`: Changes that affect the build system or external dependencies
- `chore`: Regular maintenance tasks and updates
- `ci`: Changes to CI configuration files and scripts
- `docs`: Documentation only changes
- `feat`: A new feature implementation
- `fix`: A bug fix
- `hotfix`: Hotfix for critical issues
- `perf`: A code change that improves performance
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `revert`: Reverting a previous commit
- `style`: Changes that do not affect the meaning of the code (whitespace, formatting, etc)
- `test`: Adding or modifying tests

#### 💡 Examples

```
feat: add user authentication endpoint
fix: resolve issue with password reset email
docs: update API documentation
```

## 📌 Pull Request Process

1. **Ensure your code passes all tests** ✅

   ```bash
   npm test
   ```

2. **Ensure your code follows the project's style guidelines** 🎨

   ```bash
   npm run lint
   npm run format
   ```

3. **Update documentation if necessary** 📚

4. **Fill out the PR template completely** 📋

5. **Request a review from a team member** 👀

6. **Address any feedback from reviewers** 🔄

7. **Once approved, your PR will be merged** 🎉

## 🧰 Code Style and Quality

### 🔍 Linting and Formatting

We use ESLint and Prettier to maintain code quality and consistency:

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### 🧪 Testing

All new features and bug fixes should include tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Our goal is to maintain at least 80% test coverage.

## 📖 API Documentation

If you make changes to the API, please update the Swagger documentation:

1. Update the relevant files in the `src/swagger` directory
2. Generate updated documentation:

   ```bash
   npm run swagger:generate
   ```

## 🗄️ Database Changes

When making changes to the database schema:

1. Create a new Prisma migration:

   ```bash
   npm run prisma:migrate:dev -- --name your_migration_name
   ```

2. Apply the migration:

   ```bash
   npm run prisma:migrate:dev
   ```

3. Generate the Prisma client:

   ```bash
   npm run prisma:generate
   ```

4. Include both the migration files and the updated schema in your PR

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. A clear and descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Environment information:
   - Node.js version
   - npm version
   - Operating system
   - Any other relevant details

## 💫 Suggesting Enhancements

When suggesting enhancements, please include:

1. A clear and descriptive title
2. A detailed description of the proposed enhancement
3. Any potential implementation details
4. Why this enhancement would be useful to most users

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the project's license.

---

Thank you for contributing to our project! 🎉
