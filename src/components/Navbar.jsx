import { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Button, Box, Typography, Stack, Avatar,
  Container, Tooltip, IconButton, Drawer, List, ListItem,
  ListItemButton, ListItemText, ListItemIcon, Divider,
} from "@mui/material";
import MenuIcon         from "@mui/icons-material/Menu";
import CloseIcon        from "@mui/icons-material/Close";
import SchoolIcon       from "@mui/icons-material/School";
import HomeIcon         from "@mui/icons-material/Home";
import DashboardIcon    from "@mui/icons-material/Dashboard";
import LogoutIcon       from "@mui/icons-material/Logout";
import PersonIcon       from "@mui/icons-material/Person";
import { Link, useNavigate, useLocation } from "react-router-dom";

const C = {
  accent:      "#1565c0",
  accentLight: "#1e88e5",
  bg:          "#ffffff",
  border:      "rgba(21,101,192,0.14)",
  textDim:     "#546e7a",
  drawerBg:    "#f8faff",
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user,        setUser]        = useState(() => {
    const s = localStorage.getItem("user");
    return s ? JSON.parse(s) : null;
  });
  const [drawerOpen,  setDrawerOpen]  = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("user");
    setUser(s ? JSON.parse(s) : null);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setDrawerOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "Home",      to: "/",          icon: <HomeIcon /> },
    ...(user ? [
      { label: "Courses",   to: "/courses",   icon: <SchoolIcon /> },
      { label: "Dashboard", to: "/dashboard", icon: <DashboardIcon /> },
    ] : []),
  ];

  const handleNavClick = (to) => {
    navigate(to);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={{
        background:   C.bg,
        borderBottom: `1px solid ${C.border}`,
        boxShadow:    "0 2px 20px rgba(21,101,192,0.08)",
        zIndex:       1300,
      }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between", minHeight: 64 }}>

            {/* Logo */}
            <Typography variant="h5" fontWeight={900} onClick={() => navigate("/")}
              sx={{
                cursor: "pointer",
                background: `linear-gradient(to right, ${C.accent}, ${C.accentLight})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                letterSpacing: -1, fontSize: { xs: "1.1rem", sm: "1.4rem" },
              }}>
              Mentor Mentee
            </Typography>

            {/* ── Desktop nav ─────────────────────────────────────────────── */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
              <Stack direction="row" spacing={0.5}>
                {navLinks.map(({ label, to, icon }) => (
                  <Button key={to} component={Link} to={to}
                    startIcon={icon}
                    sx={{
                      color:         isActive(to) ? C.accent : C.textDim,
                      textTransform: "none",
                      fontWeight:    isActive(to) ? 800 : 600,
                      fontSize:      "0.88rem",
                      borderRadius:  "10px",
                      px:            1.5,
                      position:      "relative",
                      "&:hover":     { color: C.accent, bgcolor: "rgba(21,101,192,0.06)" },
                      "&::after": isActive(to) ? {
                        content: '""', position: "absolute", bottom: 4,
                        left: "20%", width: "60%", height: 2,
                        borderRadius: 2, bgcolor: C.accent,
                      } : {},
                    }}>
                    {label}
                  </Button>
                ))}
              </Stack>

              {user ? (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Tooltip title={`${user.name} — Edit Profile`}>
                    <Avatar src={user.avatar} onClick={() => navigate("/my-profile")}
                      sx={{
                        bgcolor: C.accent, width: 36, height: 36, fontSize: 14,
                        fontWeight: 900, cursor: "pointer", border: `2px solid ${C.border}`,
                        transition: "all 0.2s",
                        "&:hover": { borderColor: C.accent, transform: "scale(1.08)" },
                      }}>
                      {user?.name?.[0]?.toUpperCase() ?? "?"}
                    </Avatar>
                  </Tooltip>
                  <Button onClick={handleLogout} variant="outlined" size="small"
                    sx={{
                      color: C.accent, borderColor: C.border, textTransform: "none",
                      fontWeight: 700, borderRadius: "10px",
                      "&:hover": { bgcolor: C.accent, color: "#fff", borderColor: C.accent },
                    }}>
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

            {/* ── Mobile: avatar + hamburger ───────────────────────────────── */}
            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1 }}>
              {user && (
                <Avatar src={user.avatar} onClick={() => { navigate("/my-profile"); }}
                  sx={{
                    bgcolor: C.accent, width: 32, height: 32, fontSize: 13,
                    fontWeight: 900, cursor: "pointer", border: `2px solid ${C.border}`,
                  }}>
                  {user?.name?.[0]?.toUpperCase() ?? "?"}
                </Avatar>
              )}
              <IconButton onClick={() => setDrawerOpen(true)}
                sx={{ color: C.accent, border: `1px solid ${C.border}`, borderRadius: "10px", p: 0.8 }}>
                <MenuIcon />
              </IconButton>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {/* ── Mobile Drawer ──────────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: C.drawerBg,
            borderLeft: `1px solid ${C.border}`,
          },
        }}
      >
        {/* Drawer header */}
        <Box sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          px: 2.5, py: 2,
          background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
        }}>
          <Typography fontWeight={900} color="#fff" fontSize="1.1rem">
            Mentor Mentee
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* User info */}
        {user && (
          <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${C.border}` }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar src={user.avatar}
                sx={{ bgcolor: C.accent, width: 44, height: 44, fontWeight: 900 }}>
                {user?.name?.[0]?.toUpperCase() ?? "?"}
              </Avatar>
              <Box>
                <Typography fontWeight={800} fontSize="0.9rem" color={C.accent}>
                  {user.name}
                </Typography>
                <Typography fontSize="0.72rem" color={C.textDim} textTransform="capitalize">
                  {user.role}
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        {/* Nav links */}
        <List sx={{ pt: 1 }}>
          {navLinks.map(({ label, to, icon }) => (
            <ListItem key={to} disablePadding>
              <ListItemButton
                onClick={() => handleNavClick(to)}
                selected={isActive(to)}
                sx={{
                  mx: 1, borderRadius: "10px", mb: 0.5,
                  "&.Mui-selected": {
                    bgcolor: "rgba(21,101,192,0.1)",
                    "& .MuiListItemIcon-root": { color: C.accent },
                    "& .MuiListItemText-primary": { color: C.accent, fontWeight: 800 },
                  },
                  "&:hover": { bgcolor: "rgba(21,101,192,0.06)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isActive(to) ? C.accent : C.textDim }}>
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontWeight: isActive(to) ? 800 : 600,
                    color: isActive(to) ? C.accent : C.textDim,
                    fontSize: "0.9rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ borderColor: C.border, mx: 2 }} />

        {/* Profile & Logout */}
        {user ? (
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavClick("/my-profile")}
                sx={{ mx: 1, borderRadius: "10px", mb: 0.5, "&:hover": { bgcolor: "rgba(21,101,192,0.06)" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: C.textDim }}><PersonIcon /></ListItemIcon>
                <ListItemText primary="My Profile"
                  primaryTypographyProps={{ fontWeight: 600, color: C.textDim, fontSize: "0.9rem" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}
                sx={{ mx: 1, borderRadius: "10px", "&:hover": { bgcolor: "rgba(198,40,40,0.06)" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#c62828" }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout"
                  primaryTypographyProps={{ fontWeight: 700, color: "#c62828", fontSize: "0.9rem" }} />
              </ListItemButton>
            </ListItem>
          </List>
        ) : (
          <Box sx={{ p: 2.5 }}>
            <Button fullWidth component={Link} to="/register" variant="contained"
              onClick={() => setDrawerOpen(false)}
              sx={{ bgcolor: C.accent, borderRadius: "12px", textTransform: "none", fontWeight: 700,
                boxShadow: "0 4px 14px rgba(21,101,192,0.3)", "&:hover": { bgcolor: C.accentLight } }}>
              Join Now
            </Button>
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default Navbar;