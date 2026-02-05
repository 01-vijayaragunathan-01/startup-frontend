import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Stack,
  Avatar,
  Container
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://startup-backend-1-cj33.onrender.com");

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [unreadCount, setUnreadCount] = useState(0);

  const colors = {
    accent: "#7000ff",
    glassBg: "rgba(3, 0, 20, 0.7)",
    glassBorder: "rgba(255, 255, 255, 0.12)"
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);

    if (parsedUser) {
      socket.emit("join", parsedUser._id);
      socket.on("new_notification", (notif) => {
        if (notif.from !== parsedUser._id) setUnreadCount((prev) => prev + 1);
      });
    }
    return () => socket.off("new_notification");
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: colors.glassBg,
        backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: `1px solid ${colors.glassBorder}`,
        zIndex: 1300,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            fontWeight={900}
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              background: "linear-gradient(to right, #fff, #b983ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -1,
            }}
          >
            Mentor Mentee
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
              <Button component={Link} to="/" sx={{ color: "rgba(255,255,255,0.7)", textTransform: 'none' }}>Home</Button>
              <Button component={Link} to="/resources" sx={{ color: "rgba(255,255,255,0.7)", textTransform: 'none' }}>Resources</Button>
              {user && <Button component={Link} to="/dashboard" sx={{ color: "rgba(255,255,255,0.7)", textTransform: 'none' }}>Dashboard</Button>}
            </Stack>

            {user ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon sx={{ color: "#fff", cursor: 'pointer' }} onClick={() => navigate("/chat")} />
                </Badge>
                <Avatar sx={{ bgcolor: colors.accent, width: 32, height: 32 }}>{user.name[0]}</Avatar>
                <Button onClick={handleLogout} variant="outlined" size="small" sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>Logout</Button>
              </Stack>
            ) : (
              <Button component={Link} to="/register" variant="contained" sx={{ bgcolor: colors.accent, borderRadius: 2 }}>Join</Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;