import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Badge,
  Stack,
  Avatar,
  Container
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://startup-backend-1-cj33.onrender.com");

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [unreadCount, setUnreadCount] = useState(0);

  const colors = {
    accent: "#1565c0",
    accentLight: "#1e88e5",
    bg: "#ffffff",
    border: "rgba(21, 101, 192, 0.15)",
    textDim: "#546e7a",
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
        background: colors.bg,
        borderBottom: `1px solid ${colors.border}`,
        boxShadow: "0 2px 20px rgba(21,101,192,0.08)",
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
              background: `linear-gradient(to right, ${colors.accent}, ${colors.accentLight})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -1,
            }}
          >
            Mentor Mentee
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
              <Button component={Link} to="/" sx={{ color: colors.textDim, textTransform: "none", fontWeight: 600, "&:hover": { color: colors.accent } }}>Home</Button>
              <Button component={Link} to="/resources" sx={{ color: colors.textDim, textTransform: "none", fontWeight: 600, "&:hover": { color: colors.accent } }}>Resources</Button>
              {user && <Button component={Link} to="/dashboard" sx={{ color: colors.textDim, textTransform: "none", fontWeight: 600, "&:hover": { color: colors.accent } }}>Dashboard</Button>}
            </Stack>

            {user ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon sx={{ color: colors.accent, cursor: "pointer" }} onClick={() => navigate("/chat")} />
                </Badge>
                <Avatar sx={{ bgcolor: colors.accent, width: 32, height: 32, fontSize: 14, fontWeight: 800 }}>{user?.name?.[0]?.toUpperCase() ?? "?"}</Avatar>
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  size="small"
                  sx={{ color: colors.accent, borderColor: colors.accent, textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: colors.accent, color: "#fff" } }}
                >
                  Logout
                </Button>
              </Stack>
            ) : (
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{ bgcolor: colors.accent, borderRadius: 2, textTransform: "none", fontWeight: 700, boxShadow: "0 4px 14px rgba(21,101,192,0.3)", "&:hover": { bgcolor: colors.accentLight } }}
              >
                Join
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;