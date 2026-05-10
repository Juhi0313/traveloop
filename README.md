# Traveloop

Traveloop is a full-featured, personalized travel planning web application built for the hackathon. It allows users to build multi-city itineraries, discover destinations and activities, track budgets, manage packing lists, and share trips publicly — all from a clean, professional interface.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Demo Credentials](#demo-credentials)
- [Screens](#screens)
- [Color Palette](#color-palette)
- [State Management](#state-management)
- [Data Persistence](#data-persistence)

---

## Features

- Multi-city itinerary builder with drag-expandable stops
- Activity search and discovery by city and type
- Budget and cost breakdown with charts and per-stop tracking
- Packing checklist with category grouping and preset items
- Trip notes and journal per trip
- Public trip sharing via shareable link
- Copy a public trip into your own account
- City explorer with search, region filter, and cost index
- User profile with saved destinations and language preference
- Admin analytics dashboard with charts for usage, activity types, budgets, and cities
- Fully protected routes with login and signup
- Data persisted to localStorage via Zustand

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 (Vite plugin, CSS-first config) |
| Routing | React Router v6 |
| State | Zustand with persist middleware |
| Charts | Recharts |
| Icons | Lucide React |
| Date Utilities | date-fns |

---

## Project Structure

```
traveloop/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx          # Protected route wrapper, sidebar + navbar shell
│   │   │   ├── Sidebar.tsx         # Navigation sidebar with role-based admin link
│   │   │   └── Navbar.tsx          # Top bar with page title and search hint
│   │   └── ui/
│   │       ├── Badge.tsx           # Activity type and status badges
│   │       ├── Button.tsx          # Multi-variant button component
│   │       ├── Card.tsx            # Card and StatCard components
│   │       ├── EmptyState.tsx      # Empty state with optional action
│   │       ├── Input.tsx           # Labelled input with icon support
│   │       ├── Modal.tsx           # Accessible modal with header and footer slots
│   │       └── Select.tsx          # Styled select component
│   ├── data/
│   │   └── mockData.ts             # 16 cities, 23 activities, 2 demo users, 2 demo trips
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── Dashboard.tsx           # Home with stats, trips, popular cities, quick actions
│   │   ├── MyTrips.tsx             # Trip list with search, filter, and delete
│   │   ├── CreateTrip.tsx          # Trip creation form with cover image selection
│   │   ├── ItineraryBuilder.tsx    # Stop and activity management per trip
│   │   ├── ItineraryView.tsx       # Read view with list and calendar modes
│   │   ├── CitySearch.tsx          # City browser with region and cost filters
│   │   ├── ActivitySearch.tsx      # Activity discovery with type and city filters
│   │   ├── BudgetBreakdown.tsx     # Budget charts and per-stop cost breakdown
│   │   ├── PackingChecklist.tsx    # Packing list with presets and category view
│   │   ├── TripNotes.tsx           # Notes journal per trip
│   │   ├── SharedItinerary.tsx     # Public share view with copy-to-account
│   │   ├── Profile.tsx             # User profile, saved destinations, account actions
│   │   └── AdminDashboard.tsx      # Analytics dashboard (admin only)
│   ├── store/
│   │   └── index.ts                # Zustand stores: useAuthStore, useTripStore
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces for all domain models
│   ├── App.tsx                     # Router setup with all routes
│   ├── main.tsx                    # App entry point with error boundary
│   └── index.css                   # Tailwind v4 import, theme tokens, keyframes
├── index.html
├── vite.config.ts
├── tsconfig.app.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
git clone https://github.com/Juhi0313/traveloop.git
cd traveloop
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## Demo Credentials

Two accounts are pre-loaded for demonstration purposes.

**Regular User**
- Email: `alex@traveloop.com`
- Password: `password123`
- Has 2 pre-built trips (European Dream, Asian Adventure)

**Admin User**
- Email: `admin@traveloop.com`
- Password: `admin123`
- Has access to the Analytics Dashboard

Both sets of credentials are pre-filled on the login page for quick access.

---

## Screens

| Screen | Route | Description |
|---|---|---|
| Login | `/login` | Authentication with demo credential shortcuts |
| Signup | `/signup` | New account registration |
| Dashboard | `/dashboard` | Overview with stats, trips, cities, and quick actions |
| My Trips | `/trips` | All trips with search, status filter, and delete |
| Create Trip | `/trips/new` | Multi-step trip creation form |
| Itinerary Builder | `/trips/:id/builder` | Add cities, activities, and set per-stop budgets |
| Itinerary View | `/trips/:id` | Read-only trip view with list and calendar modes |
| City Explorer | `/cities` | Browse 16 cities with region and cost filters |
| Activity Search | `/activities` | Browse 23 activities filterable by city and type |
| Budget Breakdown | `/budget` | Charts and tables for trip cost analysis |
| Packing Checklist | `/packing` | Checklist with category grouping and preset loader |
| Trip Notes | `/notes` | Notes journal per trip with search |
| Shared Itinerary | `/shared/:id` | Public view accessible without login |
| Profile | `/profile` | Edit profile, view saved cities, sign out |
| Admin Dashboard | `/admin` | Platform analytics (admin accounts only) |

---

## Color Palette

| Name | Hex | Usage |
|---|---|---|
| Deep Navy | `#012f61` | Sidebar gradient start, hero overlays |
| Ocean Blue | `#0d61a3` | Primary brand color, buttons, links |
| Teal | `#00b4d8` | Gradient end, teal accents |
| Coral | `#ff6b6b` | Secondary actions, status badges |
| Gold | `#ffb347` | Budget charts, highlight accents |

---

## State Management

Two Zustand stores handle all application state.

**useAuthStore**
- Tracks the authenticated user and login state
- Actions: `login`, `signup`, `logout`, `updateUser`
- Persisted to localStorage under the key `traveloop-auth`

**useTripStore**
- Manages all trips and their nested stops, activities, notes, and packing items
- Actions for CRUD on trips, stops, activities, notes, and packing list items
- Persisted to localStorage under the key `traveloop-trips`
- Initialized with two demo trips on first load

---

## Data Persistence

All data is stored in the browser's localStorage via Zustand's `persist` middleware. There is no backend or database — this is an entirely client-side application. Data survives page refreshes and browser restarts but is scoped to the device and browser.
