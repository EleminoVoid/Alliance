import { patch } from "@mui/material";

// ROUTER PATH
export const PATHS = {
  MAIN: {
    path: "/",
    label: "Not Found"
  },
  ADMIN_MAIN: {
    path: "/admin/Main", // New path for Admin Dashboard
    label: "Admin Dashboard"
  },
  LOGIN: {
    path: "/login",
    label: "Login"
  },
  REGISTER: {
    path: "/register",
    label: "Register"
  },
  DASHBOARD: {
    path: "/dashboard",
    label: "Dashboard"
  },
  FORGOTPASSWORD: {
    path:"/forgotpassword",
    label: "ForgotPassword"
  },
  NOT_FOUND: {
    path: "*",
    label: "Not Found"
  },
  HOMEPAGE: {
    path: "/homepage",
    label: "Homepage"
  },
  VIEW_ROOMS: {
    path: "/viewRooms",
    label: "Book A Room"
  },
  FAQ: {
    path: "/faq",
    label: "FAQ"
  },
  CALENDAR:{
    path: "/calendar",
    label: "Calendar"
  },
  SETTINGS:{
    path: "/settings",
    label: "Settings"
  },
  BOOKINGS:{
    path: "/bookings",
    label: "Bookings"
  },
  EDIT_BOOKING:{
    path: "/editBooking",
    label: "Edit Booking"
  }
  // Add more routes here
};

// SIDE BAR MENU PATH
export const SIDE_BAR_MENU = [
  {
    path: "/bookings",
    label: "View Bookings"
  },
  {
    path: "/settings",
    label: "Settings"
  },
  {
    path: "/login",
    label: "Logout"
  }
  // Add more path here
];
