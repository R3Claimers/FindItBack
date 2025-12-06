# Test Plan

This document provides a comprehensive overview of the backend e2e tests and UI rendering tests, following a structure similar to standard testing documentation. It outlines setup, commands, isolation/mocking, and plain‑English descriptions of all test scenarios.

## Overview

- Scope: Backend API e2e tests using `supertest` and UI rendering tests (JSDOM).
- Scenario types: Happy Path, Input Verification, Branching/Authorization, and Exception Handling.
- Goal: Validate request/response contracts, status codes, and core business rules without relying on real external services.

## Backend Testing

### Setup and Configuration

- Test Framework: Jest
- Location: backend root directory
- Config: `backend/package.json` specifies Jest settings (`backend/package.json:44-49`)
- Environment notes: server listen is disabled in tests (`backend/src/app.js:85-89`).

### Commands

- `npm test` — runs all Jest tests.

### Isolation and Mocking

- Database: mocked to avoid real MongoDB (`tests/*` mock `../backend/src/config/database`).
- Firebase Admin: mocked `verifyIdToken` to simulate auth (`../backend/src/config/firebase`).
- Repositories: mocked `userRepository`, `lostItemRepository`, `foundItemRepository` to provide deterministic data.
- Cloudinary: mocked upload middleware in posting tests.
- Models: `Comment` model mocked for comment CRUD.

## Test Files and Scenarios

### `tests/signup.e2e.test.js` — Account creation

Happy Path
- Create account and fetch profile.

Input Verification
- Invalid email is rejected.

### `tests/login.e2e.test.js` — Authenticated user flows

Happy Path
- Logged‑in user fetches their profile.
- Logged‑in user updates their profile.

Exception Handling
- Profile not found returns 404.
- Expired token returns 401.

### `tests/post-lost.e2e.test.js` — Create lost item

Happy Path
- Create a lost item with valid details.
- Create a lost item including up to 5 images and an optional `imageUrl`.

Input Verification
- Empty category is rejected.
- Missing required fields (title, description, category, dateLost, location) are rejected.
- Title too short (<3) or too long (>100) is rejected.
- Description too short (<10) or too long (>1000) is rejected.
- Upload errors: too many files (>5), file too large (>5MB), unexpected upload field are rejected.

Branching/Authorization
- Unauthenticated requests are rejected (missing/invalid `Authorization` bearer token).

### `tests/post-found.e2e.test.js` — Create found item

Happy Path
- Create a found item with valid details.
- Create a found item including up to 5 images and an optional `imageUrl`.

Input Verification
- Missing required fields (title, description, category, dateFound, location) are rejected.
- Title too short (<3) or too long (>100) is rejected.
- Description too short (<10) or too long (>1000) is rejected.
- Upload errors: too many files (>5), file too large (>5MB), unexpected upload field are rejected.

Branching/Authorization
- Unauthenticated requests are rejected (missing/invalid `Authorization` bearer token).

### `tests/filters.e2e.test.js` — Filtering and pagination

Happy Path
- Show lost items by category and date with pagination.
- Show found items by category and date with pagination.

Input Verification
- Page must start at 1.

### `tests/search.e2e.test.js` — Searching items

Happy Path
- Searching lost items by keyword returns results and pagination.
- Searching found items by keyword returns results and pagination.

Input Verification
- Empty search query is rejected.

Branching/Authorization
- Lost items search requires authentication.

### `tests/Status.e2e.test.js` — Item status updates

Happy Path
- Owner marks a lost item as found.
- Owner reopens a lost item to “open”.
- Owner marks a found item as returned/claimed.
- Owner sets a found item status to “claimed”.

Input Verification
- Reject invalid status values for lost items.
- Reject invalid status values for found items.

Branching/Authorization
- Block non‑owners from changing lost or found item status.

### `tests/comments.e2e.test.js` — Comments lifecycle and permissions

Happy Path
- Add a comment to an item.
- List comments for an item.
- Update own comment.
- Delete own comment.

Branching/Authorization
- Cannot update someone else’s comment.
- Cannot delete someone else’s comment.


## UI Rendering Tests (JSDOM)

- `HomeRender.dom.test.js` — Home page renders expected elements.
- `ItemRender.dom.test.js` — Item component renders with given props.
- `PostRender.dom.test.js` — Post creation UI renders properly.
- `UserProfileRender.dom.test.js` — Profile page renders user fields.
- `theme.dom.test.js` — Theme toggling behaves as expected.

## Execution Notes

- Error responses use consistent JSON shape via `errorHandler` (`backend/src/middlewares/errorHandler.js:1-52`).
- Item model enforces core constraints (category enum, date fields, text search, status enums) (`backend/src/models/Item.js:15-109`).
- Item routes are generated per type via a controller factory with dedicated endpoints (`backend/src/routes/itemRoutes.js:7-53`).