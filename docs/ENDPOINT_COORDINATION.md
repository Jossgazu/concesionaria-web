# Endpoint Coordination Guide

> Generated: 2026-04-04
> Purpose: Complete mapping of all backend endpoints, their response format, and what the frontend expects.

---

## Authentication Endpoints

### POST /api/v1/auth/register
**Backend Response:**
```json
{
  "success": true,
  "token": "eyJ...",
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "phone": "string",
    "avatar_url": "string",
    "role": "buyer|seller|admin",
    "created_at": "ISO8601"
  }
}
```
**Frontend expects:** `response.data.token`, `response.data.user` ✅ Match

### POST /api/v1/auth/login
**Backend Response:** Same as register
**Frontend expects:** `response.data.token`, `response.data.user` ✅ Match

### GET /api/v1/auth/me
**Protected:** Yes
**Backend Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "phone": "string",
    "avatar_url": "string",
    "role": "string",
    "created_at": "ISO8601"
  }
}
```
**Frontend expects:** `response.data` as User object ⚠️ Mismatch - should use `response.data.user`

---

## Vehicle Endpoints

### GET /api/v1/vehicles
**Query params:** `page`, `limit`, `brand`, `model`, `body_type`, `fuel_type`, `transmission`, `min_price`, `max_price`, `min_year`, `max_year`, `sort_by`, `sort_order`
**Backend Response:**
```json
{
  "success": true,
  "data": [VehicleResponse],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```
**Frontend expects:** `res.data.vehicles || res.data` and `res.data.pagination` ⚠️ Mismatch - backend uses `data` not `vehicles`, `meta` not `pagination`

### GET /api/v1/vehicles/featured
**Backend Response:**
```json
{
  "success": true,
  "data": [VehicleResponse]
}
```
**Frontend expects:** `res.data` direct array ⚠️ Mismatch - should use `res.data.data`

### GET /api/v1/vehicles/:id
**Backend Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "brand": "string",
    "model": "string",
    "year": 2023,
    "price": 28500,
    "currency": "USD",
    "mileage": 15000,
    "body_type": "Sedan",
    "fuel_type": "Gasoline",
    "transmission": "Automatic",
    "color": "Silver",
    "description": "string",
    "status": "active",
    "verified": true,
    "views": 0,
    "images": [{"id": "uuid", "image_url": "string", "is_primary": true}],
    "seller": {"id": "uuid", "name": "string", "avatar_url": "string"},
    "specs": {
      "engine": "string",
      "horsepower": 203,
      "safety_features": ["ABS", "EBD"],
      "comfort_features": ["Apple CarPlay"]
    },
    "created_at": "ISO8601"
  }
}
```
**Frontend expects:** `res.data` direct object ⚠️ Mismatch - should use `res.data.data`

### GET /api/v1/vehicles/my
**Protected:** Yes
**Backend Response:** Same paginated format as GET /vehicles
**Frontend expects:** `response.data` direct array ⚠️ Mismatch - should use `response.data.data`

### POST /api/v1/vehicles
**Protected:** Yes
**Backend Response:**
```json
{
  "success": true,
  "data": VehicleResponse
}
```

### PUT /api/v1/vehicles/:id
**Protected:** Yes (owner only)
**Backend Response:** Same as POST

### DELETE /api/v1/vehicles/:id
**Protected:** Yes (owner only)
**Backend Response:**
```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
```

---

## Dashboard Endpoints

### GET /api/v1/dashboard/stats
**Protected:** Yes
**Backend Response:**
```json
{
  "stats": {
    "TotalVehicles": 0,
    "ActiveVehicles": 0,
    "TotalViews": 0,
    "TotalReviews": 0,
    "AverageRating": 0
  },
  "recent_vehicles": [VehicleResponse]
}
```
**Note:** Go's `encoding/json` lowercases untagged struct fields. The actual JSON keys are:
```json
{
  "stats": {
    "totalvehicles": 0,
    "activevehicles": 0,
    "totalviews": 0,
    "totalreviews": 0,
    "averagerating": 0
  },
  "recent_vehicles": [...]
}
```
**Frontend expects:** `stats.stats?.activevehicles`, `stats.stats?.totalviews`, `stats.recent_vehicles` ✅ Match (after fix)

### GET /api/v1/dashboard/vehicles
**Protected:** Yes
**Backend Response:**
```json
{
  "success": true,
  "data": [VehicleResponse],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "total_pages": 0
  }
}
```

---

## Favorite Endpoints

### GET /api/v1/favorites
**Protected:** Yes
**Backend Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "vehicle_id": "uuid",
      "vehicle": {
        "id": "uuid",
        "brand": "string",
        "model": "string",
        "year": 2023,
        "price": 28500,
        "images": [...],
        "seller": {...}
      },
      "created_at": "ISO8601"
    }
  ]
}
```
**Frontend expects:** `response.data.data` ✅ Match

### POST /api/v1/favorites/:vehicleId
**Protected:** Yes
**Backend Response:**
```json
{
  "success": true,
  "message": "Vehicle added to favorites"
}
```

### DELETE /api/v1/favorites/:vehicleId
**Protected:** Yes
**Backend Response:**
```json
{
  "success": true,
  "message": "Vehicle removed from favorites"
}
```

---

## Message Endpoints

### GET /api/v1/messages
**Protected:** Yes
**Backend Response:**
```json
{
  "data": [
    {
      "user": {
        "id": "uuid",
        "name": "string",
        "email": "string",
        "avatar_url": "string"
      },
      "last_message": {
        "id": "uuid",
        "sender_id": "uuid",
        "content": "string",
        "created_at": "ISO8601"
      },
      "unread_count": 0
    }
  ]
}
```
**Frontend expects:** `response.data.data` ✅ Match
**Frontend uses:** `conv.user?.avatar_url`, `conv.last_message?.content`, `conv.unread_count` ✅ Match

### GET /api/v1/messages/:userId
**Protected:** Yes
**Backend Response:**
```json
{
  "success": true,
  "data": [Message],
  "meta": {"page": 1, "limit": 50, "total": 0, "total_pages": 0}
}
```

### POST /api/v1/messages
**Protected:** Yes
**Request body:** `{ "receiver_id": "uuid", "content": "string", "vehicle_id": "uuid?" }`
**Backend Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "sender_id": "uuid",
    "receiver_id": "uuid",
    "content": "string",
    "created_at": "ISO8601"
  }
}
```

### PUT /api/v1/messages/:id/read
**Protected:** Yes
**Backend Response:**
```json
{
  "success": true,
  "message": "Message marked as read"
}
```

---

## Valuation Endpoints

### GET /api/v1/valuations
**Protected:** Yes
**Backend Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "brand": "string",
      "model": "string",
      "year": 2023,
      "mileage": 15000,
      "condition": "good",
      "estimated_price": 12000.00,
      "status": "pending",
      "notes": "string",
      "created_at": "ISO8601"
    }
  ]
}
```
**Frontend expects:** `response.data.data` ✅ Match
**Frontend uses:** `valuation.estimated_price`, `valuation.created_at`, `valuation.status` ✅ Match

### POST /api/v1/valuations
**Protected:** Yes
**Request body:** `{ "brand", "model", "year", "mileage", "condition", "notes" }`
**Backend Response:**
```json
{
  "success": true,
  "data": Valuation
}
```

---

## Rating Endpoints

### POST /api/v1/ratings
**Protected:** Yes
**Request body:** `{ "target_id": "uuid", "score": 1-5, "comment": "string" }`
**Backend Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "rater_id": "uuid",
    "target_id": "uuid",
    "score": 5,
    "comment": "string",
    "created_at": "ISO8601"
  }
}
```

### GET /api/v1/ratings/user/:userId
**Query params:** `page`, `limit`
**Backend Response:**
```json
{
  "success": true,
  "data": [Rating],
  "meta": {"page": 1, "limit": 20, "total": 0, "total_pages": 0}
}
```

### GET /api/v1/ratings/user/:userId/summary
**Backend Response:**
```json
{
  "success": true,
  "data": {
    "average": 4.5,
    "total": 10,
    "five_star": 5,
    "four_star": 3,
    "three_star": 1,
    "two_star": 1,
    "one_star": 0
  }
}
```

---

## User Endpoints

### GET /api/v1/users/:id
**Backend Response:**
```json
{
  "success": true,
  "profile": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "phone": "string",
    "role": "string",
    "avatar_url": "string",
    "bio": "string",
    "created_at": "ISO8601",
    "stats": {
      "TotalVehicles": 0,
      "ActiveVehicles": 0,
      "TotalViews": 0,
      "TotalReviews": 0,
      "AverageRating": 0
    },
    "rating_summary": {
      "Total": 0,
      "average": 0,
      "five_star": 0,
      "four_star": 0,
      "three_star": 0,
      "two_star": 0,
      "one_star": 0
    }
  }
}
```

### PUT /api/v1/users/profile
**Protected:** Yes
**Request body:** `{ "name": "string", "phone": "string" }`
**Backend Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### POST /api/v1/users/avatar
**Protected:** Yes
**Request:** Multipart form with `avatar` file
**Backend Response:**
```json
{
  "success": true,
  "data": {
    "avatar_url": "/uploads/avatars/filename.jpg"
  }
}
```

---

## Key Response Format Patterns

### Pattern 1: Paginated List
```json
{
  "success": true,
  "data": [...],
  "meta": { "page": 1, "limit": 20, "total": 100, "total_pages": 5 }
}
```
Used by: GET /vehicles, GET /vehicles/my, GET /dashboard/vehicles, GET /messages/:userId, GET /ratings/user/:userId

### Pattern 2: Simple List
```json
{
  "data": [...]
}
```
Used by: GET /favorites, GET /messages, GET /valuations

### Pattern 3: Single Resource
```json
{
  "success": true,
  "data": {...}
}
```
Used by: GET /vehicles/:id, POST /vehicles, PUT /vehicles/:id, POST /valuations, POST /ratings, POST /messages

### Pattern 4: Success with Message
```json
{
  "success": true,
  "message": "Operation completed"
}
```
Used by: DELETE /vehicles/:id, POST /favorites/:id, DELETE /favorites/:id, PUT /messages/:id/read, PUT /users/profile

### Pattern 5: Auth Response
```json
{
  "success": true,
  "token": "eyJ...",
  "user": {...}
}
```
Used by: POST /auth/register, POST /auth/login

### Pattern 6: Dashboard Stats
```json
{
  "stats": { "totalvehicles": 0, ... },
  "recent_vehicles": [...]
}
```
Used by: GET /dashboard/stats

### Pattern 7: User Profile
```json
{
  "success": true,
  "profile": {...}
}
```
Used by: GET /users/:id

---

## Known Mismatches Still To Fix

| # | Endpoint | Issue | Priority |
|---|----------|-------|----------|
| 1 | GET /vehicles | Frontend expects `res.data.vehicles` but backend returns `res.data.data` | HIGH |
| 2 | GET /vehicles/featured | Frontend expects `res.data` but backend returns `res.data.data` | HIGH |
| 3 | GET /vehicles/:id | Frontend expects `res.data` but backend returns `res.data.data` | HIGH |
| 4 | GET /vehicles/my | Frontend expects `res.data` but backend returns `res.data.data` | HIGH |
| 5 | GET /auth/me | Frontend expects `res.data` as User but backend returns `res.data.user` | MEDIUM |
| 6 | Dashboard stats | Go lowercases untagged struct fields (TotalVehicles -> totalvehicles) | FIXED |
