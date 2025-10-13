import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
  Collapse,
  Tooltip,
} from "@mui/material";
import { LogOut, Menu, ChevronDown, ChevronRight } from "lucide-react";

import { useNavigate, useLocation, Outlet } from "react-router";
import { useState } from "react";
import { authService } from "../lib/service/auth";
import { useQuery } from "@tanstack/react-query";
import { profileService } from "../lib/service/profile";
import { green } from "@mui/material/colors";

const drawerWidth = 240;

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    inventory: true,
  });
  const { isPending, isError, data } = useQuery({
    queryKey: ["profile"],
    queryFn: profileService.getProfile.bind(profileService),
  });

  const username = isPending || isError ? "user" : (data?.username ?? "user");

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", path: "/" },
    {
      label: "Inventory",
      path: "/inventory",
      isParent: true,
      children: [
        { label: "Products", path: "/inventory/products" },
        { label: "Forms", path: "/inventory/forms" },
        { label: "Beans", path: "/inventory/beans" },
      ],
    },
    { label: "Orders", path: "/orders" },
  ];

  const isActive = (path: string): boolean => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleToggleMenu = (menuPath: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuPath]: !prev[menuPath],
    }));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? drawerWidth : 70,
          flexShrink: 0,
          transition: "width 0.3s",
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? drawerWidth : 70,
            transition: "width 0.3s",
            boxSizing: "border-box",
            bgcolor: "#fafafa",
            borderRight: "1px solid #e0e0e0",
            overflowX: "hidden",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: sidebarOpen ? "space-between" : "center",
            p: 2,
          }}
        >
          {sidebarOpen && (
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, letterSpacing: "0.5px" }}
            >
              INDOCOFFEE
            </Typography>
          )}
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </IconButton>
        </Box>

        <List sx={{ px: 1 }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);

            const typographySlots = {
              primary: {
                sx: {
                  fontWeight: active ? 700 : 400,
                  color: "text.primary",
                  fontSize: "0.95rem",
                  transition: "font-weight 0.2s",
                },
              },
            };

            if (item.isParent && item.children) {
              const key = item.label.toLowerCase();
              const open = openMenus[key] ?? false;

              return (
                <Box key={item.label}>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => handleToggleMenu(key)}
                      sx={{
                        borderRadius: 2,
                        justifyContent: sidebarOpen
                          ? "space-between"
                          : "center",
                        px: sidebarOpen ? 2 : 0,
                        "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                      }}
                    >
                      {sidebarOpen && (
                        <>
                          <ListItemText
                            primary={item.label}
                            slotProps={typographySlots}
                          />
                          {open ? (
                            <ChevronDown size={18} />
                          ) : (
                            <ChevronRight size={18} />
                          )}
                        </>
                      )}
                    </ListItemButton>
                  </ListItem>

                  {sidebarOpen && (
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.children.map((child) => {
                          const childActive = isActive(child.path);
                          return (
                            <ListItem key={child.label} disablePadding>
                              <ListItemButton
                                onClick={() => navigate(child.path)}
                                sx={{
                                  pl: sidebarOpen ? 4 : 0,
                                  justifyContent: sidebarOpen
                                    ? "flex-start"
                                    : "center",
                                  "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                                }}
                              >
                                {sidebarOpen && (
                                  <ListItemText
                                    primary={child.label}
                                    slotProps={{
                                      primary: {
                                        sx: {
                                          fontWeight: childActive ? 700 : 400,
                                          color: "text.primary",
                                          fontSize: "0.9rem",
                                        },
                                      },
                                    }}
                                  />
                                )}
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  )}
                </Box>
              );
            }

            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    justifyContent: sidebarOpen ? "flex-start" : "center",
                    px: sidebarOpen ? 2 : 0,
                    "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                  }}
                >
                  {sidebarOpen && (
                    <ListItemText
                      primary={item.label}
                      slotProps={typographySlots}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
          transition: "margin-left 0.3s",
        }}
      >
        {/* Top bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 4,
            py: 2,
            bgcolor: "#fafafa",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Dashboard
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Log out">
              <IconButton onClick={handleLogout}>
                <LogOut size={20} />
              </IconButton>
            </Tooltip>

            <Tooltip title={username}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: green[900] }}>
                {username[0].toUpperCase()}
              </Avatar>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
