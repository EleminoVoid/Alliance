import { BrowserRouter, Route, Routes } from "react-router";
import * as Views from "./views/containers";
import { PUBLIC_PATHS, USER_PATHS, ADMIN_PATHS } from "./constant";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Views.Main />}>
        </Route>
        <Route path={USER_PATHS.MAIN.path} element={<Views.Main />}>
          {/* Nested routes under Main */}
          <Route path={USER_PATHS.HOMEPAGE.path} element={<Views.Homepage />} />
          <Route path={USER_PATHS.VIEW_ROOMS.path} element={<Views.ViewRooms />} />
          <Route path={USER_PATHS.FAQ.path} element={<Views.Faq />} />
          <Route path={USER_PATHS.CALENDAR.path} element={<Views.CalendarBooking />} />
          <Route path={USER_PATHS.SETTINGS.path} element={<Views.Settings />} />
          <Route path={USER_PATHS.BOOKINGS.path} element={<Views.ViewBookings />} />
          <Route path={USER_PATHS.EDIT_BOOKINGS.path} element={<Views.EditBooking />} />

         {/* Add more nested routes here */}
        </Route><Route path={ADMIN_PATHS.ADMIN_MAIN.path} element={<Views.AdminMain />}>
          {/* Nested routes under Main */}
          <Route path={ADMIN_PATHS.DASHBOARD.path} element={<Views.Dashboard />} />
          <Route path={ADMIN_PATHS.EDIT_USER.path} element={<Views.EditUser />} />
          <Route path={ADMIN_PATHS.EDIT_ROOM.path} element={<Views.EditRoom />} />
          <Route path={ADMIN_PATHS.ADD_USER.path} element={<Views.AddUser />} />
          <Route path={ADMIN_PATHS.ADD_ROOM.path} element={<Views.AddRoom />} />
          <Route path={ADMIN_PATHS.USER_MANAGEMENT.path} element={<Views.Users />} />
          <Route path={ADMIN_PATHS.ROOM_MANAGEMENT.path} element={<Views.Rooms />} />
          
          {/* Add more nested routes here */}
        </Route>
        {/* Add public routes here if needed */}
        <Route path={PUBLIC_PATHS.LOGIN.path} element={<Views.Login />} />
        <Route path={PUBLIC_PATHS.REGISTER.path} element={<Views.Register />} />
        <Route path={PUBLIC_PATHS.NOT_FOUND.path} element={<Views.NotFound />} />
        <Route path={PUBLIC_PATHS.FORGOT_PASSWORD.path} element={<Views.ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
};
