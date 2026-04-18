import { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Button, Box, Typography, Badge, Stack, Avatar, Container, Tooltip,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUnread } from "../Context/UnreadContext";

const Navbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { totalUnread } = useUnread();

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const C = {
    accent:      "#1565c0",
    accentLight: "#1e88e5",
    bg:          "#ffffff",
    border:      "rgba(21,101,192,0.14)",
    textDim:     "#546e7a",
    textActive:  "#1565c0",
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="fixed" elevation={0} sx={{
      background:   C.bg,
      borderBottom: `1px solid ${C.border}`,
      boxShadow:    "0 2px 20px rgba(21,101,192,0.08)",
      zIndex:       1300,
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", minHeight: 64 }}>

          {/* ── Logo ──────────────────────────────────────────────────── */}
          <Typography variant="h5" fontWeight={900} onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              background: `linear-gradient(to right, ${C.accent}, ${C.accentLight})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: -1,
            }}>
            Mentor Mentee
          </Typography>

          {/* ── Nav Links + Actions ───────────────────────────────────── */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Stack direction="row" spacing={0.5} sx={{ display: { xs: "none", md: "flex" } }}>
              {[
                { label: "Home",      to: "/" },
                { label: "Resources", to: "/resources" },
                ...(user ? [{ label: "Dashboard", to: "/dashboard" }] : []),
              ].map(({ label, to }) => (
                <Button key={to} component={Link} to={to}
                  sx={{
                    color:          isActive(to) ? C.textActive : C.textDim,
                    textTransform:  "none",
                    fontWeight:     isActive(to) ? 800 : 600,
                    fontSize:       "0.88rem",
                    borderRadius:   "10px",
                    px:             1.5,
                    position:       "relative",
                    "&:hover":      { color: C.accent, bgcolor: "rgba(21,101,192,0.06)" },
                    // active underline
                    "&::after": isActive(to) ? {
                      content:  '""',
                      position: "absolute",
                      bottom:   4,
                      left:     "20%",
                      width:    "60%",
                      height:   2,
                      borderRadius: 2,
                      bgcolor:  C.accent,
                    } : {},
                  }}>
                  {label}
                </Button>
              ))}
            </Stack>

            {user ? (
              <Stack direction="row" spacing={1.5} alignItems="center">

                {/* ── Chat badge ──────────────────────────────────────── */}
                <Tooltip title={totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? "s" : ""}` : "Messages"}>
                  <Badge
                    badgeContent={totalUnread}
                    color="error"
                    max={99}
                    sx={{ "& .MuiBadge-badge": { fontSize: "0.6rem", fontWeight: 800, minWidth: 16, height: 16, p: "0 4px" } }}
                  >
                    <Box onClick={() => navigate("/chat")}
                      sx={{
                        width: 36, height: 36, borderRadius: "10px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        bgcolor: totalUnread > 0 ? "rgba(21,101,192,0.1)" : "transparent",
                        transition: "all 0.2s",
                        animation: totalUnread > 0 ? "pulseChat 2s infinite" : "none",
                        "&:hover": { bgcolor: "rgba(21,101,192,0.12)" },
                      }}>
                      <ChatBubbleOutlineIcon sx={{ color: C.accent, fontSize: 20 }} />
                    </Box>
                  </Badge>
                </Tooltip>

                {/* ── Notification bell (general) ─────────────────────── */}
                <Tooltip title="Notifications">
                  <Box sx={{
                    width: 36, height: 36, borderRadius: "10px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    "&:hover": { bgcolor: "rgba(21,101,192,0.08)" },
                  }}>
                    <NotificationsNoneIcon sx={{ color: C.textDim, fontSize: 20 }} />
                  </Box>
                </Tooltip>

                {/* ── Avatar ──────────────────────────────────────────── */}
                <Tooltip title={user.name}>
                  <Avatar onClick={() => navigate("/my-profile")}
                    src={user.avatar}
                    sx={{ bgcolor: C.accent, width: 34, height: 34, fontSize: 13, fontWeight: 900, cursor: "pointer",
                      border: `2px solid ${C.border}`, "&:hover": { borderColor: C.accent } }}>
                    {user?.name?.[0]?.toUpperCase() ?? "?"}
                  </Avatar>
                </Tooltip>

                {/* ── Logout ──────────────────────────────────────────── */}
                <Button onClick={handleLogout} variant="outlined" size="small"
                  sx={{ color: C.accent, borderColor: C.border, textTransform: "none", fontWeight: 700, borderRadius: "10px",
                    "&:hover": { bgcolor: C.accent, color: "#fff", borderColor: C.accent } }}>
                  Logout
                </Button>
              </Stack>
            ) : (
              <Button component={Link} to="/register" variant="contained"
                sx={{ bgcolor: C.accent, borderRadius: "12px", textTransform: "none", fontWeight: 700,
                  boxShadow: "0 4px 14px rgba(21,101,192,0.3)", "&:hover": { bgcolor: C.accentLight } }}>
                Join
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Pulse animation for chat badge */}
      <style>{`
        @keyframes pulseChat {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.08); }
        }
      `}</style>
    </AppBar>
  );
};

export default Navbar;