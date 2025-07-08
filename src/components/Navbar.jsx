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
  Divider,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);

    if (parsedUser) {
      socket.emit("join", parsedUser._id);
      socket.on("new_notification", (notif) => {
        if (notif.from !== parsedUser._id) {
          setUnreadCount((prev) => prev + 1);
        }
      });
    }

    return () => socket.off("new_notification");
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const handleNotificationsClick = () => {
    setUnreadCount(0);
    navigate("/chat");
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenuItems = () => (
    <>
      <Button color="inherit" component={Link} to="/">
        Home
      </Button>
      <Button color="inherit" component={Link} to="/about">
        About
      </Button>
      <Button
        color="inherit"
        endIcon={<ExpandMoreIcon />}
        onClick={handleMenuClick}
      >
        Resources
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose} component={Link} to="/resources">
          View Resources
        </MenuItem>
        {user?.role === "mentor" && (
          <MenuItem onClick={handleMenuClose} component={Link} to="/add-resource">
            Add Resource
          </MenuItem>
        )}
      </Menu>
      {user && (
        <>
          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/my-profile">
            My Profile
          </Button>
        </>
      )}
    </>
  );

  const drawerContent = (
    <Box sx={{ width: 250, px: 2, py: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Menu</Typography>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/about" onClick={toggleDrawer(false)}>
          <ListItemText primary="About" />
        </ListItem>
        <ListItem button component={Link} to="/resources" onClick={toggleDrawer(false)}>
          <ListItemText primary="View Resources" />
        </ListItem>
        {user?.role === "mentor" && (
          <ListItem button component={Link} to="/add-resource" onClick={toggleDrawer(false)}>
            <ListItemText primary="Add Resource" />
          </ListItem>
        )}
        {user && (
          <>
            <ListItem button component={Link} to="/dashboard" onClick={toggleDrawer(false)}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/my-profile" onClick={toggleDrawer(false)}>
              <ListItemText primary="My Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
        {!user && (
          <>
            <ListItem button component={Link} to="/login" onClick={toggleDrawer(false)}>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register" onClick={toggleDrawer(false)}>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left: Logo or Menu */}
          {isMobile ? (
            <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box>{renderMenuItems()}</Box>
          )}

          {/* Right: Actions */}
          <Box display="flex" alignItems="center" gap={2}>
            {user && (
              <IconButton color="inherit" onClick={handleNotificationsClick}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            )}
            {user ? (
              <>
                <Typography variant="body1" sx={{ color: "#fff" }}>
                  Hi, {user.name}
                </Typography>
                {!isMobile && (
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Side Drawer for Mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
