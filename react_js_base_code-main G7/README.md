# Room Booking System

A modern React + TypeScript room booking and management web app with server-backed authentication, admin controls, calendar integration and analytics.

This README has been updated to reflect the recent refactor and feature additions made on the current branch (C#-Integration). It documents what changed, where to look in the codebase, how to run the app locally, and a short troubleshooting/next-steps section.

## Highlights — What changed in this branch

- Centralized server-backed authentication
  - `src/contexts/AuthContext.tsx` now provides `useAuth()` and `AuthProvider`. The app uses `GET /users/me` to refresh the current user and supports server-set cookies or token-based Authorization headers. `src/api.ts` exposes `setAuthToken()` to set an in-memory token.

- API wrapper and normalization
  - `src/api.ts` centralizes HTTP helpers (`requestJson`, `requestEmpty`) and endpoint functions used across the app (rooms, bookings, users, amenities).
  - Many components now normalize PascalCase/C#-style payloads to a JS-friendly shape (e.g., `.Id` -> `id`).

- Admin UI parity and improvements
  - Rooms and Users admin lists were unified to match visually and functionally: separate Edit and Delete columns, a functional numbered (No.) column, and pagination (page size 10).
  - Header and search alignment adjusted so counts and controls are visually consistent across lists.

- Booking UX improvements
  - The booking flow preserves a return URL when redirecting unauthenticated users to the Login page (so users return to the page they started from after login).
  - `CalendarBooking.tsx` limits selectable end times to a maximum of 2 hours after the selected start time (minimum 30 minutes). Select interactions from the calendar pre-fill the start/end inputs.

- Dashboard fixes and amenity handling
  - Dashboard booking statistics use the normalized booking list directly (previous flattening logic removed). Booked rooms now appear in charts correctly.
  - Dashboard fetches per-room amenities using the same API endpoint used by the Rooms admin page and displays a smaller image for the "most used" room.

- Readability / formatting helper
  - `src/utils/format.ts` was added with utilities to prettify camelCase/PascalCase/underscore labels and to normalize amenity objects. Rooms and Dashboard use this helper so UI shows human-friendly labels instead of raw property names.

- Settings: admin vs normal user
  - `src/views/containers/Settings/Settings.tsx` now renders an Admin tab when the logged-in user has a role containing "admin" (case-insensitive). The Admin tab includes toggles for recurring bookings, approval requirement, and a max booking duration input. Currently these settings are local UI state (toast confirmation); they can be persisted to an API if desired.

## Files and locations (where to look)

- Authentication and API
  - `src/contexts/AuthContext.tsx` — main client-side auth provider
  - `src/api.ts` — centralized API functions and helpers

- Utilities
  - `src/utils/format.ts` — prettifyLabel, amenityLabel, joinAmenityList

- Admin UI
  - `src/views/containers/Admin/Rooms/Rooms.tsx` — room list + per-room amenity fetch
  - `src/views/containers/Admin/Users/Users.tsx` — user management
  - `src/views/containers/Admin/Dashboard/Dashboard.tsx` — analytics & per-room amenities

- Booking / Calendar
  - `src/views/containers/CalendarBooking/CalendarBooking.tsx` — controlled time inputs and end-time constraints

- Settings
  - `src/views/containers/Settings/Settings.tsx` — account/notifications + admin-only tab

## How to run (Windows PowerShell)

From the repository root (`react_js_base_code-main G7`):

1. Install dependencies (only needed once or after package.json changes):

```powershell
Set-Location -LiteralPath "C:\Users\<YourUser>\Documents\GitHub\Alliance\react_js_base_code-main G7"
npm install
```

2. Start the development server (webpack dev server):

```powershell
npm run dev
```

3. Open the app at:

```text
http://localhost:8080
```

Notes:
- Dev server usually opens the browser automatically. If it doesn't, navigate to the address above.
- To create a production build: `npm run build`.

## Testing & Type-checking

- Type-check the project (no emit):

```powershell
npx tsc --noEmit
```

- Quick dev server: `npm run dev`.

Important: while working on this branch I ran `npx tsc --noEmit` and encountered unrelated type errors in `src/views/containers/Main/Main.tsx` (implicit any for a callback param and a few `user` typing problems). These errors are not caused by the recent UI/auth/formatting changes but will block a clean `tsc` run until fixed. If you want, I can fix those typing issues in `Main.tsx` in a follow-up patch.

## Known issues & next steps

- Backend auth shape (token vs cookie): The client supports both approaches. The login flow attempts to set an in-memory token (Authorization header) when the backend returns a token, but many deployments use HTTP-only cookies. Confirm the backend behavior and CORS/credentials settings so login and refresh work consistently across browsers.
- Admin settings persistence: Admin settings in `Settings.tsx` are UI-local for now. If you want these persisted, we should add an API endpoint (e.g., `PUT /admin/settings`) and persist the values server-side.
- Amenity object shapes: The `joinAmenityList` helper handles strings and common object shapes (e.g., `{ name: 'Projector' }`). If the backend returns a different amenity shape, provide an example response and I will adapt the normalizer.
- TypeScript errors: I can resolve the `Main.tsx` typing issues so `npx tsc --noEmit` returns cleanly.

## Small checklist for reviewers

- [ ] Verify login against your backend and confirm whether the API returns a token or relies on cookies.
- [ ] Log in as an admin and confirm the Settings page shows the Admin tab and the Manage Users button works.
- [ ] Open Admin → Rooms and Admin → Dashboard and verify amenities display in readable form.
- [ ] Try booking flow and verify the end-time constraints work as expected.

## Contributing / Further improvements

- Add server-side persistence for admin settings.
- Add loading states and error messages to the Dashboard/Rooms amenity fetching.
- Add unit tests for the new formatting helpers in `src/utils/format.ts`.

---

If you'd like, I can also:
- Patch the TypeScript issues in `Main.tsx` so the project type-checks cleanly.
- Persist Admin settings to the backend and wire related APIs.
- Run a live UI pass and fine-tune spacing/overflow for long prettified labels.

Thanks — tell me which follow-up you'd like next (fix types, persist admin settings, or prettify more fields across the app). 
# Room Booking System

A modern React-based room booking and management system with user authentication, admin controls, and calendar integration.

## Features

### User Features
- User Registration and Login
- Password Recovery System
- Room Browsing and Booking
- Calendar-based Booking Interface
- Booking Management (View and Edit)
- User Settings
- FAQ Section

### Admin Features
- User Management (Add, Edit, Delete)
- Room Management (Add, Edit, Delete)
- Dashboard with Analytics
- Booking Overview and Management

## Tech Stack

- **Frontend Framework**: React 19
- **Type System**: TypeScript
- **UI Components**: Material-UI (MUI)
- **Calendar**: FullCalendar
- **Form Handling**: Formik
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Charts**: Recharts
- **Build Tool**: Webpack

## Project Structure

```
src/
├── api.ts                 # API service configurations
├── App.tsx               # Main application component
├── routes.tsx           # Route definitions
├── types.ts             # TypeScript type definitions
├── constant/            # Application constants
├── includes/            # Shared components
└── views/
    ├── components/      # Common view components
    └── containers/      # Main feature containers
        ├── Admin/       # Admin-specific features
        ├── Login/       # Authentication
        ├── Register/    # User registration
        ├── Homepage/    # Landing page
        ├── CalendarBooking/  # Booking interface
        ├── ViewBooking/      # Booking management
        ├── ViewRooms/       # Room browsing
        └── Settings/        # User settings
```

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:
```bash
npm run dev
```
The application will open automatically in your default browser.

### How to run (Windows PowerShell)

Follow these steps to run the project locally on Windows using PowerShell. These commands assume you're running from the repository root (`react_js_base_code-main G7`).

1. Open PowerShell and change to the project directory:

```powershell
Set-Location -LiteralPath "C:\Users\<YourUser>\Documents\GitHub\Alliance\react_js_base_code-main G7"
```

2. Install dependencies (only needed once or when package.json changes):

```powershell
npm install
```

3. Start the development server (webpack dev server):

```powershell
npm run dev
```

4. Open the app in your browser (the dev server usually opens it automatically). If it doesn't, go to:

```text
http://localhost:8080
```

Notes:
- If you need to stop the dev server, press Ctrl+C in the terminal where it is running.
- To create a production build:

```powershell
npm run build
```
- If you see vulnerabilities after `npm install`, run `npm audit` and `npm audit fix` to attempt automatic fixes.

### Building for Production

To create a production build:
```bash
npm run build
```

## Scripts

- `npm start` or `npm run dev`: Start development server
- `npm run build`: Create production build

## Dependencies

### Core Dependencies
- React v19
- React Router v7
- Material-UI
- FullCalendar
- Axios
- Formik
- React Toastify

### Development Dependencies
- TypeScript
- Webpack
- Babel
- Various loaders and plugins for development optimization

## Additional Information

- The project uses TypeScript for type safety
- Webpack is configured for both development and production environments
- Material-UI components are used for consistent UI/UX
- FullCalendar integration for intuitive booking interface
- Responsive design for mobile and desktop views