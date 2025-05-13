import { patch } from "@mui/material";

// ROUTER PATH
export const PATHS = {
  MAIN: {
    path: "/",
    label: "Not Found"
  },
  ADMIN_MAIN: {
    path: "/admin", // New path for Admin Dashboard
    label: "Admin Main"
  },
   USER_MANAGEMENT: {
     path: "/admin/users", 
     label: "User Management" 
    },
  ROOM_MANAGEMENT: {
     path: "/admin/rooms",
      label: "Room Management" 
    },
  DASHBOARD: {
     path: "/admin/Dashboard",
      label: "Dashboard"
    },
  BOOKING_OVERVIEW: {
     path: "/admin/bookings",
      label: "Bookings" 
    },
  LOGIN: {
    path: "/login",
    label: "Login"
  },
  REGISTER: {
    path: "/register",
    label: "Register"
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
  },
  EDIT_USER:{
    path: "/editUser",
    label: "Edit User"
  },
  EDIT_ROOM:{
    path: "/editRoom",
    label: "Edit Room"
  },
  ADD_USER:{
    path: "/addUser",
    label: "Add User"
  },
  ADD_ROOM:{
    path: "/addRoom",
    label: "Add Room"
  },
  USERS:{
    path: "/users",
    label: "Users"
  },
  ROOMS:{
    path: "/rooms",
    label: "Rooms"
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
