# Voyagent — AI Travel Planning & Hotel Booking Platform

A full-stack AI travel planner: users describe a trip (destination, dates,
travelers, budget, preferences), an AI Travel Agent generates a
budget-aware, day-by-day itinerary, and users can search and book hotels.

## Status

This is a **working MVP scaffold**, not the full 34-feature spec.

**Implemented and verified (builds/type-checks clean):**
- Backend: Express + TypeScript + Prisma (PostgreSQL), JWT auth, Zod
  validation everywhere, helmet/CORS/rate-limiting, global error handler
- AI Travel Agent (`backend/src/agents/travelAgent.ts`): real OpenAI
  structured-JSON call with retry + timeout, budget math, over-budget
  detection, and a labeled mock fallback so the app runs with zero API keys
- Hotel / Weather / Payment **adapters**: same pattern everywhere — a real
  integration point is stubbed in, and mock data is used (flagged
  `isMockData: true` in every response) until you add a real key. Nothing
  ever presents mock data as real.
- Database schema for all 8 models (User, Trip, Hotel, Room, Booking,
  Payment, Favorite, Review)
- REST API: auth, users, AI planning, trips, hotel search/details,
  bookings, payments (create-order/verify with server-side signature check)
- Frontend: Vite + React + TypeScript + Tailwind, React Router, Zustand,
  Axios. Pages: landing page, 7-step trip planner wizard, results
  dashboard (budget pie chart + live budget-optimization slider +
  itinerary), hotel search, login/register, my trips.

**Not yet built** (natural next phases):
- Real Razorpay integration (adapter interface is ready — see
  `paymentAdapter.ts` — implementation is stubbed)
- Real Google Maps/Places integration and itinerary map
- Admin dashboard, email sending, automated tests, SEO metadata,
  hotel booking flow UI (guest form → payment → confirmation page),
  saved-trip edit/detail views

## Tech stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS v4, React Router,
  Zustand, Axios, Recharts, Lucide icons
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, Zod, JWT, bcryptjs
- **Database**: PostgreSQL (Neon / Supabase / Railway all work)
- **AI**: OpenAI (`gpt-4o-mini`, structured JSON output)

## Project structure

```
travel-ai/
├── backend/
│   ├── src/
│   │   ├── agents/travelAgent.ts       ← AI Travel Agent
│   │   ├── services/adapters/          ← hotel/weather/payment adapters
│   │   ├── controllers/ routes/ services/ middleware/ validators/
│   │   └── server.ts
│   ├── prisma/schema.prisma
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/  components/  layouts/  store/  services/  types/
│   │   └── App.tsx
│   └── .env.example
└── README.md
```

## Setup

### 1. Database

Create a PostgreSQL database (e.g. a free [Neon](https://neon.tech) or
[Supabase](https://supabase.com) instance) and copy its connection string.

### 2. Backend

```bash
cd backend
cp .env.example .env
# edit .env — at minimum set DATABASE_URL and JWT_SECRET
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Backend runs on `http://localhost:4000`. Health check:
`GET http://localhost:4000/api/health`.

Without `OPENAI_API_KEY` / `HOTEL_API_KEY` / `WEATHER_API_KEY` /
`RAZORPAY_KEY_ID`+`SECRET` set, the app still runs fully end-to-end using
mock adapters — every mock response includes `isMockData: true`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Environment variables

See `backend/.env.example` and `frontend/.env.example` for the full list.
Never commit a real `.env` file — only `.env.example` files are checked in.

## Deployment

- **Frontend** → Vercel (`vite build`, output dir `dist`)
- **Backend** → Railway or Render (`npm run build && npm start`; run
  `npx prisma migrate deploy` as a release step)
- **Database** → Neon / Supabase / Railway Postgres

## API overview

```
POST   /api/auth/register | login | logout | forgot-password | reset-password
GET    /api/users/me            PUT /api/users/me
POST   /api/ai/plan-trip        POST /api/ai/optimize-budget
POST   /api/trips  GET /api/trips  GET /api/trips/:id  DELETE /api/trips/:id
GET    /api/hotels/search       GET /api/hotels/:id    GET /api/hotels/:id/rooms
GET    /api/hotels/weather/:destination
POST   /api/hotels/favorites/:hotelId   DELETE .../favorites/:hotelId
POST   /api/bookings  GET /api/bookings  GET /api/bookings/:id  POST /api/bookings/:id/cancel
POST   /api/payments/create-order       POST /api/payments/verify
```

All responses follow `{ success: true, data }` or
`{ success: false, message, errorCode }`.

## Going live with real integrations

Each external integration has a single adapter file to implement:
- `backend/src/services/adapters/hotelApiAdapter.ts` → `callRealHotelApi()`
- `backend/src/services/adapters/weatherApiAdapter.ts` → `callRealWeatherApi()`
- `backend/src/services/adapters/paymentAdapter.ts` → `createRealRazorpayOrder()`

Set the corresponding `*_API_KEY` env var and the app automatically
switches from mock to real data — no other code changes needed.
