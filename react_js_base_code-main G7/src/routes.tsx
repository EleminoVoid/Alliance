import { BrowserRouter, Route, Routes } from "react-router";
import * as Views from "./views/containers";
import { PATHS } from "./constant";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.MAIN.path} element={<Views.Main />}>
          {/* ADD PRIVATE ROUTES HERE (Routes that can only access after login like Dashboard, Account Setting, etc.) */}
          <Route path={PATHS.DASHBOARD.path} element={<Views.Dashboard />} />
          <Route path={PATHS.VIEW_ROOMS.path} element={<Views.ViewRooms />} />
          <Route path={PATHS.FAQ.path} element={<Views.Faq />} />
          <Route path={PATHS.CALENDAR.path} element={<Views.CalendarBooking />} />
          <Route path={PATHS.SETTINGS.path} element={<Views.Settings />} />


        </Route>
        {/* ADD PUBLIC ROUTES HERE (e.g., Login, Sign Up, Forgot Pass, etc. ) */}
        <Route path={PATHS.HOMEPAGE.path} element={<Views.Homepage />} />
        <Route path={PATHS.LOGIN.path} element={<Views.Login />} />
        <Route path={PATHS.REGISTER.path} element={<Views.Register />} />
        <Route path={PATHS.NOT_FOUND.path} element={<Views.NotFound />} />
        <Route path={PATHS.FORGOTPASSWORD.path} element={<Views.ForgotPassword />} />
        
        {/* ADD MORE PUBLIC ROUTES HERE */}
      </Routes>
    </BrowserRouter>
  );
};
