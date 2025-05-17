import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { NavLink, Outlet, useNavigate } from "react-router";
import ListItemButton from "@mui/material/ListItemButton";
import { PATHS, USER_SIDE_BAR_MENU } from "../../../constant";
import DrawerHeader from "../../components/DrawerHeader";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CssBaseline from "@mui/material/CssBaseline";
import React, { Fragment, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "../../components/AppBar";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import MainLayout from "../../components/Main";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import SettingsIcon from "@mui/icons-material/Settings";
import "./Main.css";

export const Main = () => {
  const { pathname } = window.location;
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    // Set active link based on current pathname
    const path = pathname.split("/").pop();
    setActiveLink(path || "homepage");
  }, [pathname]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:3000/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Failed to fetch user", err));
  }, []);

  useEffect(() => {
    
    if (pathname === PATHS.MAIN.path) navigate(PATHS.LOGIN.path);
  }, [pathname]);

  // Handle navigation link clicks
  const handleNavLinkClick = (path) => {
    setActiveLink(path);
    navigate(`/${path}`);
  };

  return (
    <Fragment>
      <CssBaseline />

      {/* Header */}
      <AppBar position="fixed" open={openDrawer}>
        <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center">
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setOpenDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" noWrap fontWeight={900} sx={{ mr: 4 }}>
              MARSHAL
            </Typography>
            
            <Box display="flex" alignItems="center">
              <a 
                href="#" 
                className={`nav-link ${activeLink === "homepage" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavLinkClick("homepage");
                }}
              >
                Home
              </a>
              <a 
                href="#" 
                className={`nav-link ${activeLink === "viewRooms" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavLinkClick("viewRooms");
                }}
              >
                View Rooms
              </a>
              <a 
                href="#" 
                className={`nav-link ${activeLink === "faq" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavLinkClick("faq");
                }}
              >
                FAQ
              </a>
            </Box>
          </Box>

        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        ModalProps={{
          keepMounted: true, // Improves performance on mobile
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={() => setOpenDrawer(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* User Area */}
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
              <Avatar>{user.username?.charAt(0).toUpperCase()}</Avatar>
              <Box>
                <Typography variant="body2" noWrap>{user.email}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap>{user.username}</Typography>
              </Box>
            </Box>
          )}
          <Divider />

          {/* Menu Items */}
          <Box sx={{ flexGrow: 1 }}>
            <List>
              {USER_SIDE_BAR_MENU.map((item) => (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton 
                    component={NavLink} 
                    to={item.path}
                    onClick={() => setOpenDrawer(false)}
                  >
                    <ListItemIcon>
                      {item.icon || <ListItemIcon />}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Settings at bottom */}
          <Box>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(PATHS.SETTINGS.path);
                }}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
          </Box>
        </Box>
      </Drawer>

      {/* MAIN CONTENT */}
      <MainLayout>
        <DrawerHeader />
        <Outlet />
      </MainLayout>
    </Fragment>
  );
};
