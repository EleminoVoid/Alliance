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
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import "./AMain.css";

export const AdminMain = () => {
  const { pathname } = window.location;
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [adminFeatures, setAdminFeatures] = useState({
    analytics: true,
    userManagement: true,
    contentModeration: true
  });
useEffect(() => {
  const verifyAdmin = async () => {
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");

    if (!userId || userRole !== "admin") {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`);
      if (!response.ok) throw new Error("Failed to verify user");
      
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Admin verification failed:", error);
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      navigate("/login");
    }
  };

  verifyAdmin();
}, [navigate]);

  return (
    <Fragment>
      {/* <CssBaseline /> */}

      {/* Admin Header */}
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
            background: theme.palette.primary.dark,
            color: theme.palette.common.white,
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={() => setOpenDrawer(false)} sx={{ color: 'inherit' }}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Admin User Area */}
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'primary.main' }}>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                {user.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" noWrap>{user.email}</Typography>
                <Typography variant="caption" noWrap sx={{ color: 'secondary.main' }}>
                  {user.role.toUpperCase()}
                </Typography>
              </Box>
            </Box>
          )}
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />

          {/* Admin Menu Items */}
          <Box sx={{ flexGrow: 1 }}>
            <List>
              {ADMIN_SIDE_BAR_MENU.map((item) => (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton 
                    component={NavLink} 
                    to={item.path}
                    sx={{
                      '&.active': {
                        bgcolor: 'primary.light',
                      },
                      '&:hover': {
                        bgcolor: 'primary.light',
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      {item.icon || <DashboardIcon />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Admin Controls */}
          <Box sx={{ p: 2 }}>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Admin Features
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">Analytics Dashboard</Typography>
                <IconButton 
                  size="small" 
                  color={adminFeatures.analytics ? 'secondary' : 'default'}
                  onClick={() => handleAdminFeatureToggle('analytics')}
                >
                  <DashboardIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">User Management</Typography>
                <IconButton 
                  size="small" 
                  color={adminFeatures.userManagement ? 'secondary' : 'default'}
                  onClick={() => handleAdminFeatureToggle('userManagement')}
                >
                  <PeopleIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Settings at bottom */}
          <Box>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
            <ListItem disablePadding>
              <ListItemButton 
                component={NavLink} 
                to="/admin/settings"
                sx={{
                  '&.active': {
                    bgcolor: 'primary.light',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Admin Settings" 
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
              </ListItemButton>
            </ListItem>
          </Box>
        </Box>
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