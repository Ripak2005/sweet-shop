# 🧪 Testing Guide

## Run Backend Tests

```bash
cd "d:\Ripak\Main\Projects\Sweet Shop\backend"
npm test
```

## Expected Output

```
PASS  __tests__/sweets/sweets.test.js
PASS  __tests__/auth/auth.test.js

Test Suites: 2 passed, 2 total
Tests:       34 passed, 34 total
Snapshots:   0 total
Time:        ~5s
```

## Test Coverage

```bash
npm run test:coverage
```

Opens detailed HTML report showing:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

## Test Structure

### Auth Tests (10 tests)
```
✅ should register a new user successfully
✅ should register an admin user when role is specified
✅ should fail when email already exists
✅ should fail when required fields are missing
✅ should fail when email format is invalid
✅ should fail when password is too short
✅ should login successfully with correct credentials
✅ should fail with incorrect password
✅ should fail with non-existent email
✅ should fail when email/password is missing
```

### Sweet Tests (24 tests)
```
POST /api/sweets
✅ should create a new sweet as admin
✅ should fail to create sweet as regular user
✅ should fail to create sweet without authentication
✅ should fail when required fields are missing
✅ should fail when sweet name already exists

GET /api/sweets
✅ should get all sweets
✅ should fail without authentication

GET /api/sweets/search
✅ should search sweets by name
✅ should filter sweets by category
✅ should filter sweets by price range
✅ should search with multiple filters

PUT /api/sweets/:id
✅ should update sweet as admin
✅ should fail to update as regular user
✅ should fail with invalid sweet ID

DELETE /api/sweets/:id
✅ should delete sweet as admin
✅ should fail to delete as regular user
✅ should fail with invalid sweet ID

POST /api/sweets/:id/purchase
✅ should purchase sweet and decrease quantity
✅ should fail when purchasing more than available
✅ should fail without authentication

POST /api/sweets/:id/restock
✅ should restock sweet as admin
✅ should fail to restock as regular user
✅ should fail with negative quantity
```

## Watch Mode

Run tests automatically on file changes:
```bash
npm run test:watch
```

## Debug Tests

To debug a specific test:
```bash
npm test -- --testNamePattern="should register a new user"
```

## Common Issues

### MongoDB Memory Server
Tests use in-memory MongoDB, so:
- ✅ No MongoDB installation needed for tests
- ✅ Fast test execution
- ✅ Clean state for each test

### Port Issues
Tests don't start the Express server:
- ✅ No port conflicts
- ✅ Supertest handles HTTP requests

### Async Issues
All tests properly await async operations:
- ✅ No race conditions
- ✅ Proper cleanup with afterEach/afterAll
