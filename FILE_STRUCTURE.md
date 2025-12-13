# 📁 Project Structure

```
Sweet Shop/
│
├── 📄 README.md                    # Main project documentation
├── 📄 SETUP.md                     # Detailed setup instructions
├── 📄 PROJECT_COMPLETE.md          # Completion status & next steps
├── 📄 TESTING.md                   # Testing guide
├── 📄 GIT_GUIDE.md                 # Git commit examples
├── 📄 .gitignore                   # Git ignore rules
│
├── 📂 backend/                     # Node.js Backend
│   ├── 📄 package.json             # Backend dependencies
│   ├── 📄 .env.example             # Environment variable template
│   ├── 📄 .env                     # Environment variables (gitignored)
│   ├── 📄 server.js                # Express server entry point
│   │
│   ├── 📂 config/
│   │   └── 📄 db.js                # MongoDB connection
│   │
│   ├── 📂 models/
│   │   ├── 📄 User.js              # User schema & methods
│   │   └── 📄 Sweet.js             # Sweet schema & methods
│   │
│   ├── 📂 controllers/
│   │   ├── 📄 authController.js    # Auth business logic
│   │   └── 📄 sweetController.js   # Sweet business logic
│   │
│   ├── 📂 middleware/
│   │   └── 📄 auth.js              # JWT verification & authorization
│   │
│   ├── 📂 routes/
│   │   ├── 📄 auth.js              # Auth API routes
│   │   └── 📄 sweets.js            # Sweet API routes
│   │
│   └── 📂 __tests__/               # Test files
│       ├── 📂 auth/
│       │   └── 📄 auth.test.js     # Auth endpoint tests (10 tests)
│       └── 📂 sweets/
│           └── 📄 sweets.test.js   # Sweet endpoint tests (24 tests)
│
└── 📂 frontend/                    # React Frontend
    ├── 📄 package.json             # Frontend dependencies
    ├── 📄 vite.config.js           # Vite configuration
    ├── 📄 index.html               # HTML entry point
    │
    └── 📂 src/
        ├── 📄 main.jsx             # React entry point
        ├── 📄 App.jsx              # Main app component
        ├── 📄 App.css              # App-specific styles
        ├── 📄 index.css            # Global styles (Google-inspired)
        │
        ├── 📂 components/
        │   ├── 📄 Navbar.jsx       # Navigation bar
        │   ├── 📄 PrivateRoute.jsx # Auth route guard
        │   └── 📄 AdminRoute.jsx   # Admin route guard
        │
        ├── 📂 pages/
        │   ├── 📄 Login.jsx        # Login page
        │   ├── 📄 Register.jsx     # Registration page
        │   ├── 📄 Dashboard.jsx    # User dashboard (sweet catalog)
        │   └── 📄 AdminPanel.jsx   # Admin management panel
        │
        ├── 📂 context/
        │   ├── 📄 AuthContext.jsx  # Auth state management
        │   └── 📄 SweetContext.jsx # Sweet state management
        │
        └── 📂 utils/
            └── 📄 api.js           # Axios instance & API calls
```

## File Descriptions

### Root Level Files

| File | Purpose |
|------|---------|
| `README.md` | Complete project documentation with AI usage |
| `SETUP.md` | Step-by-step setup and troubleshooting |
| `PROJECT_COMPLETE.md` | Project status and submission guide |
| `TESTING.md` | Testing instructions and coverage |
| `GIT_GUIDE.md` | Git workflow with AI co-authorship examples |
| `.gitignore` | Files to exclude from git |

### Backend Files

#### Core Files
- **`server.js`**: Express server setup, middleware, routes, error handling
- **`config/db.js`**: MongoDB connection with environment-based config

#### Models (Mongoose Schemas)
- **`User.js`**: User schema with password hashing, JWT generation
- **`Sweet.js`**: Sweet schema with validation, timestamps

#### Controllers (Business Logic)
- **`authController.js`**: Registration, login, token generation
- **`sweetController.js`**: CRUD operations, search, purchase, restock

#### Middleware
- **`auth.js`**: JWT verification, role-based authorization

#### Routes
- **`auth.js`**: Auth endpoints with validation
- **`sweets.js`**: Sweet endpoints with protection

#### Tests
- **`auth.test.js`**: 10 tests for authentication
- **`sweets.test.js`**: 24 tests for sweet operations

### Frontend Files

#### Core Files
- **`main.jsx`**: React app mount point
- **`App.jsx`**: Router setup, context providers
- **`index.css`**: Global styles (Google Material Design)
- **`App.css`**: Component-specific styles

#### Components
- **`Navbar.jsx`**: Top navigation with user menu
- **`PrivateRoute.jsx`**: Protects authenticated routes
- **`AdminRoute.jsx`**: Protects admin-only routes

#### Pages
- **`Login.jsx`**: User login form
- **`Register.jsx`**: User registration form
- **`Dashboard.jsx`**: Sweet catalog with search/purchase
- **`AdminPanel.jsx`**: Inventory management interface

#### Context (State Management)
- **`AuthContext.jsx`**: User auth state, login/logout
- **`SweetContext.jsx`**: Sweet data, CRUD operations

#### Utils
- **`api.js`**: Axios configuration, interceptors, API methods

## Technology Stack by Layer

### Backend
```
Express.js          → Web framework
MongoDB + Mongoose  → Database & ODM
JWT                 → Authentication
bcryptjs            → Password hashing
express-validator   → Input validation
Jest + Supertest    → Testing
```

### Frontend
```
React 18            → UI library
Vite                → Build tool
React Router v6     → Navigation
Context API         → State management
Axios               → HTTP client
CSS3                → Styling
```

### DevOps
```
Git                 → Version control
```

## Data Flow

```
User Action (Frontend)
    ↓
React Component
    ↓
Context API
    ↓
API Utils (Axios)
    ↓
HTTP Request
    ↓
Express Route
    ↓
Auth Middleware (if protected)
    ↓
Controller
    ↓
Mongoose Model
    ↓
MongoDB
    ↓
Response
    ↓
Context Update
    ↓
Component Re-render
```

## Key Design Patterns

1. **MVC Pattern**: Models, Controllers, Routes separation
2. **Context Pattern**: Global state without prop drilling
3. **HOC Pattern**: PrivateRoute, AdminRoute wrappers
4. **Repository Pattern**: Context handles all API calls
5. **Middleware Pattern**: Express middleware chain
6. **Factory Pattern**: Axios instance creation

## File Size Overview

```
Total Files: ~40 files
Backend Tests: 2 files, ~500 lines
Backend Code: ~15 files, ~1500 lines
Frontend Code: ~15 files, ~2000 lines
Documentation: ~8 files, ~1500 lines
Config Files: ~5 files, ~200 lines
```

## Dependencies Count

- **Backend**: ~20 dependencies
- **Frontend**: ~10 dependencies
- **Total Package Size**: ~200MB (with node_modules)
