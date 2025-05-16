// constants.ts

// BASE PATHS
const BASE = {
  ADMIN: '/admin',
  USER: '/user'
};

// PUBLIC ROUTES
export const PUBLIC_PATHS = {
  LOGIN: {
    path: "/login",
    label: "Login"
  },
  REGISTER: {
    path: "/register",
    label: "Register"
  },
  FORGOT_PASSWORD: {
    path: "/forgot-password",
    label: "Forgot Password"
  },
  NOT_FOUND: {
    path: "*",
    label: "Not Found"
  }
};

// USER ROUTES
export const USER_PATHS = {
  MAIN: {
    path: "/",
    label: "Home"
  },
  HOMEPAGE: {
    path: "/homepage",
    label: "Homepage"
  },
  VIEW_ROOMS: {
    path: "/viewRooms",
    label: "View Rooms"
  },
  BOOKINGS: {
    path: "/bookings",
    label: "My Bookings"
  },
  EDIT_BOOKINGS: {
    path: "/edit-booking/:id",
    label: "My Bookings"
  },
  CALENDAR: {
    path: "/calendar",
    label: "Calendar"
  },
  SETTINGS: {
    path: "/settings",
    label: "Settings"
  },
  FAQ: {
    path: "/faq",
    label: "FAQ"
  }
};

// ADMIN ROUTES
export const ADMIN_PATHS = {
   ADMIN_MAIN: {
    path: `${BASE.ADMIN}`,
    label: "Home"
  },
  DASHBOARD: {
    path: `${BASE.ADMIN}/dashboard`,
    label: "Dashboard",
    icon: "Dashboard"
  },
  USER_MANAGEMENT: {
    path: `${BASE.ADMIN}/users`,
    label: "User Management",
    icon: "People"
  },
  ROOM_MANAGEMENT: {
    path: `${BASE.ADMIN}/rooms`,
    label: "Room Management",
    icon: "MeetingRoom"
  },
  BOOKING_OVERVIEW: {
    path: `${BASE.ADMIN}/bookings`,
    label: "Booking Overview",
    icon: "CalendarView"
  },
  SYSTEM_SETTINGS: {
    path: `${BASE.ADMIN}/settings`,
    label: "System Settings",
    icon: "Settings"
  },
  EDIT_USER:{
    path: `${BASE.ADMIN}/EditUser/:id`,
    label: "Edit User"
  },
  EDIT_ROOM:{
    path: `${BASE.ADMIN}/EditRoom/:id`,
    label: "Edit Room"
  },
  ADD_USER:{
    path: `${BASE.ADMIN}/addUser`,
    label: "Add User"
  },
  ADD_ROOM:{
    path: `${BASE.ADMIN}/addRoom`,
    label: "Add Room"
  },
};

// COMBINED PATHS (for easy access if needed)
export const PATHS = {
  ...PUBLIC_PATHS,
  ...USER_PATHS,
  ...ADMIN_PATHS
};

// SIDEBAR MENUS
export const USER_SIDE_BAR_MENU = [
  { path: USER_PATHS.BOOKINGS.path, label: USER_PATHS.BOOKINGS.label },
  { path: USER_PATHS.CALENDAR.path, label: USER_PATHS.CALENDAR.label },
  { path: PUBLIC_PATHS.LOGIN.path, label: "Logout" }
];

export const ADMIN_SIDE_BAR_MENU = [
  { path: ADMIN_PATHS.DASHBOARD.path, label: ADMIN_PATHS.DASHBOARD.label },
  { path: ADMIN_PATHS.USER_MANAGEMENT.path, label: ADMIN_PATHS.USER_MANAGEMENT.label },
  { path: ADMIN_PATHS.ROOM_MANAGEMENT.path, label: ADMIN_PATHS.ROOM_MANAGEMENT.label },
  { path: PUBLIC_PATHS.LOGIN.path, label: "Logout" }
];