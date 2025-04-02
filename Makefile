# Variables
DOCKER_COMPOSE = docker-compose
DOCKER_COMPOSE_TEST = docker-compose -f docker-compose.test.yml
NODE_CONTAINER = nodejs-serverless-app
MYSQL_CONTAINER = nodejs-serverless-mysql
MYSQL_TEST_CONTAINER = nodejs-serverless-mysql-test

# Colors
COLOR_RESET = \033[0m
COLOR_GREEN = \033[32m
COLOR_YELLOW = \033[33m
COLOR_BLUE = \033[34m
COLOR_RED = \033[31m

# Help command
.PHONY: help
help:
	@echo "$(COLOR_GREEN)Available commands:$(COLOR_RESET)"
	@echo "$(COLOR_BLUE)make init$(COLOR_RESET)        - Initialize the development environment"
	@echo "$(COLOR_BLUE)make start$(COLOR_RESET)       - Start the Docker containers"
	@echo "$(COLOR_BLUE)make stop$(COLOR_RESET)        - Stop the Docker containers"
	@echo "$(COLOR_BLUE)make down$(COLOR_RESET)        - Stop and remove the Docker containers"
	@echo "$(COLOR_BLUE)make restart$(COLOR_RESET)     - Restart the Docker containers"
	@echo "$(COLOR_BLUE)make logs$(COLOR_RESET)        - View logs from all containers"
	@echo "$(COLOR_BLUE)make shell$(COLOR_RESET)       - Open a shell in the Node.js container"
	@echo "$(COLOR_BLUE)make mysql$(COLOR_RESET)       - Open a MySQL shell"
	@echo "$(COLOR_BLUE)make prisma-migrate$(COLOR_RESET) - Run Prisma migrations"
	@echo "$(COLOR_BLUE)make prisma-studio$(COLOR_RESET)  - Start Prisma Studio"
	@echo "$(COLOR_BLUE)make install$(COLOR_RESET)     - Install dependencies"
	@echo "$(COLOR_BLUE)make build$(COLOR_RESET)       - Build the application"
	@echo "$(COLOR_BLUE)make dev$(COLOR_RESET)         - Start the application in development mode"
	@echo "$(COLOR_BLUE)make pre-test$(COLOR_RESET)    - Set up the test environment"
	@echo "$(COLOR_BLUE)make test$(COLOR_RESET)        - Run tests"
	@echo "$(COLOR_BLUE)make clean$(COLOR_RESET)       - Clean up Docker resources"

# Initialize the development environment
.PHONY: init
init:
	@echo "$(COLOR_YELLOW)Initializing development environment...$(COLOR_RESET)"
	@if [ ! -f .env ]; then \
		echo "$(COLOR_YELLOW)Creating .env file from .env.docker...$(COLOR_RESET)"; \
		cp .env.docker .env; \
	else \
		echo "$(COLOR_YELLOW).env file already exists, skipping...$(COLOR_RESET)"; \
	fi
	@$(DOCKER_COMPOSE) build
	@$(DOCKER_COMPOSE) up -d
	@echo "$(COLOR_GREEN)Installing dependencies...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) exec $(NODE_CONTAINER) pnpm install
	@echo "$(COLOR_GREEN)Running Prisma migrations...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) exec $(NODE_CONTAINER) pnpm prisma:migrate:dev
	@echo "$(COLOR_GREEN)Development environment initialized successfully!$(COLOR_RESET)"
	@echo "$(COLOR_YELLOW)You can now run 'make dev' to start the application.$(COLOR_RESET)"

# Start the Docker containers
.PHONY: start
start:
	@echo "$(COLOR_YELLOW)Starting Docker containers...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) up -d
	@echo "$(COLOR_GREEN)Docker containers started successfully!$(COLOR_RESET)"

# Stop the Docker containers
.PHONY: stop
stop:
	@echo "$(COLOR_YELLOW)Stopping Docker containers...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) stop
	@echo "$(COLOR_GREEN)Docker containers stopped successfully!$(COLOR_RESET)"

# Stop and remove the Docker containers
.PHONY: down
down:
	@echo "$(COLOR_YELLOW)Stopping and removing Docker containers...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) down
	@echo "$(COLOR_GREEN)Docker containers stopped and removed successfully!$(COLOR_RESET)"

# Restart the Docker containers
.PHONY: restart
restart:
	@echo "$(COLOR_YELLOW)Restarting Docker containers...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) restart
	@echo "$(COLOR_GREEN)Docker containers restarted successfully!$(COLOR_RESET)"

# View logs from all containers
.PHONY: logs
logs:
	@$(DOCKER_COMPOSE) logs -f

# Open a shell in the Node.js container
.PHONY: shell
shell:
	@echo "$(COLOR_YELLOW)Opening shell in Node.js container...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) exec $(NODE_CONTAINER) sh

# Open a MySQL shell
.PHONY: mysql
mysql:
	@echo "$(COLOR_YELLOW)Opening MySQL shell...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) exec $(MYSQL_CONTAINER) mysql -u$${MYSQL_USER:-user} -p$${MYSQL_PASSWORD:-password} $${MYSQL_DATABASE:-serverless_db}

# Run Prisma migrations
.PHONY: prisma-migrate
prisma-migrate:
	@echo "$(COLOR_YELLOW)Running Prisma migrations...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) exec $(NODE_CONTAINER) pnpm prisma:migrate:dev
	@echo "$(COLOR_GREEN)Prisma migrations completed successfully!$(COLOR_RESET)"

# Start Prisma Studio
.PHONY: prisma-studio
prisma-studio:
	@echo "$(COLOR_YELLOW)Starting Prisma Studio...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) exec -d $(NODE_CONTAINER) pnpm prisma studio --port 5555
	@echo "$(COLOR_GREEN)Prisma Studio started on http://localhost:5555$(COLOR_RESET)"

# Install dependencies
.PHONY: install
install:
	@echo "$(COLOR_YELLOW)Installing dependencies...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) exec $(NODE_CONTAINER) pnpm install
	@echo "$(COLOR_GREEN)Dependencies installed successfully!$(COLOR_RESET)"

# Build the application
.PHONY: build
build:
	@echo "$(COLOR_YELLOW)Building the application...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) exec $(NODE_CONTAINER) pnpm build
	@echo "$(COLOR_GREEN)Application built successfully!$(COLOR_RESET)"

# Start the application in development mode
.PHONY: dev
dev:
	@echo "$(COLOR_YELLOW)Starting the application in development mode...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) exec $(NODE_CONTAINER) pnpm start

# Set up the test environment
.PHONY: pre-test
pre-test:
	@echo "$(COLOR_YELLOW)Setting up test environment...$(COLOR_RESET)"
	@if [ ! -f .env.test ]; then \
		echo "$(COLOR_RED)Error: .env.test file not found!$(COLOR_RESET)"; \
		exit 1; \
	fi
	@echo "$(COLOR_YELLOW)Starting test database...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE_TEST) up -d
	@echo "$(COLOR_YELLOW)Waiting for test database to be ready...$(COLOR_RESET)"
	@sleep 5
	@echo "$(COLOR_YELLOW)Running test database migrations...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) exec $(NODE_CONTAINER) pnpm test:migrate
	@echo "$(COLOR_YELLOW)Seeding test database...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) exec -e DATABASE_URL=$$(grep DATABASE_URL .env.test | cut -d '=' -f2) $(NODE_CONTAINER) pnpm test:seed
	@echo "$(COLOR_GREEN)Test environment setup completed successfully!$(COLOR_RESET)"

# Run tests
.PHONY: test
test: pre-test
	@echo "$(COLOR_YELLOW)Running tests...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) exec -e NODE_ENV=test -e DATABASE_URL=$$(grep DATABASE_URL .env.test | cut -d '=' -f2) $(NODE_CONTAINER) pnpm test
	@echo "$(COLOR_GREEN)Tests completed!$(COLOR_RESET)"

# Run tests with coverage
.PHONY: test-coverage
test-coverage: pre-test
	@echo "$(COLOR_YELLOW)Running tests with coverage...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) exec -e NODE_ENV=test -e DATABASE_URL=$$(grep DATABASE_URL .env.test | cut -d '=' -f2) $(NODE_CONTAINER) pnpm test:coverage
	@echo "$(COLOR_GREEN)Tests with coverage completed!$(COLOR_RESET)"

# Clean up Docker resources
.PHONY: clean
clean:
	@echo "$(COLOR_YELLOW)Cleaning up Docker resources...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) down -v
	@$(DOCKER_COMPOSE_TEST) down -v
	@echo "$(COLOR_GREEN)Docker resources cleaned up successfully!$(COLOR_RESET)"

# Clean up test environment
.PHONY: clean-test
clean-test:
	@echo "$(COLOR_YELLOW)Cleaning up test environment...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE_TEST) down -v
	@echo "$(COLOR_GREEN)Test environment cleaned up successfully!$(COLOR_RESET)"
