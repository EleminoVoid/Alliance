import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import { ADMIN_PATHS, ADMIN_SIDE_BAR_MENU } from "../../../../constant";
import DrawerHeader from "../../../components/DrawerHeader";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CssBaseline from "@mui/material/CssBaseline";
import React, { Fragment, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "../../../components/AppBar";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import MainLayout from "../../../components/Main";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import "./AMain.css";

export const AdminMain = () => {
  const { pathname } = window.location;
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const theme = useTheme();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminFeatures, setAdminFeatures] = useState({
    analytics: true,
    userManagement: true,
    contentModeration: true
  });

  useEffect(() => {
    const verifyAdmin = () => {
      const userId = localStorage.getItem("userId");
      const userRole = localStorage.getItem("userRole");
      const username = localStorage.getItem("username");
      const userEmail = localStorage.getItem("userEmail");

      // Case-insensitive role check
      if (!userId || userRole?.toLowerCase() !== "admin") {
        navigate("/login", { replace: true });
        return;
      }

      // Set user data from localStorage (already validated during login)
      setUser({
        id: userId,
        username: username || "Admin",
        email: userEmail || "",
        role: userRole,
      });

      setIsLoading(false);
    };

    verifyAdmin();
  }, [navigate]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Fragment>
      <AppBar position="fixed" className="admin-app-bar">
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpenDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <AdminPanelSettingsIcon sx={{ mr: 1 }} />
            <Typography variant="h6" noWrap fontWeight={900} sx={{ mr: 4 }}>
              MARSHAL ADMIN
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle2" sx={{ mr: 2 }}>
              Admin Mode
            </Typography>
            {user && (
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {user.username?.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Admin Sidebar */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            background: "#fff",
            color: "#222",
            borderRight: "1px solid #eee",
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={() => setOpenDrawer(false)} sx={{ color: 'inherit' }}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />

        {/* Admin User Area */}
        {user && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
            <Avatar
              src={user.avatar || "https://i.pravatar.cc/40"}
              sx={{ width: 64, height: 64, mb: 1, bgcolor: 'primary.main' }}
            >
              {user.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle1" fontWeight={700}>
              {user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Typography variant="caption" color="primary" sx={{ mt: 0.5 }}>
              {user.role?.toUpperCase()}
            </Typography>
          </Box>
        )}

        <Divider sx={{ mb: 1 }} />

        {/* Admin Menu Items */}
        <List>
          {ADMIN_SIDE_BAR_MENU.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  '&.active': {
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                  },
                  '&:hover': {
                    bgcolor: 'primary.light',
                  },
                  px: 3,
                  py: 1.5,
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        {/* Settings at bottom */}
        <Divider sx={{ mt: 2 }} />
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/admin/settings"
            sx={{
              '&.active': {
                bgcolor: 'primary.light',
                color: 'primary.main',
              },
              px: 3,
              py: 1.5,
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Admin Settings"
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>
      </Drawer>

      {/* ADMIN MAIN CONTENT */}
      <MainLayout className="admin-main-content">
        <DrawerHeader />
        <Box sx={{
          p: 3,
          background: '#f5f7fa',
          minHeight: 'calc(100vh - 64px)'
        }}>
          <Outlet />
        </Box>
      </MainLayout>
    </Fragment>
  );
};