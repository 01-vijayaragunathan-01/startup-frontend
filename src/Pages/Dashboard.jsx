import {
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  Button,
  Container,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import axios from "axios";
import toast from "react-hot-toast";
import MentorCard from "../components/MentorCard";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SettingsIcon from '@mui/icons-material/Settings';

const Dashboard = () => {
  const [studentRequests, setStudentRequests] = useState([]);
  const [mentorProfile, setMentorProfile] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Premium Theme Colors
  const colors = {
    bg: "#030014",
    accent: "#7000ff",
    glass: "rgba(255, 255, 255, 0.03)",
    glassBorder: "rgba(255, 255, 255, 0.08)",
    textDim: "rgba(255, 255, 255, 0.6)",
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchData = async () => {
      try {
        if (user?.role === "mentor") {
          const reqRes = await axios.get("https://startup-backend-1-cj33.onrender.com/api/mentorship/requests", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStudentRequests(reqRes.data.requests);

          const profileRes = await axios.get("https://startup-backend-1-cj33.onrender.com/api/profile/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMentorProfile(profileRes.data);
        } else if (user?.role === "student") {
          const mentorRes = await axios.get("https://startup-backend-1-cj33.onrender.com/api/mentors");
          setMentors(mentorRes.data);

          const reqRes = await axios.get("https://startup-backend-1-cj33.onrender.com/api/mentorship/my-requests", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMyRequests(reqRes.data.requests || []);
        }

        const chatRes = await axios.get("https://startup-backend-1-cj33.onrender.com/api/messages/contacts/recent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentChats(chatRes.data);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      }
    };

    fetchData();
  }, [user?.role, token]);

  const glassCardStyle = {
    background: colors.glass,
    backdropFilter: "blur(12px)",
    border: `1px solid ${colors.glassBorder}`,
    borderRadius: "24px",
    p: 3,
    transition: "0.3s",
    "&:hover": { borderColor: colors.accent }
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 12, px: { xs: 2, md: 4 }, bgcolor: colors.bg, color: 'white' }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={900} data-aos="fade-down" sx={{
            background: "linear-gradient(to right, #fff, #b983ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: -1
          }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: colors.textDim, mt: 1 }} data-aos="fade-up">
            Welcome back, {user?.name}. {user?.role === "mentor" ? "Manage your mentees and profile." : "Explore experts and grow your skills."}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* LEFT COLUMN: Main Interaction */}
          <Grid item xs={12} lg={8}>
            {user?.role === "mentor" ? (
              <Paper sx={glassCardStyle}>
                <Typography variant="h5" fontWeight={800} mb={3}>Student Requests</Typography>
                {studentRequests.length === 0 ? (
                  <Typography sx={{ color: colors.textDim }}>No pending requests.</Typography>
                ) : (
                  <List disablePadding>
                    {studentRequests.map((req, i) => (
                      <ListItem key={i} sx={{
                        bgcolor: 'rgba(255,255,255,0.02)', mb: 2, borderRadius: 3, p: 2,
                        border: '1px solid rgba(255,255,255,0.05)',
                        justifyContent: 'space-between'
                      }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: colors.accent }}>{req.student.name[0]}</Avatar>
                          <ListItemText primary={req.student.name} secondaryTypographyProps={{ sx: { color: colors.textDim } }} secondary={req.student.email} />
                        </Stack>
                        <Button variant="contained" size="small" onClick={() => navigate("/chat", { state: { receiverId: req.student._id, receiverName: req.student.name } })}
                          sx={{ bgcolor: colors.accent, borderRadius: 2 }}>Chat</Button>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            ) : (
              <Box>
                <Typography variant="h5" fontWeight={800} mb={4}>Explore Mentors</Typography>
                {mentors.length === 0 ? (
                  <Typography sx={{ color: colors.textDim }}>Finding experts...</Typography>
                ) : (
                  <Grid container spacing={3}>
                    {mentors.map((mentor) => {
                      const status = myRequests.find(req => req.mentor._id === mentor._id)?.status || null;
                      return (
                        <Grid item xs={12} sm={6} key={mentor._id}>
                          <MentorCard mentor={mentor} mentorshipStatus={status} />
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>
            )}
          </Grid>

          {/* RIGHT COLUMN: Profile & Stats */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={4}>
              {/* Profile Overview (Mentor Only) */}
              {user?.role === "mentor" && mentorProfile && (
                <Paper sx={{ ...glassCardStyle, p: 0, overflow: 'hidden' }}>
                  <Box component="img" src={mentorProfile.banner || "https://images.unsplash.com/photo-1557683316-973673baf926"} sx={{ width: '100%', height: 100, objectFit: 'cover' }} />
                  <Box sx={{ p: 3, textAlign: 'center', mt: -6 }}>
                    <Avatar src={mentorProfile.avatar} sx={{ width: 80, height: 80, mx: 'auto', border: `4px solid ${colors.bg}` }} />
                    <Typography variant="h6" fontWeight={800} mt={1}>{mentorProfile.name}</Typography>
                    <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 700 }}>{user.role.toUpperCase()}</Typography>
                    <Box mt={2} display="flex" flexWrap="wrap" justifyContent="center" gap={0.5}>
                      {mentorProfile.expertise?.slice(0, 3).map((skill, idx) => (
                        <Chip key={idx} label={skill} size="small" sx={{ bgcolor: 'rgba(112,0,255,0.1)', color: colors.accent, border: `1px solid ${colors.accent}`, fontSize: '0.65rem' }} />
                      ))}
                    </Box>
                    <Button fullWidth variant="outlined" sx={{ mt: 3, color: 'white', borderColor: colors.glassBorder, borderRadius: 2 }} component={Link} to="/my-profile" startIcon={<SettingsIcon />}>Edit Profile</Button>
                  </Box>
                </Paper>
              )}

              {/* Recent Chats Section */}
              <Paper sx={glassCardStyle}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={800}>Recent Chats</Typography>
                  <ChatBubbleOutlineIcon sx={{ color: colors.accent, fontSize: 20 }} />
                </Stack>
                {recentChats.length === 0 ? (
                  <Typography variant="caption" sx={{ color: colors.textDim }}>No messages yet.</Typography>
                ) : (
                  <List disablePadding>
                    {recentChats.filter(p => p?.name).map((person) => (
                      <ListItem key={person._id} disableGutters sx={{ cursor: 'pointer', "&:hover": { opacity: 0.7 } }}
                        onClick={() => navigate("/chat", { state: { receiverId: person._id, receiverName: person.name } })}>
                        <Avatar src={person.avatar} sx={{ mr: 2, width: 32, height: 32 }} />
                        <ListItemText primary={person.name} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>

              {/* Student Mentors (Student Only) */}
              {user?.role === "student" && myRequests.some(r => r.status === "accepted") && (
                <Paper sx={glassCardStyle}>
                  <Typography variant="h6" fontWeight={800} mb={2}>Your Mentors</Typography>
                  <List disablePadding>
                    {myRequests.filter(r => r.status === "accepted").map((req, i) => (
                      <ListItem key={i} disableGutters sx={{ mb: 1 }}>
                        <ListItemText primary={req.mentor.name} primaryTypographyProps={{ fontWeight: 700 }} secondary="Connected" secondaryTypographyProps={{ sx: { color: colors.accent, fontSize: '0.7rem' } }} />
                        <Button variant="text" size="small" onClick={() => navigate("/chat", { state: { receiverId: req.mentor._id, receiverName: req.mentor.name } })}>Chat</Button>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;