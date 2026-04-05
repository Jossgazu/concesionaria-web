# Concesionaria Web - Master Execution Plan

> **For agentic workers:** This is the MASTER COORDINATION PLAN. Use this to dispatch and coordinate all sub-agents across 5 phases.

**Goal:** Build a production-ready multi-vendor car marketplace for Latin America

**Tech Stack:**
- Backend: Go + Fiber v2 + GORM + PostgreSQL
- Frontend: React 18 + TypeScript + TailwindCSS + Vite
- Database: PostgreSQL 14+ with full-text search
- Design: Stitch (Google Labs) for UI generation
- Infrastructure: Docker + Docker Compose

**Architecture:** API-first REST with JWT authentication, local file storage (S3-ready)

---

## 1. Sub-Agent Responsibilities

### 1.1 Manager Agent
- Coordinates all other agents
- Tracks progress against milestones
- Resolves cross-agent conflicts
- Reports status to user
- **Duties:** Phase orchestration, checkpoint verification, risk monitoring

### 1.2 Backend Agent
- Go Fiber application setup
- All API endpoints (CRUD, auth, file upload)
- Database integration via GORM
- Middleware (auth, CORS, rate limiting, logging)
- Repository and service layers
- **Deliverables:** `backend/` directory with working API

### 1.3 Frontend Agent
- React + TypeScript + Vite project
- TailwindCSS configuration
- All UI pages and components
- State management and routing
- API integration layer
- **Deliverables:** `frontend/` directory with working SPA

### 1.4 Database Agent
- PostgreSQL schema implementation
- Migration files
- Seed data for testing
- Index optimization
- View definitions
- **Deliverables:** `database/` migrations, docker-compose services

### 1.5 Design Agent
- Stitch integration for UI generation
- Design system application
- Screen generation from prompts
- Design token application to components
- **Deliverables:** Generated UI components via Stitch

### 1.6 Web Design Professional
- UI/UX best practices review
- Accessibility audit
- Responsive design verification
- Cross-browser compatibility
- Performance optimization review
- **Duties:** Skill-based review using `web-design-guidelines`

### 1.7 Senior Verifier
- Code quality gate at each phase
- API contract verification
- End-to-end flow testing
- Security audit
- Performance benchmarking
- **Duties:** Quality assurance, defect reporting

---

## 2. Phase Breakdown

### Phase 1: Foundation (Days 1-3)

#### Task 1.1: Project Infrastructure
- [ ] **Backend Agent** - Create project directory structure
- [ ] **Backend Agent** - Initialize Go module with dependencies
- [ ] **Frontend Agent** - Initialize Vite + React + TypeScript project
- [ ] **Frontend Agent** - Configure TailwindCSS with design tokens
- [ ] **Database Agent** - Create docker-compose.yml (PostgreSQL + App)
- [ ] **Database Agent** - Create migration files from schema.sql

**Files:**
- Create: `docker-compose.yml`
- Create: `backend/go.mod`, `backend/go.sum`
- Create: `frontend/package.json`, `frontend/vite.config.ts`
- Create: `frontend/tailwind.config.js`

#### Task 1.2: Backend Scaffolding
- [ ] **Backend Agent** - Create config package
- [ ] **Backend Agent** - Create domain models (User, Vehicle, etc.)
- [ ] **Backend Agent** - Create database connection (postgres.go)
- [ ] **Backend Agent** - Create migrations runner
- [ ] **Backend Agent** - Create middleware (auth, cors, ratelimit, logger)
- [ ] **Backend Agent** - Create route scaffolding

**Files:**
- Create: `backend/cmd/server/main.go`
- Create: `backend/config/config.go`
- Create: `backend/internal/domain/models.go`
- Create: `backend/internal/database/postgres.go`
- Create: `backend/internal/database/migrations.go`
- Create: `backend/internal/middleware/*.go`
- Create: `backend/internal/routes/routes.go`

#### Task 1.3: Design System Setup
- [ ] **Design Agent** - Create Stitch project
- [ ] **Design Agent** - Generate design system (colors, typography, spacing)
- [ ] **Design Agent** - Generate Home Page screen
- [ ] **Design Agent** - Generate Vehicle Browse screen
- [ ] **Design Agent** - Generate Vehicle Detail screen
- [ ] **Web Design Professional** - Review design tokens

**Files:**
- Create: Stitch project (via API)
- Create: `docs/stitch/screens/home-page.md`
- Create: `docs/stitch/screens/browse-page.md`
- Create: `docs/stitch/screens/detail-page.md`

#### Task 1.4: Frontend Scaffolding
- [ ] **Frontend Agent** - Setup routing (React Router)
- [ ] **Frontend Agent** - Create API client layer
- [ ] **Frontend Agent** - Create auth context
- [ ] **Frontend Agent** - Create basic layout components (Header, Footer)
- [ ] **Frontend Agent** - Apply design tokens to Tailwind

**Files:**
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/lib/api.ts`
- Create: `frontend/src/contexts/AuthContext.tsx`
- Create: `frontend/src/components/layout/Header.tsx`
- Create: `frontend/src/components/layout/Footer.tsx`

#### Phase 1 Verification
- [ ] **Senior Verifier** - Backend compiles without errors
- [ ] **Senior Verifier** - Docker Compose starts successfully
- [ ] **Senior Verifier** - Basic API routes respond (200 OK)
- [ ] **Senior Verifier** - Frontend builds without errors
- [ ] **Senior Verifier** - Database migrations run successfully

**Gate:** Phase 1 Complete - Project skeleton working

---

### Phase 2: Core Features (Days 4-7)

#### Task 2.1: Backend Vehicle CRUD
- [ ] **Backend Agent** - Create VehicleRepository
- [ ] **Backend Agent** - Create VehicleService
- [ ] **Backend Agent** - Create VehicleHandler with all endpoints
- [ ] **Backend Agent** - Implement image upload (local storage)
- [ ] **Backend Agent** - Implement vehicle filtering/search

**Files:**
- Create: `backend/internal/repository/vehicle_repository.go`
- Create: `backend/internal/service/vehicle_service.go`
- Create: `backend/internal/handler/vehicle_handler.go`
- Create: `backend/internal/storage/local.go`
- Modify: `backend/internal/routes/routes.go`

#### Task 2.2: Backend User/Auth System
- [ ] **Backend Agent** - Create UserRepository
- [ ] **Backend Agent** - Create AuthService (register, login, JWT)
- [ ] **Backend Agent** - Create AuthHandler
- [ ] **Backend Agent** - Create profile endpoints
- [ ] **Backend Agent** - Implement avatar upload

**Files:**
- Create: `backend/internal/repository/user_repository.go`
- Create: `backend/internal/service/auth_service.go`
- Create: `backend/internal/handler/auth_handler.go`
- Create: `backend/internal/handler/user_handler.go`
- Modify: `backend/internal/middleware/auth.go`

#### Task 2.3: Frontend Home Page
- [ ] **Frontend Agent** - Create Hero section with search
- [ ] **Frontend Agent** - Create Category cards
- [ ] **Frontend Agent** - Create Featured vehicles grid
- [ ] **Frontend Agent** - Create Brand logos section
- [ ] **Frontend Agent** - Create Value props section
- [ ] **Design Agent** - Apply Stitch design to components

**Files:**
- Create: `frontend/src/pages/HomePage.tsx`
- Create: `frontend/src/components/home/HeroSection.tsx`
- Create: `frontend/src/components/home/CategoryGrid.tsx`
- Create: `frontend/src/components/home/FeaturedVehicles.tsx`
- Create: `frontend/src/components/home/BrandLogos.tsx`

#### Task 2.4: Frontend Vehicle Browse
- [ ] **Frontend Agent** - Create VehicleCard component
- [ ] **Frontend Agent** - Create FilterSidebar component
- [ ] **Frontend Agent** - Create vehicle grid/list views
- [ ] **Frontend Agent** - Implement search/filter API integration
- [ ] **Frontend Agent** - Create pagination
- [ ] **Design Agent** - Apply Stitch design to components

**Files:**
- Create: `frontend/src/components/vehicles/VehicleCard.tsx`
- Create: `frontend/src/components/vehicles/FilterSidebar.tsx`
- Create: `frontend/src/components/vehicles/VehicleGrid.tsx`
- Create: `frontend/src/pages/BrowsePage.tsx`

#### Task 2.5: Frontend Vehicle Detail
- [ ] **Frontend Agent** - Create ImageGallery component
- [ ] **Frontend Agent** - Create VehicleInfo section
- [ ] **Frontend Agent** - Create SellerCard component
- [ ] **Frontend Agent** - Create Specs table
- [ ] **Frontend Agent** - Implement vehicle detail API integration
- [ ] **Design Agent** - Apply Stitch design to components

**Files:**
- Create: `frontend/src/components/vehicles/ImageGallery.tsx`
- Create: `frontend/src/components/vehicles/VehicleInfo.tsx`
- Create: `frontend/src/components/vehicles/SellerCard.tsx`
- Create: `frontend/src/pages/VehicleDetailPage.tsx`

#### Task 2.6: Database Views & Indexes
- [ ] **Database Agent** - Verify active_vehicle_listings view
- [ ] **Database Agent** - Verify seller_ratings_summary view
- [ ] **Database Agent** - Create performance indexes
- [ ] **Database Agent** - Add seed data for testing

**Files:**
- Create: `database/seeds/seed_data.sql`
- Modify: `database/schema.sql` (add any missing indexes)

#### Phase 2 Verification
- [ ] **Senior Verifier** - Vehicle CRUD operations work end-to-end
- [ ] **Senior Verifier** - Vehicle search/filter returns correct results
- [ ] **Senior Verifier** - Image upload stores and retrieves files
- [ ] **Senior Verifier** - Home page displays featured vehicles
- [ ] **Senior Verifier** - Browse page filters work correctly
- [ ] **Senior Verifier** - Vehicle detail page loads all data

**Gate:** Phase 2 Complete - Core browsing flow working

---

### Phase 3: User System (Days 8-11)

#### Task 3.1: Backend User Management
- [ ] **Backend Agent** - Implement profile update endpoints
- [ ] **Backend Agent** - Implement password change
- [ ] **Backend Agent** - Implement account deletion
- [ ] **Backend Agent** - Create DTOs for user responses

**Files:**
- Modify: `backend/internal/handler/user_handler.go`
- Modify: `backend/internal/service/user_service.go`
- Create: `backend/internal/dto/response/user.go`

#### Task 3.2: Frontend Auth Pages
- [ ] **Frontend Agent** - Create Login page
- [ ] **Frontend Agent** - Create Register page
- [ ] **Frontend Agent** - Implement form validation
- [ ] **Frontend Agent** - Implement auth API integration
- [ ] **Design Agent** - Apply Stitch design to auth pages

**Files:**
- Create: `frontend/src/pages/LoginPage.tsx`
- Create: `frontend/src/pages/RegisterPage.tsx`
- Create: `frontend/src/components/auth/AuthForms.tsx`

#### Task 3.3: Frontend Profile Pages
- [ ] **Frontend Agent** - Create Profile page
- [ ] **Frontend Agent** - Create Edit Profile form
- [ ] **Frontend Agent** - Create Avatar upload
- [ ] **Frontend Agent** - Create Password change form
- [ ] **Frontend Agent** - Create Dashboard overview
- [ ] **Design Agent** - Apply Stitch design to profile pages

**Files:**
- Create: `frontend/src/pages/ProfilePage.tsx`
- Create: `frontend/src/pages/EditProfilePage.tsx`
- Create: `frontend/src/pages/DashboardPage.tsx`
- Create: `frontend/src/components/profile/ProfileCard.tsx`
- Create: `frontend/src/components/profile/StatsGrid.tsx`

#### Task 3.4: Design System Application
- [ ] **Design Agent** - Apply design tokens to all components
- [ ] **Design Agent** - Generate remaining screens (Sell wizard, Messages)
- [ ] **Web Design Professional** - Review all screens for consistency
- [ ] **Web Design Professional** - Accessibility audit

**Files:**
- Create: `frontend/src/styles/globals.css` (design tokens)
- Create: `docs/stitch/screens/sell-wizard.md`
- Create: `docs/stitch/screens/messages-page.md`

#### Phase 3 Verification
- [ ] **Senior Verifier** - User can register and login
- [ ] **Senior Verifier** - JWT authentication works on protected routes
- [ ] **Senior Verifier** - Profile update persists correctly
- [ ] **Senior Verifier** - Avatar upload displays correctly
- [ ] **Senior Verifier** - Dashboard shows user stats

**Gate:** Phase 3 Complete - User system fully functional

---

### Phase 4: Marketplace Features (Days 12-16)

#### Task 4.1: Backend Valuations
- [ ] **Backend Agent** - Create ValuationRepository
- [ ] **Backend Agent** - Create ValuationService (estimation logic)
- [ ] **Backend Agent** - Create ValuationHandler
- [ ] **Backend Agent** - Implement multi-step valuation wizard API

**Files:**
- Create: `backend/internal/repository/valuation_repository.go`
- Create: `backend/internal/service/valuation_service.go`
- Create: `backend/internal/handler/valuation_handler.go`

#### Task 4.2: Backend Favorites & Ratings
- [ ] **Backend Agent** - Create FavoriteRepository
- [ ] **Backend Agent** - Create RatingRepository
- [ ] **Backend Agent** - Create FavoriteService/Handler
- [ ] **Backend Agent** - Create RatingService/Handler
- [ ] **Backend Agent** - Implement rating aggregation

**Files:**
- Create: `backend/internal/repository/favorite_repository.go`
- Create: `backend/internal/repository/rating_repository.go`
- Create: `backend/internal/service/favorite_service.go`
- Create: `backend/internal/service/rating_service.go`
- Create: `backend/internal/handler/favorite_handler.go`
- Create: `backend/internal/handler/rating_handler.go`

#### Task 4.3: Backend Messages
- [ ] **Backend Agent** - Create MessageRepository
- [ ] **Backend Agent** - Create MessageService
- [ ] **Backend Agent** - Create MessageHandler
- [ ] **Backend Agent** - Implement conversation grouping
- [ ] **Backend Agent** - Implement unread count

**Files:**
- Create: `backend/internal/repository/message_repository.go`
- Create: `backend/internal/service/message_service.go`
- Create: `backend/internal/handler/message_handler.go`

#### Task 4.4: Frontend Valuations
- [ ] **Frontend Agent** - Create ValuationWizard (6-step)
- [ ] **Frontend Agent** - Create vehicle data form (step 1)
- [ ] **Frontend Agent** - Create condition form (step 2)
- [ ] **Frontend Agent** - Create photo upload (step 3)
- [ ] **Frontend Agent** - Create price suggestion display (step 4)
- [ ] **Frontend Agent** - Create contact form (step 5)
- [ ] **Frontend Agent** - Create summary/submit (step 6)
- [ ] **Design Agent** - Apply Stitch design to wizard

**Files:**
- Create: `frontend/src/pages/ValuationWizard.tsx`
- Create: `frontend/src/components/valuation/StepVehicleData.tsx`
- Create: `frontend/src/components/valuation/StepCondition.tsx`
- Create: `frontend/src/components/valuation/StepPhotos.tsx`
- Create: `frontend/src/components/valuation/StepPrice.tsx`
- Create: `frontend/src/components/valuation/StepContact.tsx`
- Create: `frontend/src/components/valuation/StepSummary.tsx`

#### Task 4.5: Frontend Favorites & Ratings
- [ ] **Frontend Agent** - Create Favorites page
- [ ] **Frontend Agent** - Implement favorite toggle (add/remove)
- [ ] **Frontend Agent** - Create Rating component
- [ ] **Frontend Agent** - Create Rating submission form
- [ ] **Frontend Agent** - Display seller ratings on profile
- [ ] **Design Agent** - Apply Stitch design

**Files:**
- Create: `frontend/src/pages/FavoritesPage.tsx`
- Create: `frontend/src/components/vehicles/FavoriteButton.tsx`
- Create: `frontend/src/components/rating/RatingStars.tsx`
- Create: `frontend/src/components/rating/RatingForm.tsx`

#### Task 4.6: Frontend Messages
- [ ] **Frontend Agent** - Create Messages page
- [ ] **Frontend Agent** - Create ConversationList component
- [ ] **Frontend Agent** - Create ChatThread component
- [ ] **Frontend Agent** - Create MessageInput component
- [ ] **Frontend Agent** - Implement real-time message polling
- [ ] **Design Agent** - Apply Stitch design

**Files:**
- Create: `frontend/src/pages/MessagesPage.tsx`
- Create: `frontend/src/components/messages/ConversationList.tsx`
- Create: `frontend/src/components/messages/ChatThread.tsx`
- Create: `frontend/src/components/messages/MessageInput.tsx`

#### Phase 4 Verification
- [ ] **Senior Verifier** - Valuation wizard completes full flow
- [ ] **Senior Verifier** - Favorites add/remove persists
- [ ] **Senior Verifier** - Ratings submit and display correctly
- [ ] **Senior Verifier** - Messages send and receive
- [ ] **Senior Verifier** - Conversation list groups correctly
- [ ] **Senior Verifier** - Unread count updates correctly

**Gate:** Phase 4 Complete - Full marketplace features implemented

---

### Phase 5: Polish (Days 17-20)

#### Task 5.1: Senior Verifier Review
- [ ] **Senior Verifier** - Comprehensive API testing (all endpoints)
- [ ] **Senior Verifier** - Security audit (SQL injection, XSS, CSRF)
- [ ] **Senior Verifier** - Performance benchmarking
- [ ] **Senior Verifier** - Error handling verification
- [ ] **Senior Verifier** - Edge case testing

#### Task 5.2: Web Design Professional Review
- [ ] **Web Design Professional** - Accessibility audit (WCAG 2.1)
- [ ] **Web Design Professional** - Responsive design testing
- [ ] **Web Design Professional** - Cross-browser compatibility
- [ ] **Web Design Professional** - Design consistency check
- [ ] **Web Design Professional** - Performance optimization review

#### Task 5.3: Error Handling Polish
- [ ] **Backend Agent** - Implement global error handler
- [ ] **Backend Agent** - Add consistent error responses
- [ ] **Frontend Agent** - Implement error boundaries
- [ ] **Frontend Agent** - Add toast notifications
- [ ] **Frontend Agent** - Implement loading states

**Files:**
- Modify: `backend/internal/middleware/error_handler.go`
- Create: `frontend/src/components/ui/ErrorBoundary.tsx`
- Create: `frontend/src/components/ui/Toast.tsx`
- Create: `frontend/src/components/ui/LoadingSpinner.tsx`

#### Task 5.4: Responsive Design Polish
- [ ] **Frontend Agent** - Mobile navigation implementation
- [ ] **Frontend Agent** - Tablet layout optimization
- [ ] **Frontend Agent** - Image lazy loading
- [ ] **Frontend Agent** - Touch-friendly interactions

#### Task 5.5: Performance Optimization
- [ ] **Frontend Agent** - Implement React Query for data fetching
- [ ] **Frontend Agent** - Add image optimization
- [ ] **Frontend Agent** - Code splitting by route
- [ ] **Backend Agent** - Add database query optimization
- [ ] **Backend Agent** - Add response caching

#### Task 5.6: Documentation
- [ ] **Manager Agent** - Update README with setup instructions
- [ ] **Manager Agent** - Create API documentation
- [ ] **Manager Agent** - Create deployment guide

**Files:**
- Create: `README.md`
- Create: `docs/api/API.md`
- Create: `docs/DEPLOYMENT.md`

#### Phase 5 Verification
- [ ] **Senior Verifier** - All features work end-to-end
- [ ] **Senior Verifier** - No critical security vulnerabilities
- [ ] **Senior Verifier** - Performance meets benchmarks
- [ ] **Web Design Professional** - Accessibility score > 90
- [ ] **Web Design Professional** - Design passes all checks

**Gate:** Phase 5 Complete - Production Ready

---

## 3. Verification Checkpoints

### Phase Gate Checklist

| Phase | Gate Criteria | Sign-off |
|-------|---------------|----------|
| Phase 1 | Backend compiles, Docker starts, API responds | [ ] Senior Verifier |
| Phase 2 | Vehicle CRUD end-to-end, browsing works | [ ] Senior Verifier |
| Phase 3 | Auth flow complete, profile works | [ ] Senior Verifier |
| Phase 4 | All marketplace features work | [ ] Senior Verifier |
| Phase 5 | Production ready, no critical issues | [ ] Senior Verifier + Web Design Pro |

### Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time (p95) | < 200ms | Load test |
| Frontend Bundle Size | < 500KB gzipped | Build analysis |
| Lighthouse Performance | > 90 | Chrome DevTools |
| Accessibility Score | > 90 | axe-core audit |
| Test Coverage | > 70% | Backend coverage tool |

---

## 4. Dependencies Between Phases

```
Phase 1 (Foundation)
    │
    ├── Backend scaffolding ──────────────────┐
    ├── Frontend scaffolding ─────────────────┤
    ├── Database setup ───────────────────────┤
    └── Design system ────────────────────────┘
           │
           ▼
Phase 2 (Core Features) [DEPENDS ON: Phase 1]
    │
    ├── Backend Vehicle CRUD [DEPENDS ON: Backend scaffolding]
    ├── Backend User/Auth [DEPENDS ON: Backend scaffolding]
    ├── Frontend Home Page [DEPENDS ON: Frontend scaffolding, Design system]
    ├── Frontend Browse [DEPENDS ON: Backend Vehicle CRUD]
    ├── Frontend Detail [DEPENDS ON: Backend Vehicle CRUD]
    └── Database Views [DEPENDS ON: Phase 1 schema]
           │
           ▼
Phase 3 (User System) [DEPENDS ON: Phase 2]
    │
    ├── Backend User Management [DEPENDS ON: Phase 2 Backend User/Auth]
    ├── Frontend Auth Pages [DEPENDS ON: Backend Auth]
    ├── Frontend Profile [DEPENDS ON: Backend User Management]
    └── Design System Application [DEPENDS ON: Phase 2 Design]
           │
           ▼
Phase 4 (Marketplace) [DEPENDS ON: Phase 3]
    │
    ├── Backend Valuations [DEPENDS ON: Phase 2]
    ├── Backend Favorites/Ratings [DEPENDS ON: Phase 3]
    ├── Backend Messages [DEPENDS ON: Phase 3]
    ├── Frontend Valuations [DEPENDS ON: Phase 3]
    ├── Frontend Favorites/Ratings [DEPENDS ON: Phase 3]
    └── Frontend Messages [DEPENDS ON: Phase 3]
           │
           ▼
Phase 5 (Polish) [DEPENDS ON: ALL PREVIOUS]
    │
    ├── Senior Verifier Review
    ├── Web Design Professional Review
    ├── Error Handling Polish
    ├── Responsive Design Polish
    └── Performance Optimization
```

---

## 5. Risk Assessment

### High Priority Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Stitch API rate limits | Medium | High | Cache designs, manual fallback |
| Database performance issues | Low | High | Early indexing, query optimization |
| Frontend state management complexity | Medium | Medium | Use React Query, keep simple |
| Authentication security flaws | Low | Critical | Professional security audit |
| Image upload storage limits | Medium | Medium | Implement S3 migration path |

### Medium Priority Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Go Fiber learning curve | Low | Low | Use existing patterns |
| TailwindCSS customization issues | Low | Low | Follow design system strictly |
| PostgreSQL full-text search complexity | Medium | Medium | Use GORM helpers |
| Real-time messages (polling vs WebSocket) | Medium | Low | Start with polling, upgrade later |

### Low Priority Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Docker environment issues | Low | Low | Clear documentation |
| Cross-browser CSS issues | Medium | Low | Autoprefixer, testing |
| Mobile performance | Medium | Low | Lazy loading, optimization |

---

## 6. Quality Gates

### Gate 1: Phase 1 Completion
```
CRITERIA:
- [ ] go build succeeds without errors
- [ ] docker-compose up -d starts successfully
- [ ] curl http://localhost:3000/health returns 200
- [ ] npm run build succeeds in frontend
- [ ] Database migrations run without errors
- [ ] Basic design tokens applied to Tailwind
```

### Gate 2: Phase 2 Completion
```
CRITERIA:
- [ ] GET /api/vehicles returns vehicle list
- [ ] GET /api/vehicles/:id returns vehicle detail
- [ ] POST /api/vehicles creates vehicle (with auth)
- [ ] Image upload stores file and returns URL
- [ ] Vehicle filters (brand, price, year) work correctly
- [ ] Home page displays featured vehicles
- [ ] Browse page shows filterable vehicle grid
- [ ] Vehicle detail page shows all data
```

### Gate 3: Phase 3 Completion
```
CRITERIA:
- [ ] POST /api/auth/register creates user
- [ ] POST /api/auth/login returns JWT
- [ ] Protected routes require valid JWT
- [ ] GET /api/users/me returns current user
- [ ] PUT /api/users/profile updates profile
- [ ] Login page renders correctly
- [ ] Register page renders correctly
- [ ] Dashboard shows user information
- [ ] Profile page displays correctly
```

### Gate 4: Phase 4 Completion
```
CRITERIA:
- [ ] Valuation wizard completes all 6 steps
- [ ] POST /api/favorites adds favorite
- [ ] DELETE /api/favorites removes favorite
- [ ] POST /api/ratings creates rating
- [ ] GET /api/ratings/:userId returns ratings
- [ ] POST /api/messages sends message
- [ ] GET /api/messages/conversations returns list
- [ ] Favorites page shows saved vehicles
- [ ] Messages page shows conversations
```

### Gate 5: Production Ready
```
CRITERIA:
- [ ] All gates 1-4 passed
- [ ] No critical security vulnerabilities (verified)
- [ ] Lighthouse performance > 90
- [ ] Accessibility score > 90
- [ ] Error handling covers all edge cases
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] README and documentation complete
```

---

## 7. File Deliverables Summary

### Docker & Infrastructure
```
docker-compose.yml          - PostgreSQL + App services
Dockerfile.backend          - Go Fiber container
Dockerfile.frontend         - React build container
nginx.conf                  - Reverse proxy config
```

### Backend (Go Fiber)
```
backend/
├── cmd/server/main.go
├── config/config.go
├── go.mod, go.sum
├── internal/
│   ├── domain/models.go
│   ├── repository/*.go
│   ├── service/*.go
│   ├── handler/*.go
│   ├── middleware/*.go
│   ├── dto/request/*.go
│   ├── dto/response/*.go
│   ├── database/postgres.go
│   └── storage/local.go
├── pkg/
│   ├── response/response.go
│   └── errors/errors.go
└── uploads/{avatars,vehicles}/
```

### Frontend (React + TS + Tailwind)
```
frontend/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── lib/api.ts
│   ├── contexts/AuthContext.tsx
│   ├── components/
│   │   ├── layout/{Header,Footer}.tsx
│   │   ├── home/*.tsx
│   │   ├── vehicles/*.tsx
│   │   ├── auth/*.tsx
│   │   ├── profile/*.tsx
│   │   ├── valuation/*.tsx
│   │   ├── rating/*.tsx
│   │   ├── messages/*.tsx
│   │   └── ui/*.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── BrowsePage.tsx
│   │   ├── VehicleDetailPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── FavoritesPage.tsx
│   │   ├── MessagesPage.tsx
│   │   └── ValuationWizard.tsx
│   └── styles/globals.css
└── public/
```

### Database
```
database/
├── schema.sql              - Full PostgreSQL schema
├── migrations/             - Versioned migration files
│   ├── 001_initial.sql
│   ├── 002_vehicles.sql
│   └── 003_...sql
└── seeds/
    └── seed_data.sql       - Test data
```

### Documentation
```
docs/
├── stitch/
│   ├── design-system.md
│   └── screens/*.md
├── api/
│   └── API.md
└── DEPLOYMENT.md
```

---

## 8. Execution Recommendations

### Recommended Agent Dispatch Order

**Day 1-3 (Phase 1):**
1. Backend Agent → Project setup + scaffolding
2. Frontend Agent → Project setup + scaffolding
3. Database Agent → Docker compose + schema
4. Design Agent → Stitch project setup

**Day 4-7 (Phase 2):**
1. Backend Agent → Vehicle CRUD + Image upload
2. Frontend Agent → Home + Browse + Detail pages
3. Design Agent → Generate browse/detail screens
4. Database Agent → Views + indexes

**Day 8-11 (Phase 3):**
1. Backend Agent → User management + Auth
2. Frontend Agent → Auth pages + Profile + Dashboard
3. Design Agent → Generate auth/profile screens

**Day 12-16 (Phase 4):**
1. Backend Agent → Valuations + Favorites + Ratings + Messages
2. Frontend Agent → Valuation wizard + Favorites + Messages
3. Design Agent → Generate remaining screens

**Day 17-20 (Phase 5):**
1. Senior Verifier → Comprehensive testing
2. Web Design Professional → UX review
3. Backend Agent → Polish + optimization
4. Frontend Agent → Polish + optimization

### Critical Path
```
docker-compose up → backend scaffold → vehicle CRUD → frontend browse → full stack → polish
```

---

**Plan Complete.** Save to: `docs/superpowers/plans/YYYY-MM-DD-concesionaria-web-master-plan.md`
