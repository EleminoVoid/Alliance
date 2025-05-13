import { BrowserRouter, Route, Routes } from "react-router";
import * as Views from "./views/containers";
import { PATHS } from "./constant";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Views.Main />}>
        </Route>
        <Route path={PATHS.MAIN.path} element={<Views.Main />}>
          {/* Nested routes under Main */}
          <Route path={PATHS.HOMEPAGE.path} element={<Views.Homepage />} />
          <Route path={PATHS.VIEW_ROOMS.path} element={<Views.ViewRooms />} />
          <Route path={PATHS.FAQ.path} element={<Views.Faq />} />
          <Route path={PATHS.CALENDAR.path} element={<Views.CalendarBooking />} />
          <Route path={PATHS.SETTINGS.path} element={<Views.Settings />} />
          <Route path={PATHS.BOOKINGS.path} element={<Views.ViewBookings />} />
          <Route path={PATHS.EDIT_BOOKING.path} element={<Views.EditBooking />} />
          <Route path={PATHS.EDIT_USER.path} element={<Views.EditUser />} />
          <Route path={PATHS.EDIT_ROOM.path} element={<Views.EditRoom />} />
          <Route path={PATHS.ADD_USER.path} element={<Views.AddUser />} />
          <Route path={PATHS.ADD_ROOM.path} element={<Views.AddRoom />} />
          <Route path={PATHS.USERS.path} element={<Views.Users />} />
          <Route path={PATHS.ROOMS.path} element={<Views.Rooms />} />
          {/* Add more nested routes here */}
        </Route><Route path={PATHS.ADMIN_MAIN.path} element={<Views.Main />}>
          {/* Nested routes under Main */}
          <Route path={PATHS.DASHBOARD.path} element={<Views.Dashboard />} />
        
          {/* Add more nested routes here */}
        </Route>
        {/* Add public routes here if needed */}
        <Route path={PATHS.LOGIN.path} element={<Views.Login />} />
        <Route path={PATHS.REGISTER.path} element={<Views.Register />} />
        <Route path={PATHS.NOT_FOUND.path} element={<Views.NotFound />} />
        <Route path={PATHS.FORGOTPASSWORD.path} element={<Views.ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
};
