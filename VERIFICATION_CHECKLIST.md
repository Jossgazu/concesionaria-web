# Concesionaria Web - Senior Verifier Checklist

**Project:** Multi-vendor Car Marketplace  
**Stack:** Go Fiber + React + TypeScript + Tailwind + PostgreSQL  
**Last Updated:** 2026-04-04

---

## Phase Gate Definitions

| Phase | Deliverables |
|-------|--------------|
| **Phase 1** | Project scaffolding, database schema, auth system basics |
| **Phase 2** | Core CRUD (listings, search, details), frontend pages |
| **Phase 3** | User flows (buying, selling, messaging, ratings), advanced features |
| **Phase 4** | Polish, performance optimization, security hardening, deployment |

---

## 1. Code Quality

### 1.1 Clean Architecture

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|-----------------|
| CA-01 | Backend separates handlers/controllers, services, repositories | Critical | Each layer imports only the layer directly below it | `grep -r "import" backend/internal/handlers` | No direct DB calls in handlers |
| CA-02 | Frontend separates pages, components, hooks, types, api | Critical | Feature-based folder structure exists | `ls src/` | Pages, components, hooks, types, api folders present |
| CA-03 | No circular dependencies between packages | High | `go mod tidy` succeeds without errors | `cd backend && go mod tidy` | No dependency cycles reported |
| CA-04 | Environment config externalized (no hardcoded secrets) | Critical | .env.example exists; config loaded via viper/envconfig | `grep -r "password\|secret\|key" backend/` | No hardcoded credentials found |
| CA-05 | Consistent error response structure across API | High | All errors return `{ "error": true, "message": "...", "code": "..." }` | `curl /api/nonexistent` | Consistent JSON error format |

### 1.2 Go Best Practices (Backend)

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| GB-01 | GORM models use `gorm.Model` or explicit ID/created_at/updated_at/deleted_at | Critical | All models have proper timestamps and soft delete if needed | `grep "type.*struct" backend/internal/models/*.go` | Models embed gorm.Model or have all 4 fields |
| GB-02 | Database transactions used for multi-step writes | High | Listing creation + image upload wrapped in transaction | Review code for `db.Transaction()` | No partial state on failure |
| GB-03 | Context passed through all database operations | Critical | `db.WithContext(ctx)` used for cancellation support | `grep "WithContext" backend/internal/` | All DB calls respect context cancellation |
| GB-04 | Fiber routes use proper method routing (Get, Post, Put, Delete) | High | No generic routing; explicit HTTP methods | Review route definitions | Proper REST methods used |
| GB-05 | Middleware chained correctly (auth before handler, cors after logger) | High | Middleware order documented and correct | Review app.go or main.go middleware chain | Correct ordering: Logger → Recovery → CORS → Auth → Routes |

### 1.3 TypeScript/React Best Practices (Frontend)

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| TS-01 | `strict: true` in tsconfig.json | Critical | tsconfig.json contains `"strict": true` | `cat tsconfig.json` | Strict mode enabled |
| TS-02 | No `any` types in codebase (except explicit legacy boundaries) | High | `any` count < 5, all documented | `grep -r ": any" src/` | Minimal `any` usage |
| TS-03 | React components use functional style with hooks | High | No class components | `grep "class.*extends" src/` | No class components found |
| TS-04 | API calls abstracted to dedicated api client/hooks | High | No fetch/axios calls in components directly | `grep -r "fetch\|axios" src/components` | All API calls go through api layer |
| TS-05 | Shared types in centralized types directory | High | Types for API responses, vehicles, users in one place | `ls src/types/` | Core types defined centrally |

### 1.4 Error Handling

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| EH-01 | Backend returns typed errors with proper HTTP codes | Critical | 400 for validation, 401 for auth, 403 for forbidden, 404 for not found, 500 for server errors | `curl -X POST /api/cars -d {}` | Appropriate 4xx/5xx status code |
| EH-02 | Frontend displays user-friendly error messages | High | Toast notifications or inline errors for API failures | Network tab → failed request | User sees "Error listing vehicle" not "Request failed with status 500" |
| EH-03 | Frontend forms show field-level validation errors | High | Server validation errors mapped to form fields | Submit invalid form | Field highlights with specific error |
| EH-04 | Unhandled promise rejections caught | Critical | No console errors from unhandled rejections | `window.addEventListener('unhandledrejection', ...)` | No unhandled rejections in console |

---

## 2. Security

### 2.1 Authentication & Authorization

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| AUTH-01 | JWT secret is minimum 32 characters, loaded from environment | Critical | `len(jwtSecret) >= 32` and not in source code | `grep "JWT_SECRET\|jwtSecret" backend/` | Loaded from env, not hardcoded |
| AUTH-02 | JWT expiration set (access token: 15min-1h, refresh: 7d) | Critical | Tokens include `exp` claim; refresh rotation implemented | Decode JWT from response | `exp` claim present, not eternal |
| AUTH-03 | Passwords hashed with bcrypt (cost >= 10) | Critical | `bcrypt.GenerateFromPassword(password, 10)` or higher | `grep -r "GenerateFromPassword\|bcrypt" backend/` | Cost factor >= 10 |
| AUTH-04 | Protected routes verify JWT before processing | Critical | 401 returned for missing/invalid token | `curl /api/user/profile` (no token) | 401 Unauthorized |
| AUTH-05 | Users can only modify their own resources | Critical | Seller cannot update another seller's listing | Login as User A, try to edit User B's listing | 403 Forbidden |
| AUTH-06 | Role-based access for admin endpoints | High | Admin routes check for admin role | `curl /admin/users` (non-admin token) | 403 Forbidden |

### 2.2 Injection Prevention

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| INJ-01 | All DB queries use GORM parameterized queries (no string interpolation) | Critical | No `db.Raw()` with user input; use `db.Where("field = ?", value)` | `grep -r "Raw\|Exec(" backend/internal/` | All queries use `?` placeholders |
| INJ-02 | React renders user content safely (no dangerouslySetInnerHTML without sanitization) | Critical | No raw HTML injection points | `grep -r "dangerouslySetInnerHTML" src/` | Only used with DOMPurify/sanitizer |
| INJ-03 | File upload filenames sanitized before storage | High | UUID or hash-based filenames; original name not used directly | Review file upload handler | `uuid-v4.jpg` not `my<script>.jpg` |
| INJ-04 | Search input sanitized (no special SQL chars in LIKE queries) | High | GORM escapes LIKE patterns properly | Search with `'; DROP TABLE;--` | No SQL error; returns empty or normal results |

### 2.3 API Security

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| SEC-01 | CORS configured to allow only specific origins | Critical | `AllowOrigins: ["https://concesionaria-web.com"]` or similar | `grep -i "cors" backend/` | Specific domains, not `*` in production |
| SEC-02 | Rate limiting enabled on auth endpoints | Critical | Login/register endpoints have rate limit middleware | `ab -n 100 -c 10 /api/auth/login` | 429 after threshold, 200 for initial requests |
| SEC-03 | Rate limiting on search/listing endpoints | High | General API has reasonable rate limits | Load test search endpoint | Requests throttled after limit |
| SEC-04 | File upload validates MIME type server-side | Critical | Only allow image/jpeg, image/png, image/webp | Upload `.exe` file | 400 Bad Request |
| SEC-05 | File upload size limited (max 5-10MB per image) | Critical | Max file size check in handler | Upload 20MB file | 413 Payload Too Large |
| SEC-06 | HTTPS enforced in production | High | Redirect HTTP to HTTPS, HSTS header set | `curl http://api.concesionaria-web.com` | 301 redirect to HTTPS |

---

## 3. API Design

### 3.1 RESTful Conventions

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| REST-01 | Resource naming: `/api/v1/cars` not `/api/getCars` | Critical | All endpoints follow noun-based naming | `grep -E "Get|Post|Put|Delete.* /" backend/` | RESTful path structure |
| REST-02 | Versioning: `/api/v1/` prefix on all endpoints | High | No unversioned endpoints in production | All API routes start with `/api/v1/` | API versioning in place |
| REST-03 | Nested resources where appropriate: `/api/v1/cars/{id}/images` | High | Images endpoint nested under cars | `GET /api/v1/cars/123/images` | Returns images for car 123 |
| REST-04 | Actions as resources: `/api/v1/cars/{id}/favorite` | Medium | POST to /favorite toggles, not separate endpoint | Review favorite implementation | Proper REST action mapping |

### 3.2 Response Format

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| RESP-01 | Consistent success response: `{ "data": ..., "meta": {...} }` | Critical | All endpoints return same top-level structure | `curl /api/v1/cars` | JSON has consistent `data` wrapper |
| RESP-02 | Pagination metadata in meta: `{ "total", "page", "limit", "totalPages" }` | Critical | List endpoints include pagination info | `curl /api/v1/cars?page=1&limit=10` | `meta.total`, `meta.page` present |
| RESP-03 | Error responses: `{ "error": true, "message": "...", "code": "ERR_CODE" }` | Critical | All errors follow error envelope | `curl /api/v1/cars/99999` | Consistent error format |
| RESP-04 | Timestamps in ISO 8601 format (`2026-04-04T10:30:00Z`) | High | All datetime fields use RFC3339 | API response dates | ISO 8601 formatted |

### 3.3 HTTP Status Codes

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| HTTP-01 | 200 OK for successful GET, PUT, PATCH | Critical | Standard successful requests | `curl -s -o /dev/null -w "%{http_code}" /api/v1/cars` | 200 |
| HTTP-02 | 201 Created for new resources | Critical | POST creating resource returns 201 | `curl -X POST /api/v1/cars -d {...}` | 201 |
| HTTP-03 | 204 No Content for DELETE | High | Successful delete returns 204 | `curl -X DELETE /api/v1/cars/123` | 204 |
| HTTP-04 | 400 Bad Request for validation errors | Critical | Invalid input returns 400 | `curl -X POST /api/v1/cars -d '{"price": "abc"}'` | 400 |
| HTTP-05 | 401 Unauthorized for missing/invalid auth | Critical | No token returns 401 | `curl /api/v1/user/profile` | 401 |
| HTTP-06 | 403 Forbidden for unauthorized actions | Critical | Authenticated but not allowed | Edit another user's listing | 403 |
| HTTP-07 | 404 Not Found for missing resources | Critical | Non-existent ID returns 404 | `curl /api/v1/cars/999999` | 404 |
| HTTP-08 | 422 Unprocessable Entity for semantic validation | High | Valid format but fails business rules | Duplicate email registration | 422 |
| HTTP-09 | 429 Too Many Requests when rate limited | High | Exceed rate limit | Multiple rapid requests | 429 |

### 3.4 Query Parameter Validation

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| QPV-01 | Pagination params validated (page >= 1, limit 1-100) | High | Invalid pagination returns 400 | `?page=-1&limit=500` | 400 Bad Request |
| QPV-02 | Sort params whitelist validated | High | Only allowed sort fields accepted | `?sort=price&order=asc` ✓, `?sort=unknown` → 400 | Invalid sort field 400 |
| QPV-03 | Filter params sanitized | High | SQL injection in filters rejected | `?brand=<script>` | 400 or sanitized |
| QPV-04 | Default values applied for optional params | Medium | Missing pagination uses defaults | No `?page=` param | page=1, limit=20 applied |

---

## 4. Database

### 4.1 Schema & Constraints

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| DB-01 | Vehicles table has foreign key to users (seller_id) | Critical | `seller_id` references `users(id)` | `\d vehicles` in psql | FK constraint exists |
| DB-02 | Listings table has foreign key to vehicles | Critical | `vehicle_id` references `vehicles(id)` | Check migration/schema | FK exists |
| DB-03 | Messages table has FKs to sender and receiver users | High | Both sender_id and receiver_id reference users(id) | Check schema | Dual FK constraints |
| DB-04 | Required fields marked NOT NULL | Critical | All required columns have NOT NULL constraint | Check migration | No NULL for critical fields |
| DB-05 | Email column has unique constraint | Critical | `UNIQUE` constraint on users.email | Attempt duplicate email | DB error on second insert |
| DB-06 | Soft deletes use `deleted_at` TIMESTAMP (not BOOLEAN) | High | Soft delete pattern via gorm.deleted_at | Delete then query | Record hidden but present |

### 4.2 Indexes

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| IDX-01 | Index on vehicles.brand, vehicles.model for search | Critical | Composite index or separate indexes | `\d vehicles` | Indexes present |
| IDX-02 | Index on vehicles.price for price range queries | Critical | Index on price column | Explain analyze query | Index used |
| IDX-03 | Index on listings.status for active listings filter | High | Index on status column | Query filtered by status | Index scan |
| IDX-04 | Full-text search index on vehicle titles/descriptions | High | GIN or GiST index for search | `CREATE INDEX ... USING gin(...)` | Search uses index |
| IDX-05 | Index on messages.conversation_id for chat threads | High | Index for message thread retrieval | Check messages table indexes | Index exists |
| IDX-06 | No missing indexes on foreign keys | High | All FK columns indexed | `\d vehicles` | seller_id indexed |

### 4.3 Query Optimization

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| QO-01 | No N+1 queries in listings (preload associations) | Critical | `Preload("Images"), Preload("Seller")` on list queries | Enable GORM logging, count queries | Single query or fixed N+1 |
| QO-02 | Connection pooling configured (max 25-100 connections) | Critical | `SetMaxOpenConns(25)`, `SetMaxIdleConns(10)` | Check DB config | Pool configured |
| QO-03 | Expensive COUNT queries optimized for pagination | High | Use estimated counts or cursor pagination for large tables | Explain count query | Sub-second count |
| QO-04 | Select only needed columns in queries | Medium | `Select("id", "title", "price")` not `Select("*")` | Review query projection | Minimal column selection |

---

## 5. Frontend

### 5.1 Responsiveness

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| FR-01 | Mobile-first CSS (base styles for mobile, media queries for desktop) | Critical | Tailwind classes: `grid-cols-1 md:grid-cols-3` pattern | Resize to 375px width | Single column, usable |
| FR-02 | Breakpoints: sm(640), md(768), lg(1024), xl(1280) | High | Responsive utility classes used | Test at all breakpoints | Proper scaling |
| FR-03 | Images responsive: srcset or Tailwind responsive classes | High | `srcset` or `w-full h-auto` | Check image tags | Images scale properly |
| FR-04 | Touch targets minimum 44x44px on mobile | Medium | Buttons, links have adequate tap targets | Touch testing | No cramped buttons |
| FR-05 | No horizontal scroll on mobile | Critical | Content fits viewport width | Test on iPhone/Android | No horizontal scrollbar |

### 5.2 State Management

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| SM-01 | Loading states for all async operations | Critical | Spinner/skeleton shown during data fetch | Throttle network, load cars | Loading indicator visible |
| SM-02 | Error states with retry options | Critical | Error message + retry button on failure | Disconnect network, load | Error UI with retry |
| SM-03 | Empty states for no-data scenarios | High | "No cars found" message with action | Search for non-existent | Helpful empty state |
| SM-04 | Optimistic UI for favorites toggle | High | Immediate UI update, rollback on error | Click favorite | Instant visual feedback |
| SM-05 | Form state preserved on validation error | High | Typed values remain after submit failure | Submit invalid form | Data not lost |

### 5.3 Form Validation

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| FV-01 | Required field validation | Critical | Submit empty required field | Leave required empty | Error message shown |
| FV-02 | Email format validation | Critical | Invalid email rejected | Enter "notanemail" | Email format error |
| FV-03 | Price/number range validation | High | Negative price rejected, min/max enforced | Enter price: -100 | Validation error |
| FV-04 | File type validation on upload | Critical | Non-image file rejected | Upload .pdf | Error message |
| FV-05 | Real-time validation feedback | Medium | Errors shown on blur or change | Type invalid, then correct | Immediate feedback |
| FV-06 | Form submission disabled while submitting | High | Button disabled, shows spinner | Submit valid form | No double submit |

### 5.4 Image Handling

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| IMG-01 | Lazy loading for below-fold images | Critical | `loading="lazy"` or IntersectionObserver | Scroll down page | Off-screen images load on approach |
| IMG-02 | Image placeholders (skeleton/blur) while loading | High | Skeleton shown before image loads | Throttle network | No layout shift |
| IMG-03 | Thumbnail generation for listing grids | High | Grid images are resized | Check network tab | Small thumbnails for grid |
| IMG-04 | Full-size image on detail page | High | Detail page shows full resolution | Click car → detail | High-res images |
| IMG-05 | Alt text on all images | High | Accessibility: descriptive alt | `grep -r "alt=" src/` | All images have alt |

---

## 6. Design (Stitch Integration)

### 6.1 Design System Compliance

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| DS-01 | Primary color from design system applied | Critical | Brand color consistent across site | Visual inspection | Consistent primary color |
| DS-02 | Typography scale matches design tokens | Critical | Heading sizes: h1=32px+, h2=24px+, body=16px | Inspect text elements | Matches spec |
| DS-03 | Spacing uses design system scale (4px base unit) | High | Margins/padding in 4px increments | Inspect elements | Consistent spacing |
| DS-04 | Border radius follows design system (sm/md/lg) | High | Cards, buttons use correct radius | Visual check | Consistent radius |
| DS-05 | Shadows match design system elevation levels | Medium | Card shadows follow spec | Inspect cards | Correct shadow depth |
| DS-06 | Buttons have consistent states (hover, active, disabled) | High | All buttons have state variations | Hover/click buttons | Visual feedback |

### 6.2 Spanish Localization

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| ES-01 | All UI labels in Spanish | Critical | No English labels visible | Visual inspection | 100% Spanish labels |
| ES-02 | Spanish date/number formats | High | Dates: DD/MM/YYYY, Numbers: 1.234,56 | Check formatting | Locale-correct |
| ES-03 | Error messages in Spanish | Critical | "Campo requerido", "Formato inválido" | Trigger error | Spanish error |
| ES-04 | Button labels Spanish: "Buscar", "Vender", "Contactar" | Critical | Spanish action labels | Visual check | Spanish buttons |
| ES-05 | Vehicle-related terms in Spanish | High | "Kilometraje", "Combustible", "Transmisión" | Check car detail page | Correct Spanish terms |

### 6.3 Automotive Marketplace Feel

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| AM-01 | Hero section with high-quality car imagery | High | Visual impact on homepage | Visit homepage | Professional automotive feel |
| AM-02 | Vehicle cards show key info: price, year, km, location | Critical | Card displays essential vehicle data | Browse listings | Relevant info visible |
| AM-03 | Search filters relevant to cars (brand, model, year, price) | Critical | Filters match car search needs | Test search | Car-specific filters |
| AM-04 | Professional, trustworthy visual design | High | Not generic; automotive-specific branding | Overall impression | Premium marketplace feel |
| AM-05 | Clear call-to-action buttons | High | "Ver Detalles", "Contactar Vendedor" prominent | Visual check | Clear CTAs |

---

## 7. Performance

### 7.1 Bundle & Loading

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| P-01 | Initial bundle < 200KB gzipped | Critical | `npm run build` → check bundle | `npx bundlesize` or analyze | < 200KB |
| P-02 | No duplicate dependencies in bundle | High | Bundler dedupes correctly | `npm run build -- --analyze` | No duplicates |
| P-03 | Code splitting on routes | Critical | Each page loads independently | Network tab on navigation | Route-based chunks |
| P-04 | Lazy load below-fold components | High | `React.lazy()` for heavy components | Check initial load | Smaller initial bundle |
| P-05 | External libraries tree-shaken | Medium | Only used exports included | Bundle analyzer | Minimal unused code |

### 7.2 React Performance

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| RP-01 | `useMemo` for expensive computations | High | Filter/search results memoized | Profile with React DevTools | No unnecessary recalc |
| RP-02 | `useCallback` for event handlers passed to children | High | Stable references for child components | Profile | Reduced re-renders |
| RP-03 | `React.memo` on list item components | High | CarCard etc. wrapped in memo | Scroll car list | Only changed items re-render |
| RP-04 | Virtualization for long lists (>50 items) | High | Windowing for car grids | Render 100 cars | Smooth 60fps scroll |
| RP-05 | No inline object/array literals in JSX props | High | Objects defined outside render | Code review | Stable prop references |

### 7.3 Backend Performance

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| BP-01 | Response time < 200ms for list endpoints | Critical | Benchmark list API | `time curl /api/v1/cars` | < 200ms |
| BP-02 | Response time < 100ms for single resource | Critical | Benchmark detail API | `time curl /api/v1/cars/123` | < 100ms |
| BP-03 | Search response < 500ms for complex queries | High | Full-text search with filters | `time curl "/api/v1/cars?search=volkswagen&brand=123"` | < 500ms |
| BP-04 | Image upload processing async or streaming | Medium | Upload doesn't block main thread | Large file upload | Non-blocking |
| BP-05 | Caching headers on static assets | High | Cache-Control: max-age=31536000 | `curl -I static/js/app.js` | Cache header set |

---

## 8. User Flows

### 8.1 Buyer Flows

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| BF-01 | Browse listings without auth | Critical | Homepage loads public listings | Visit without login | See car listings |
| BF-02 | Search with filters (brand, model, price, year) | Critical | Filters narrow results correctly | Apply multiple filters | Correct filtered results |
| BF-03 | View car detail page | Critical | Full details, images, seller info displayed | Click listing | Detail page with all info |
| BF-04 | Favorite a listing (requires auth) | Critical | Can add/remove favorites when logged in | Click heart icon | Toggle favorite state |
| BF-05 | Message seller (requires auth) | Critical | Can send message; appears in seller's inbox | Send message | Message delivered |
| BF-06 | View favorite listings | High | Favorites page shows saved cars | Visit favorites | List of favorited cars |
| BF-07 | View message history | High | Chat thread with seller visible | Open conversation | Message history shown |

### 8.2 Seller Flows

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| SF-01 | Register as seller (or upgrade existing user) | Critical | Can access seller dashboard | Login/register | Seller dashboard accessible |
| SF-02 | Create vehicle listing with all fields | Critical | All form fields work; listing created | Submit new listing form | Listing appears on site |
| SF-03 | Upload multiple photos (up to 10) | Critical | Can upload 1-10 images per listing | Add photos to listing | Photos stored and displayed |
| SF-04 | Edit own listing | Critical | Can modify own vehicle details | Edit own listing | Changes saved |
| SF-05 | Delete own listing (soft delete) | Critical | Listing removed from public view | Delete listing | Listing hidden (soft deleted) |
| SF-06 | View incoming messages | Critical | Messages from buyers visible | Check inbox | Buyer messages shown |
| SF-07 | View vehicle valuations/estimates | High | Pricing estimate shown on create/edit | Navigate to valuation | Estimate displayed |
| SF-08 | Manage inventory (view all own listings) | High | Dashboard shows all seller's cars | Visit dashboard | Full inventory listed |

### 8.3 Rating System

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| RS-01 | Buyer can rate seller after transaction | High | Rating form available post-purchase | Complete transaction → rate | Rating submitted |
| RS-02 | Rating displays on seller profile | Critical | Average rating visible | View seller profile | Stars + rating shown |
| RS-03 | Cannot rate same transaction twice | Critical | Duplicate rating prevented | Attempt double rating | Second attempt rejected |
| RS-04 | Seller can respond to rating | Medium | Response form available | Respond to rating | Response saved |

### 8.4 Authentication Flows

| ID | Check Item | Priority | Pass Criteria | Test Command | Expected Outcome |
|----|-----------|----------|---------------|--------------|------------------|
| AF-01 | User registration with email verification | Critical | Verification email sent; account activated | Register new account | Verification email received |
| AF-02 | User login with email/password | Critical | Valid credentials grant JWT | Login with valid creds | JWT token returned |
| AF-03 | Protected routes redirect to login | Critical | Unauthenticated access redirects | Access /dashboard without login | Redirect to /login |
| AF-04 | User logout invalidates token | High | Token blacklisted or cleared client-side | Logout → use old token | 401 Unauthorized |
| AF-05 | Password change flow | High | Old password verified, new hashed | Change password | Password updated |
| AF-06 | Password reset (forgot password) | High | Email with reset link; token valid | Request reset | Reset email sent, token works |
| AF-07 | Session persists across page refresh | High | JWT stored, used on reload | Reload page | Remain logged in |

---

## Phase-Gate Specific Checks

### Phase 1 Gate: Foundation (Project Scaffolding + Database + Auth)

**Must Pass (Critical Items):**
- [ ] CA-01, CA-04 (Architecture & Config)
- [ ] GB-01, GB-03 (GORM Best Practices)
- [ ] TS-01 (TypeScript Strict)
- [ ] AUTH-01, AUTH-02, AUTH-03 (Auth Security)
- [ ] INJ-01 (SQL Injection Prevention)
- [ ] SEC-01, SEC-04, SEC-05 (API Security)
- [ ] REST-01, REST-02, RESP-01, RESP-03 (API Design)
- [ ] HTTP-01, HTTP-02, HTTP-04, HTTP-05, HTTP-07 (Status Codes)
- [ ] DB-01, DB-02, DB-04, DB-05 (Schema)
- [ ] BF-01 (Browse without auth)
- [ ] AF-01, AF-02, AF-03, AF-07 (Auth flows)

**Gate Criteria:** All Critical items must be PASS. High items recommended to PASS.

**Phase 1 Testing Commands:**
```bash
# Backend
cd backend && go build ./... && go test ./... -v
# Frontend  
cd frontend && npm run build && npm run lint
# Database
psql -c "\d vehicles" -d concessions_db
# Auth flow
curl -X POST http://localhost:3000/api/v1/auth/register -d '{"email":"test@test.com","password":"Test123!","name":"Test"}'
curl -X POST http://localhost:3000/api/v1/auth/login -d '{"email":"test@test.com","password":"Test123!"}'
```

---

### Phase 2 Gate: Core Features (CRUD + Search + Frontend Pages)

**Must Pass (Critical Items):**
- [ ] All Phase 1 Critical items remain passing
- [ ] CA-02, CA-05 (Architecture)
- [ ] GB-02, GB-04, GB-05 (Go Practices)
- [ ] TS-02, TS-03, TS-04, TS-05 (TypeScript)
- [ ] EH-01, EH-02, EH-03, EH-04 (Error Handling)
- [ ] AUTH-04, AUTH-05 (Authorization)
- [ ] REST-03, REST-04 (REST Conventions)
- [ ] RESP-02, RESP-04 (Response Format)
- [ ] HTTP-03, HTTP-06, HTTP-08, HTTP-09 (Status Codes)
- [ ] QPV-01, QPV-02, QPV-03, QPV-04 (Query Validation)
- [ ] DB-03, DB-06 (Schema)
- [ ] IDX-01, IDX-02, IDX-06 (Indexes)
- [ ] QO-01, QO-02 (Query Optimization)
- [ ] FR-01, FR-02, FR-05 (Responsiveness)
- [ ] SM-01, SM-02, SM-03 (State Management)
- [ ] FV-01, FV-02, FV-03, FV-04 (Form Validation)
- [ ] IMG-01, IMG-02, IMG-05 (Images)
- [ ] BF-01, BF-02, BF-03 (Buyer Browse)
- [ ] SF-01, SF-02, SF-03 (Seller Create)
- [ ] AF-04, AF-05 (Auth)

**Gate Criteria:** All Critical items must be PASS. High items strongly recommended.

**Phase 2 Testing Commands:**
```bash
# Full backend test suite
cd backend && go test ./... -v -cover

# Full frontend build
cd frontend && npm run build && npm run type-check

# Functional tests
curl http://localhost:3000/api/v1/cars  # List with pagination
curl http://localhost:3000/api/v1/cars?brand=1&price_min=5000&price_max=20000  # Filtered search
curl http://localhost:3000/api/v1/cars/1  # Detail
curl -X POST http://localhost:3000/api/v1/cars -H "Authorization: Bearer $TOKEN" -d '{...}'  # Create

# Frontend E2E (Playwright)
cd frontend && npx playwright test
```

---

### Phase 3 Gate: Full User Flows

**Must Pass (Critical Items):**
- [ ] All Phase 2 Critical items remain passing
- [ ] INJ-02, INJ-03, INJ-04 (Injection Prevention)
- [ ] SEC-02, SEC-03, SEC-06 (Rate Limiting & HTTPS)
- [ ] IDX-03, IDX-04, IDX-05 (Search Indexes)
- [ ] QO-03, QO-04 (Query Optimization)
- [ ] SM-04, SM-05 (Optimistic UI)
- [ ] FV-05, FV-06 (Advanced Validation)
- [ ] DS-01, DS-02, DS-03, DS-04, DS-05 (Design System)
- [ ] ES-01, ES-02, ES-03, ES-04, ES-05 (Spanish Localization)
- [ ] AM-01, AM-02, AM-03, AM-04, AM-05 (Automotive Feel)
- [ ] BF-04, BF-05, BF-06, BF-07 (Full Buyer Flows)
- [ ] SF-04, SF-05, SF-06, SF-07, SF-08 (Full Seller Flows)
- [ ] RS-01, RS-02, RS-03, RS-04 (Rating System)
- [ ] AF-06 (Password Reset)

**Gate Criteria:** All Critical items must PASS. High items should be mostly passing.

**Phase 3 Testing Commands:**
```bash
# Security audit
cd backend && go run golang.org/x/vuln/cmd/govulncheck@latest ./...
cd frontend && npm audit

# Load test
k6 run tests/load.js

# Full E2E
npx playwright test --project=e2e

# Message flow
curl -X POST http://localhost:3000/api/v1/messages -H "Authorization: Bearer $BUYER_TOKEN" -d '{"seller_id":2,"car_id":1,"content":"Interested!"}'
curl http://localhost:3000/api/v1/messages -H "Authorization: Bearer $SELLER_TOKEN"

# Rating flow
curl -X POST http://localhost:3000/api/v1/ratings -H "Authorization: Bearer $BUYER_TOKEN" -d '{"seller_id":2,"transaction_id":1,"score":5,"comment":"Great seller!"}'
```

---

### Phase 4 Gate: Production Readiness

**Must Pass (All Critical + All High items):**

| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Code Quality | 100% | 90% | 80% | 70% |
| Security | 100% | 100% | 90% | - |
| API Design | 100% | 100% | 90% | 80% |
| Database | 100% | 95% | 85% | 70% |
| Frontend | 100% | 95% | 85% | 70% |
| Design | 100% | 90% | 80% | 70% |
| Performance | 100% | 95% | 85% | 70% |
| User Flows | 100% | 100% | 95% | 85% |

**Gate Criteria:** All Critical items MUST PASS (100%). High items must meet threshold above.

**Phase 4 Final Verification Commands:**
```bash
# Build verification
cd backend && go build -o consegionaria-web . && ./concesionaria-web version
cd frontend && npm run build && npm run type-check && npm run lint

# Security
cd backend && go run golang.org/x/vuln/cmd/govulncheck@latest ./...
nmap -sV --script vuln localhost:3000  # Basic vuln scan
owasp-zap-baseline.py -url http://localhost:3000  # OWASP check

# Performance
pagespeedInsights https://concesionaria-web.com  # Lighthouse CI
k6 run tests/load.js --vus=50 --duration=60s  # 50 concurrent users, 60s

# Accessibility
axe http://localhost:3000  # Accessibility audit
lighthouse http://localhost:3000 --output=json  # Full audit

# Database
psql -c "SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;"  # Unused indexes
psql -c "SELECT pg_size_pretty(pg_total_relation_size('vehicles'));"  # Table size

# E2E Smoke Test
npx playwright test --project=smoke
```

---

## Verification Summary Template

```
PROJECT: Concesionaria Web
PHASE GATE: [Phase 1/2/3/4]
VERIFIER: [Senior Verifier Name]
DATE: [YYYY-MM-DD]

CRITICAL ITEMS: X/Y PASSED
HIGH ITEMS: X/Y PASSED
MEDIUM ITEMS: X/Y PASSED
LOW ITEMS: X/Y PASSED

GATE STATUS: [APPROVED / REJECTED / CONDITIONAL]

BLOCKERS (if any):
1. [Issue description - Priority - Category]

RECOMMENDATIONS:
1. [Improvement suggestion - Priority]

FINAL NOTES:
[Additional observations]
```

---

## Appendix: Quick Reference Commands

```bash
# Backend
cd backend
go build ./...
go test ./... -v -cover
go mod tidy
golangci-lint run
go run golang.org/x/vuln/cmd/govulncheck@latest ./...

# Frontend
cd frontend
npm run build
npm run lint
npm run type-check
npm audit
npx playwright test

# Database
psql -d concessions_db
\d vehicles
\d users  
\d listings
SELECT * FROM pg_indexes WHERE tablename = 'vehicles';

# API Testing
curl -v http://localhost:3000/api/v1/cars
curl -X POST http://localhost:3000/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password"}'
```
