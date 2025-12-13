# Sweet Shop Setup Guide

## 🚀 Quick Start

#### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env file** with your configuration (or use defaults)

5. **Start MongoDB**:
   - Install MongoDB locally, or
   - Use MongoDB Atlas (cloud)

6. **Start the backend server:**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start

   # Run tests
   npm test

   # Run tests with coverage
   npm run test:coverage
   ```

#### Frontend Setup

1. **Open a new terminal and navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open browser to:** http://localhost:5173

## 🧪 Running Tests

### Backend Tests (TDD)

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Expected Test Output

You should see tests passing for:
- ✅ User registration and login
- ✅ JWT authentication
- ✅ Sweet CRUD operations
- ✅ Search and filtering
- ✅ Purchase functionality
- ✅ Restock (admin only)
- ✅ Authorization checks

## 👤 Test Users

You can create users through the registration form, or use these test accounts:

**Admin Account:**
- Email: `admin@sweetshop.com`
- Password: `admin123`
- Role: admin

**Regular User:**
- Email: `user@sweetshop.com`
- Password: `user123`
- Role: user

> **Note:** You'll need to create these accounts through the register page first!

## 📝 Git Workflow

### Initial Commit

```bash
# Initialize git repository
git init

# Add all files
git add .

# First commit with AI co-authorship
git commit -m "feat: Initial project scaffold with TDD setup

Created full-stack MERN application structure with:
- Backend API with Express, MongoDB, JWT auth
- Frontend React app with Vite
- TDD approach with Jest and Supertest
- Docker Compose for easy deployment
- Google-inspired UI design

Co-authored-by: GitHub Copilot <copilot@github.com>"
```

### Commit Auth Implementation

```bash
git add backend/__tests__/auth/ backend/controllers/authController.js backend/routes/auth.js backend/models/User.js

git commit -m "feat: Implement user authentication with TDD

TDD Red Phase:
- Created comprehensive auth tests for registration and login
- Tested validation, JWT generation, and error handling

TDD Green Phase:
- Implemented User model with bcrypt password hashing
- Created auth controller with registration and login endpoints
- Added JWT middleware for route protection

Tests: 10 passing

Co-authored-by: GitHub Copilot <copilot@github.com>"
```

### Commit Sweet CRUD

```bash
git add backend/__tests__/sweets/ backend/controllers/sweetController.js backend/routes/sweets.js backend/models/Sweet.js

git commit -m "feat: Implement sweet CRUD operations with TDD

TDD Red Phase:
- Wrote tests for CRUD operations, search, filtering
- Tested admin authorization and inventory management

TDD Green Phase:
- Implemented Sweet model with validation
- Created controllers for all CRUD operations
- Added search functionality with multiple filters
- Implemented purchase and restock features

Tests: 25 passing

Co-authored-by: GitHub Copilot <copilot@github.com>"
```

### Commit Frontend

```bash
git add frontend/

git commit -m "feat: Build React frontend with Google-inspired UI

Created comprehensive frontend with:
- React Router for navigation
- Context API for state management
- Auth pages (login/register) with validation
- Dashboard with search and filter
- Admin panel for inventory management
- Responsive Google Material Design
- Axios interceptors for API communication

Co-authored-by: GitHub Copilot <copilot@github.com>"
```

## 🌐 Deployment

### Deploy to Heroku (Backend)

```bash
cd backend

# Login to Heroku
heroku login

# Create app
heroku create sweet-shop-backend

# Add MongoDB Atlas (free tier)
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your-production-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Deploy to Vercel (Frontend)

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL production
# Enter your backend URL (e.g., https://sweet-shop-backend.herokuapp.com/api)

# Deploy to production
vercel --prod
```

### Deploy to Railway (Full Stack)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect and deploy both backend and frontend

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. Make sure MongoDB is running: `docker ps` or `mongod --version`
2. Check connection string in `.env`
3. For Docker: `docker-compose up mongodb`

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Change port in `.env`: `PORT=5001`
2. Kill process using port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F

   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   ```

### Frontend Can't Connect to Backend

**Problem:** API requests fail with CORS or network errors

**Solutions:**
1. Make sure backend is running on port 5000
2. Check proxy in `vite.config.js`
3. Verify `VITE_API_URL` in frontend `.env`

### Tests Failing

**Problem:** Tests timeout or fail to connect to database

**Solutions:**
1. Tests use in-memory MongoDB, no setup needed
2. Increase timeout in `package.json`: `"test": "jest --testTimeout=20000"`
3. Run tests individually: `npm test -- auth.test.js`

## 📊 Test Coverage Report

After running `npm run test:coverage` in backend, you'll find a detailed HTML report in `backend/coverage/lcov-report/index.html`.

Open it in a browser to see:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

Aim for >80% coverage on all metrics!

## 🎯 Development Checklist

- [x] Project scaffold created
- [x] Backend API with all endpoints
- [x] TDD tests written and passing
- [x] Frontend React application
- [x] Google-inspired UI design
- [x] Docker Compose configuration
- [x] README with AI usage documentation
- [ ] Deploy to production
- [ ] Add screenshots to README
- [ ] Create demo video

## 📞 Need Help?

If you encounter any issues:
1. Check this guide's troubleshooting section
2. Review the error messages carefully
3. Ensure all dependencies are installed
4. Verify environment variables are set correctly

Happy coding! 🍬
