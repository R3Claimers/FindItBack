FindItBack – Software Design Commentary

1. How We Improved the Design of the Software

We focused on modularity, scalability, maintainability, and operational robustness while preserving backward compatibility with existing data.

a. Clear, Modular Folder Structure

- Backend: controllers, routes, services, repositories, models, middlewares, utils, config.
- Frontend: pages, components, services, context, utils, assets, config.
  This separation increases cohesion and reuse, and makes ownership and responsibilities explicit.

b. Layered Backend Architecture

- Routes: HTTP endpoint definitions only.
- Controllers: request orchestration and input/output shaping.
- Services: business logic and cross-entity workflows.
- Repositories: data access with Mongoose queries.
- Models: schema definition and validation.
- Middlewares: auth, validation, upload, errors.
  This alignment keeps logic in the right place and reduces coupling.

c. Type-Specific Models via Factory Pattern

We kept separate MongoDB collections for `LostItem` and `FoundItem` to remain compatible with existing data while eliminating code duplication using a factory that generates type-specific schemas. This balances data isolation and code reuse.

d. Consistent API Design

RESTful endpoints with resource-based paths, correct HTTP verbs, and stable status codes. Routes are grouped under a versioned prefix (`/api/v1`) with dedicated routers for users, items, comments, reports, matches, and claims.

e. Robust Auth and Security

Firebase-based authentication on the frontend, verified in the backend via an auth middleware. Security hardening with Helmet, rate limiting, and CORS with explicit allow-list. Sensitive configuration managed via environment variables.

f. Resilient Error Handling

Centralized error handler normalizes API responses. Axios client interceptor attaches auth tokens consistently and applies a lightweight retry/backoff for 429 responses to reduce user friction.

g. Performance and UX

Compression, selective logging, and efficient queries with indices on common access paths. UI powered by reusable components and controlled forms, minimizing re-renders and improving perceived responsiveness.

2. Where We Applied What Design Principles

a. Single Responsibility Principle (SRP)

- Controllers orchestrate requests; services implement business logic; repositories handle persistence; models define schemas; middlewares handle cross-cutting concerns.
- Frontend components each render one concern (e.g., `ItemCard`, `ClaimModal`, `ClaimsSection`).

b. Separation of Concerns

- Clear boundaries between transport (routes/controllers), domain logic (services), and persistence (repositories/models).
- Frontend separates UI, state, and API calls via components, context providers, and services.

c. DRY (Don’t Repeat Yourself)

- Item model factory reduces duplication across lost/found item schemas.
- Shared validation, middleware, and service patterns.
- A single Axios client (`api.jsx`) with token injection and error handling avoids repeated setup.

d. Open/Closed Principle

- Factory-generated item schemas allow extension (new fields, rules per item type) without modifying the consumer code.
- Layered design enables adding new services/routes with minimal changes to existing modules.

e. Dependency Inversion (Pragmatic)

- Controllers depend on services interfaces, not on repositories directly.
- Frontend components consume services via thin, testable API wrappers rather than calling `fetch` inline.

f. Principle of Least Knowledge (Law of Demeter)

- Controllers delegate to services and avoid deep knowledge of data access.
- Components avoid chaining internal details of services and keep rendering concerns local.

g. Fail-Fast and Defensive Programming

- Input validation and authentication middleware reject invalid requests early.
- Repository methods guard against missing entities and unexpected states.

3. Key Refactoring Done to Improve the Design

a. Items Architecture with Factory Pattern

- Replaced duplicated lost/found implementations with a factory-driven `Item` model that produces `LostItem` and `FoundItem` schemas.
- Maintained separate collections for backward compatibility and safer migrations.

b. Layered Refactor of Item Flow

- Consolidated repositories and services to operate across item types via helpers and conventions.
- Controllers created via factories to bind item-type specific behaviors cleanly.

c. Centralized Axios Client and Interceptors

- Moved token handling and content-type defaults to a single Axios instance.
- Added basic retry/backoff for 429, improving UX under rate limits.

d. Cleaned Comments and Kept Design Rationale Only

- Removed noisy JSDoc blocks and retained brief, meaningful design decisions.
- Simplified files and improved readability.

e. Claim System Addition without Breaking Existing Data

- Introduced `Claim` model, routes, controller, and service to support end-to-end claim workflows.
- Implemented owner moderation (approve/reject), auto-rejection of others on approval, and status transitions to “claimed.”

f. Frontend UX Enhancements

- Added `ClaimModal` and `ClaimsSection` for transparent moderation.
- Improved visual affordances (e.g., report/withdraw styling) and added search clear button for usability.

4. Project Structure Overview

Backend

- `src/app.js`: Express app setup, security, CORS, rate limiting, routes, and error handling.
- `src/config`: database and Firebase initialization.
- `src/models`: `User`, `LostItem`, `FoundItem` (via factory), `Comment`, `Report`, `Claim`.
- `src/repositories`: item/user data access with helpers.
- `src/services`: item/match/user business logic; claim workflow.
- `src/controllers`: route handlers, including item controller factories and `claimController`.
- `src/routes`: routers for users, items (lost/found), matches, comments, reports, claims.
- `src/middlewares`: auth, validation, upload, error handler.
- `src/utils`: matching algorithm and helpers.

Frontend

- `src/pages`: main views such as Home, Search, Lost/Found item detail, PostItem, EditPost, Profile.
- `src/components`: UI components including `ItemCard`, `ClaimModal`, `ClaimsSection`, `Comments`, etc.
- `src/services`: API wrappers (`api.jsx`) and feature services (items, claims, reports, auth).
- `src/context`: `AuthContext`, `ThemeContext`, `LoadingContext` for app state.
- `src/utils`: constants, error messages, helpers.
- `public`: manifest and static assets.

5. Architecture and Patterns

- Factory Pattern: Generates item-type-specific schemas and controllers while sharing common logic.
- Repository Pattern: Encapsulates data access logic for clarity and testability.
- Service Layer: Centralizes business rules and workflows across entities.
- Middleware Pipeline: Composable cross-cutting concerns (auth, validation, uploads, errors).
- Versioned API: `/api/v1` namespace keeps evolution stable and predictable.
- Security and Ops: Helmet, CORS allow-list, rate limiting with adaptive thresholds, centralized health endpoint.

6. Operational Considerations

- Environment-driven configuration for secrets and endpoints.
- Health checks and meaningful logs for observability in production.
- Cloud storage (Cloudinary) and uploads served via static middleware.
- MongoDB indices for frequent query paths (status, userId, category, text search).

7. Summary

The current design emphasizes separation of concerns, principled layering, and pragmatic reuse. By combining factories for item models, a clear service/repository split, and consistent frontend service patterns, the codebase is easier to extend and maintain. The claim workflow integrates cleanly without disrupting existing data structures. These choices position the project for reliable growth and smoother operations.
