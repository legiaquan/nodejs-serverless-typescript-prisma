# 📚 API Documentation

This document provides detailed information about the API endpoints, authentication, request/response formats, and error handling.

## 🌐 Base URL

- 💻 Development: `http://localhost:3000/api`
- 🚀 Production: `https://api.yourdomain.com/api`

## 🔐 Authentication

Most API endpoints require authentication via JWT tokens.

### 🔑 Obtaining a Token

```
POST /auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### 🔓 Using the Token

Include the token in the Authorization header for all protected requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🛣️ API Endpoints

### 👤 User Management

#### 👀 Get Current User

```
GET /users/me
```

**Response:**

```json
{
  "id": "1",
  "email": "user@example.com",
  "name": "User Name",
  "createdAt": "2023-04-01T12:00:00Z",
  "updatedAt": "2023-04-01T12:00:00Z"
}
```

#### ➕ Create User

```
POST /users
```

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "name": "New User"
}
```

**Response:**

```json
{
  "id": "2",
  "email": "newuser@example.com",
  "name": "New User",
  "createdAt": "2023-04-02T12:00:00Z",
  "updatedAt": "2023-04-02T12:00:00Z"
}
```

### 📦 Items

#### 📋 List Items

```
GET /items
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Field to sort by
- `order` (optional): Sort order (`asc` or `desc`)

**Response:**

```json
{
  "items": [
    {
      "id": "1",
      "name": "Item 1",
      "description": "Description for item 1",
      "createdAt": "2023-04-01T12:00:00Z",
      "updatedAt": "2023-04-01T12:00:00Z"
    },
    {
      "id": "2",
      "name": "Item 2",
      "description": "Description for item 2",
      "createdAt": "2023-04-02T12:00:00Z",
      "updatedAt": "2023-04-02T12:00:00Z"
    }
  ],
  "meta": {
    "totalItems": 50,
    "itemsPerPage": 10,
    "currentPage": 1,
    "totalPages": 5
  }
}
```

#### 🔍 Get Item by ID

```
GET /items/:id
```

**Response:**

```json
{
  "id": "1",
  "name": "Item 1",
  "description": "Description for item 1",
  "createdAt": "2023-04-01T12:00:00Z",
  "updatedAt": "2023-04-01T12:00:00Z"
}
```

#### ✨ Create Item

```
POST /items
```

**Request Body:**

```json
{
  "name": "New Item",
  "description": "Description for new item"
}
```

**Response:**

```json
{
  "id": "3",
  "name": "New Item",
  "description": "Description for new item",
  "createdAt": "2023-04-03T12:00:00Z",
  "updatedAt": "2023-04-03T12:00:00Z"
}
```

#### 🔄 Update Item

```
PUT /items/:id
```

**Request Body:**

```json
{
  "name": "Updated Item",
  "description": "Updated description"
}
```

**Response:**

```json
{
  "id": "3",
  "name": "Updated Item",
  "description": "Updated description",
  "createdAt": "2023-04-03T12:00:00Z",
  "updatedAt": "2023-04-03T13:00:00Z"
}
```

#### 🗑️ Delete Item

```
DELETE /items/:id
```

**Response:**

```json
{
  "message": "Item deleted successfully"
}
```

## ⚠️ Error Handling

### 📝 Error Response Format

All API errors follow a consistent format:

```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    // Additional error details (optional)
  }
}
```

### 🚨 Common Error Codes

- `UNAUTHORIZED`: Authentication is required or failed
- `FORBIDDEN`: User doesn't have permission for the requested action
- `NOT_FOUND`: The requested resource was not found
- `VALIDATION_ERROR`: Request validation failed
- `INTERNAL_SERVER_ERROR`: An unexpected error occurred

### ❌ Validation Errors

Validation errors include details about which fields failed validation:

```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": {
    "errors": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

## 🚦 Rate Limiting

API requests are subject to rate limiting to prevent abuse. The current limits are:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

When rate limits are exceeded, the API will respond with a 429 status code and the following response:

```json
{
  "status": "error",
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests, please try again later",
  "details": {
    "retryAfter": 30 // Seconds until rate limit resets
  }
}
```

## 📌 Versioning

The API version is specified in the URL path:

```
/api/v1/users
```

When breaking changes are introduced, a new version will be released while maintaining support for older versions for a deprecation period.
