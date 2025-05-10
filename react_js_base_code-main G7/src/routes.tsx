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
          <Route path={PATHS.DASHBOARD.path} element={<Views.Dashboard />} />
          <Route path={PATHS.VIEW_ROOMS.path} element={<Views.ViewRooms />} />
          <Route path={PATHS.FAQ.path} element={<Views.Faq />} />
          <Route path={PATHS.CALENDAR.path} element={<Views.CalendarBooking />} />
          <Route path={PATHS.SETTINGS.path} element={<Views.Settings />} />
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
