# Iron Fit — Client App

Iron Fit is a lightweight PWA that lets clients browse class schedules, view class details, and see who’s attending. It’s built with modern React tooling, optimized for mobile, and integrates with a simple backend API.

**What it does**
- Shows a week view (Mon–Fri) with the currently selected day highlighted.
- Loads classes for the selected day from the backend and displays availability, instructor, and times.
- Lets users open a class to see details and the participant list.
- Includes a simple login that stores a `client_id` to personalize status (e.g., reserved).

**Tech Stack**
- React + TypeScript + Vite: Fast, typed front-end development.
- React Router: Client-side routing between pages.
- Axios: HTTP client for API calls.
- CSS (vanilla): Lightweight custom styles, mobile-first.
- Vite PWA: Installable experience with offline-friendly defaults.

**Key Pages & Files**
- `src/pages/LandingPage.tsx`: Weekly day pills; fetches classes for the selected day using `from`/`to` ISO query params; highlights the active day; handles loading/error states.
- `src/pages/ClassDetails.tsx`: Fetches a single class and its participants in one request; shows title, time, instructor, and list of attendees.
- `src/auth.ts`: Simple credential login; stores `client_id` in `localStorage`; reads `VITE_API_URL` for server base.
- `src/index.css`: Core layout and components (day pill highlight, cards, buttons, etc.).
- `vite.config.ts`: React plugin + PWA configuration.

**API Integration**
- Base URL: `VITE_API_URL` (set in `.env`). Example: `VITE_API_URL=http://localhost:3000/api`.
- List classes (day range): `GET ${VITE_API_URL}/v1/classes?from=ISO&to=ISO[&clientId=...]`
  - Returns `{ success: true, classes: [...] }` with items containing `start_at`, `end_at`, `capacity`, `reserved_count`, `user_status`, and `instructor`.
- Class details + participants: `GET ${VITE_API_URL}/v1/classes/:id[?clientId=...]`
  - Returns `{ success: true, class: {...}, participants: [{ id, name }] }`.

**Environment Variables**
- `VITE_API_URL`: Backend API origin for all requests (required). See `.env` for an example.

**Quick Start**
- Install: `npm install`
- Configure: create `.env` with `VITE_API_URL=http://localhost:3000/api`
- Run dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

**How it Works (at a glance)**
- Landing loads the current weekday by default and computes a `[from, to)` ISO window for that day to query the API.
- Responses are mapped to a minimal `ClassItem` shape for display (time formatting uses `toLocaleTimeString`).
- The selected day pill uses `aria-selected` and an `is-active` class for a11y and visual highlight.

**Future Enhancements**
- Reserve/cancel actions tied to attendance.
- Waitlist support and real-time updates.
- Improved offline behaviors with richer PWA caching.
