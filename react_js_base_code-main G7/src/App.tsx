import Box from "@mui/material/Box";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AppRoutes } from "./routes";

const App = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <AppRoutes />
      <ToastContainer />
    </Box>
  );
};

export default App;
