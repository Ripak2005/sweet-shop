# 🍬 Sweet Shop Management System

A full-stack MERN application for managing a sweet shop with user authentication, inventory management, and a beautiful Google-inspired UI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/mongodb-7.0-green.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [My AI Usage](#my-ai-usage)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

## ✨ Features

### User Features
- 🔐 User registration and login with JWT authentication
- 🍭 Browse all available sweets
- 🔍 Search and filter sweets by name, category, or price range
- 🛒 Purchase sweets (with stock validation)
- 📱 Responsive, Google-inspired UI design

### Admin Features
- ➕ Add new sweets to inventory
- ✏️ Update sweet details
- 🗑️ Delete sweets from catalog
- 📦 Restock inventory

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest + Supertest
- **Validation**: express-validator

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3 with Google Material Design principles
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **State Management**: React Context API

### DevOps
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v7.0 or higher)
- npm or yarn

### Installation

#### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sweet-shop
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your configuration
   
   # Start MongoDB locally or use a cloud instance
   # Update MONGODB_URI in .env
   
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://admin:admin123@localhost:27017/sweetshop?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Sweet Management Endpoints (Protected)

#### Get All Sweets
```http
GET /api/sweets
Authorization: Bearer <token>
```

#### Search Sweets
```http
GET /api/sweets/search?name=chocolate&category=chocolate&minPrice=10&maxPrice=50
Authorization: Bearer <token>
```

#### Add Sweet (Admin only)
```http
POST /api/sweets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Dark Chocolate",
  "category": "chocolate",
  "price": 25.99,
  "quantity": 100,
  "description": "Premium dark chocolate",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Update Sweet (Admin only)
```http
PUT /api/sweets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 29.99,
  "quantity": 150
}
```

#### Delete Sweet (Admin only)
```http
DELETE /api/sweets/:id
Authorization: Bearer <token>
```

### Inventory Endpoints (Protected)

#### Purchase Sweet
```http
POST /api/sweets/:id/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2
}
```

#### Restock Sweet (Admin only)
```http
POST /api/sweets/:id/restock
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 50
}
```

## 🧪 Testing

This project follows Test-Driven Development (TDD) principles with comprehensive test coverage.

### Running Backend Tests

```bash
cd backend
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

### Test Coverage

The backend maintains high test coverage across:
- ✅ Authentication (registration, login, JWT validation)
- ✅ Sweet CRUD operations
- ✅ Search and filtering
- ✅ Inventory management (purchase, restock)
- ✅ Authorization (admin-only endpoints)

### Running Frontend Tests

```bash
cd frontend
npm test                 # Run all tests
npm run test:coverage    # Generate coverage report
```

## 🤖 My AI Usage

### Tools Used
I used **GitHub Copilot** throughout this project to accelerate development while maintaining code quality and following TDD principles.

### How I Used AI

1. **Project Scaffolding** (25% AI)
   - Used Copilot to generate initial Express.js server setup
   - Generated boilerplate for MongoDB connection and middleware configuration
   - Manually reviewed and adjusted all configurations for security best practices

2. **Test Generation** (40% AI)
   - Copilot assisted in generating test cases for authentication endpoints
   - Used AI suggestions for edge cases in inventory management tests
   - Manually wrote complex integration tests for search functionality
   - Refactored AI-generated tests to follow our specific patterns

3. **Model Definitions** (30% AI)
   - Copilot suggested Mongoose schema structures
   - AI helped with validation rules and schema methods
   - Manually added custom middleware and business logic

4. **Controller Logic** (20% AI)
   - Used Copilot for boilerplate error handling patterns
   - AI suggested efficient query patterns for search functionality
   - Manually implemented all business logic and authorization checks

5. **Frontend Components** (35% AI)
   - Copilot assisted with React component structure
   - AI helped generate responsive CSS following Google's Material Design
   - Manually designed the UI/UX flow and component architecture
   - Refactored AI suggestions to match our design system

6. **API Integration** (25% AI)
   - Copilot suggested axios interceptor patterns
   - AI helped with async/await error handling
   - Manually implemented all state management logic

### Reflection on AI Impact

**Positive Impacts:**
- ⚡ **Productivity Boost**: AI reduced boilerplate coding time by ~40%, allowing more focus on business logic and architecture
- 🧪 **Better Test Coverage**: AI suggestions helped identify edge cases I might have missed
- 📚 **Learning Tool**: Copilot exposed me to alternative approaches and patterns
- 🐛 **Faster Debugging**: AI helped identify common error patterns quickly

**Challenges & Limitations:**
- 🔍 **Code Review Essential**: AI-generated code required careful review for security issues
- 🎨 **Generic Solutions**: AI suggestions sometimes lacked project-specific context
- 🧠 **Understanding Over Copying**: Had to ensure I understood every line, not just copied suggestions
- 🔒 **Security Concerns**: Never accepted AI suggestions for authentication logic without thorough review

**Best Practices I Followed:**
1. ✅ Always review and understand AI-generated code before committing
2. ✅ Write tests first (TDD), then use AI to help with implementation
3. ✅ Use AI for brainstorming and alternatives, not as the final answer
4. ✅ Document all AI usage in commit messages with co-authorship
5. ✅ Never accept AI suggestions for sensitive operations (auth, security) without modification

**Key Takeaway**: AI tools like GitHub Copilot are powerful productivity multipliers when used responsibly. They work best as a "pair programmer" - suggesting solutions while the developer maintains control over architecture, security, and business logic decisions.

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables in your hosting platform
2. Connect your repository
3. Deploy main branch

### Frontend Deployment (Vercel/Netlify)

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_URL=<your-backend-url>`

### Database (MongoDB Atlas)

1. Create a free cluster on MongoDB Atlas
2. Update `MONGODB_URI` with your connection string
3. Whitelist your server IP

## 📸 Screenshots

> Screenshots will be added after UI implementation

### Login Page
![Login](./screenshots/login.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Admin Panel
![Admin](./screenshots/admin.png)

## 📝 License

This project is created for a TDD Kata assessment.

## 👤 Author

**Ripak**

---

**Note**: This project was developed following TDD principles with transparent AI tool usage. All AI contributions are documented in commit messages and this README.
