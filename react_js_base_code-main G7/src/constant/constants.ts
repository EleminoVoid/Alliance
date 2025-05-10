import { patch } from "@mui/material";

// ROUTER PATH
export const PATHS = {
  MAIN: {
    path: "/",
    label: "Not Found"
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
    label: "Booking"
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
  }
  // Add more routes here
};

// SIDE BAR MENU PATH
export const SIDE_BAR_MENU = [
  {
    path: "/profile",
    label: "Edit Profile"
  },
  {
    path: "/bookings",
    label: "View Bookings"
  },
  {
    path: "/settings",
    label: "Settings"
  },
  {
    path: "/logout",
    label: "Logout"
  }
  // Add more path here
];
