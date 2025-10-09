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
} from "@mui/material";
import { Settings, LogOut } from "lucide-react";
import { authService } from "../lib/auth";
import { useNavigate, useLocation, Outlet } from "react-router";

const drawerWidth = 240;

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Inventory", path: "/inventory", isParent: true },
    { label: "Products", path: "/inventory/products", indent: true },
    { label: "Forms", path: "/inventory/forms", indent: true },
    { label: "Beans", path: "/inventory/beans", indent: true },
    { label: "Orders", path: "/orders" },
  ];

  const isActive = (path: string): boolean => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#fafafa",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: "0.5px" }}
          >
            INDOCOFFE
          </Typography>
        </Box>

        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            if (item.isParent) {
              return (
                <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={location.pathname.includes("/inventory")}
                    sx={{
                      borderRadius: 2,
                      bgcolor: location.pathname.includes("/inventory")
                        ? "#4A90E2"
                        : "transparent",
                      color: location.pathname.includes("/inventory")
                        ? "white"
                        : "text.primary",
                      "&:hover": {
                        bgcolor: location.pathname.includes("/inventory")
                          ? "#357ABD"
                          : "rgba(0, 0, 0, 0.04)",
                      },
                      "&.Mui-selected": {
                        bgcolor: "#4A90E2",
                        "&:hover": {
                          bgcolor: "#357ABD",
                        },
                      },
                    }}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              );
            }

            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isActive(item.path)}
                  sx={{
                    borderRadius: 2,
                    pl: item.indent ? 4 : 2,
                    bgcolor: isActive(item.path) ? "#4A90E2" : "transparent",
                    color: isActive(item.path) ? "white" : "text.primary",
                    "&:hover": {
                      bgcolor: isActive(item.path)
                        ? "#357ABD"
                        : "rgba(0, 0, 0, 0.04)",
                    },
                    "&.Mui-selected": {
                      bgcolor: "#4A90E2",
                      "&:hover": {
                        bgcolor: "#357ABD",
                      },
                    },
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#e8e8e8" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 4,
            py: 2,
            bgcolor: "#e8e8e8",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Dashboard
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton>
              <Settings size={20} />
            </IconButton>
            <IconButton onClick={handleLogout}>
              <LogOut size={20} />
            </IconButton>
            <Avatar sx={{ width: 40, height: 40, bgcolor: "white" }} />
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
