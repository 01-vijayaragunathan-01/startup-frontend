import {
  Box, Typography, Grid, List, ListItem, ListItemText, Avatar, Chip,
  Button, Container, Paper, Stack, Divider, IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import axios from "axios";
import toast from "react-hot-toast";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import PersonIcon from "@mui/icons-material/Person";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";

const BASE_URL = "https://startup-backend-1-cj33.onrender.com";

const C = {
  bg: "#f0f4ff",
  white: "#ffffff",
  accent: "#1565c0",
  accentLight: "#1e88e5",
  accentBg: "rgba(21,101,192,0.07)",
  border: "rgba(21,101,192,0.14)",
  textDim: "#546e7a",
  dark: "#1a237e",
};

const card = {
  background: C.white,
  border: `1px solid ${C.border}`,
  borderRadius: "20px",
  p: 3,
  boxShadow: "0 4px 24px rgba(21,101,192,0.07)",
  transition: "border-color 0.2s, box-shadow 0.2s",
  "&:hover": { borderColor: C.accent, boxShadow: "0 8px 32px rgba(21,101,192,0.14)" },
};

// Themed mentor card for white/blue theme
const MentorCard = ({ mentor, mentorshipStatus, onRequest }) => (
  <Box sx={{
    ...card,
    display: "flex", flexDirection: "column", gap: 1.5, height: "100%",
  }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar src={mentor.avatar} sx={{ width: 52, height: 52, bgcolor: C.accent, border: `2px solid ${C.accent}`, fontWeight: 900 }}>
        {mentor.name?.[0]?.toUpperCase()}
      </Avatar>
      <Box>
        <Typography fontWeight={800} color={C.dark}>{mentor.name}</Typography>
        <Typography fontSize="0.72rem" color={C.accentLight} fontWeight={700} letterSpacing={1}>MENTOR</Typography>
      </Box>
    </Stack>

    <Typography variant="body2" sx={{ color: C.textDim, fontSize: "0.78rem", minHeight: 36, lineHeight: 1.5 }}>
      {mentor.about || "No bio added yet."}
    </Typography>

    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, minHeight: 28 }}>
      {mentor.expertise?.length > 0
        ? mentor.expertise.slice(0, 3).map((s, i) => (
          <Chip key={i} label={s} size="small" sx={{ bgcolor: C.accentBg, color: C.accent, border: `1px solid ${C.border}`, borderRadius: "6px", fontSize: "0.65rem", fontWeight: 700 }} />
        ))
        : <Typography fontSize="0.7rem" sx={{ color: C.textDim, fontStyle: "italic" }}>No expertise listed</Typography>}
    </Box>

    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Typography fontSize="1rem">⭐</Typography>
      <Typography fontSize="0.8rem" fontWeight={700} color={C.dark}>{mentor.rating || "4.8"}</Typography>
    </Stack>

    <Divider sx={{ borderColor: C.border }} />

    <Stack spacing={1}>
      <Button fullWidth variant="contained" component={Link} to={`/mentor/${mentor._id}`} endIcon={<OpenInNewIcon sx={{ fontSize: "0.8rem" }} />}
        sx={{ bgcolor: C.accent, borderRadius: "10px", fontWeight: 800, fontSize: "0.72rem", textTransform: "none", "&:hover": { bgcolor: C.accentLight } }}>
        View Profile
      </Button>

      {mentorshipStatus === "pending" ? (
        <Button fullWidth variant="outlined" disabled startIcon={<HourglassEmptyIcon sx={{ fontSize: "0.8rem" }} />}
          sx={{ borderRadius: "10px", fontSize: "0.72rem", textTransform: "none" }}>
          Request Sent
        </Button>
      ) : mentorshipStatus === "accepted" ? (
        <Button fullWidth variant="outlined" disabled startIcon={<CheckCircleOutlineIcon sx={{ fontSize: "0.8rem" }} />}
          sx={{ borderColor: C.accent, color: C.accent, borderRadius: "10px", fontSize: "0.72rem", textTransform: "none" }}>
          Connected
        </Button>
      ) : (
        <Button fullWidth variant="outlined" onClick={() => onRequest(mentor._id)}
          sx={{ borderColor: C.accent, color: C.accent, borderRadius: "10px", fontWeight: 700, fontSize: "0.72rem", textTransform: "none", "&:hover": { bgcolor: C.accentBg } }}>
          Request Mentorship
        </Button>
      )}
    </Stack>
  </Box>
);

const Dashboard = () => {
  const [studentRequests, setStudentRequests] = useState([]);
  const [mentorProfile,   setMentorProfile]   = useState(null);
  const [mentors,         setMentors]         = useState([]);
  const [myRequests,      setMyRequests]      = useState([]);
  const [recentChats,     setRecentChats]     = useState([]);
  const [connectedStudents, setConnectedStudents] = useState([]);

  const user     = JSON.parse(localStorage.getItem("user") || "{}");
  const token    = localStorage.getItem("token");
  const navigate = useNavigate();
  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const fetchData = async () => {
      try {
        if (user?.role === "mentor") {
          const [reqRes, profileRes, studentsRes] = await Promise.all([
            axios.get(`${BASE_URL}/api/mentorship/requests`,               { headers: authHeaders }),
            axios.get(`${BASE_URL}/api/profile/me`,                        { headers: authHeaders }),
            axios.get(`${BASE_URL}/api/student-history/connected-students`, { headers: authHeaders }),
          ]);
          setStudentRequests(reqRes.data.requests);
          setMentorProfile(profileRes.data);
          setConnectedStudents(studentsRes.data.data || []);
        } else {
          const [mentorRes, reqRes] = await Promise.all([
            axios.get(`${BASE_URL}/api/mentors`),
            axios.get(`${BASE_URL}/api/mentorship/my-requests`, { headers: authHeaders }),
          ]);
          setMentors(mentorRes.data);
          setMyRequests(reqRes.data.requests || []);
        }
        const chatRes = await axios.get(`${BASE_URL}/api/messages/contacts/recent`, { headers: authHeaders });
        setRecentChats(chatRes.data);
      } catch {
        toast.error("Failed to load dashboard data");
      }
    };
    fetchData();
  }, []);

  const handleRequest = async (mentorId) => {
    try {
      await axios.post(`${BASE_URL}/api/mentorship/request`, { mentorId }, { headers: authHeaders });
      toast.success("Request sent!");
      setMyRequests((p) => [...p, { mentor: { _id: mentorId }, status: "pending" }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request.");
    }
  };

  const statCards = user?.role === "mentor"
    ? [
      { label: "Student Requests", value: studentRequests.length, icon: <PeopleIcon />, color: C.accent },
      { label: "Connected Students", value: connectedStudents.length, icon: <SchoolIcon />, color: "#0d47a1" },
      { label: "Recent Chats", value: recentChats.length, icon: <ChatBubbleOutlineIcon />, color: C.accentLight },
    ]
    : [
      { label: "Available Mentors", value: mentors.length, icon: <PeopleIcon />, color: C.accent },
      { label: "My Requests", value: myRequests.length, icon: <SchoolIcon />, color: "#0d47a1" },
      { label: "Recent Chats", value: recentChats.length, icon: <ChatBubbleOutlineIcon />, color: C.accentLight },
    ];

  return (
    <Box sx={{ minHeight: "100vh", py: 12, px: { xs: 2, md: 4 }, bgcolor: C.bg }}>
      <Container maxWidth="xl">

        {/* Header */}
        <Box sx={{ mb: 5, textAlign: "center" }} data-aos="fade-down">
          <Typography variant="h3" fontWeight={900} sx={{ color: C.dark, letterSpacing: -1 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: C.textDim, mt: 1 }}>
            Welcome back, <strong style={{ color: C.accent }}>{user?.name}</strong>.{" "}
            {user?.role === "mentor" ? "Manage your mentees and profile." : "Explore experts and grow your skills."}
          </Typography>
        </Box>

        {/* Stat Cards */}
        <Grid container spacing={3} sx={{ mb: 5 }} data-aos="fade-up">
          {statCards.map((s, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Paper sx={{ ...card, display: "flex", alignItems: "center", gap: 2, px: 3, py: 2.5 }}>
                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: "rgba(21,101,192,0.1)", color: s.color, display: "flex" }}>
                  {s.icon}
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} color={C.dark}>{s.value}</Typography>
                  <Typography variant="caption" color={C.textDim} fontWeight={600}>{s.label}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Quick Nav */}
        <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center" sx={{ mb: 5 }} data-aos="fade-up">
          {[
            { label: "My Profile", to: "/my-profile", icon: <PersonIcon /> },
            { label: "Student History", to: "/student-history", icon: <HistoryEduIcon /> },
            { label: "Messages", to: "/chat", icon: <ChatBubbleOutlineIcon /> },
          ].map((nav) => (
            <Button key={nav.to} component={Link} to={nav.to} variant="outlined" startIcon={nav.icon}
              sx={{ borderColor: C.border, color: C.accent, borderRadius: "14px", px: 3, fontWeight: 700,
                fontSize: "0.82rem", textTransform: "none", bgcolor: C.white,
                "&:hover": { borderColor: C.accent, bgcolor: C.accentBg } }}>
              {nav.label}
            </Button>
          ))}
        </Stack>

        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            {user?.role === "mentor" ? (
              <Paper sx={card}>
                <Typography variant="h5" fontWeight={800} color={C.dark} mb={3}>Student Requests</Typography>
                {studentRequests.length === 0 ? (
                  <Typography sx={{ color: C.textDim }}>No pending requests.</Typography>
                ) : (
                  <List disablePadding>
                    {studentRequests.map((req, i) => (
                      <ListItem key={i} sx={{
                        bgcolor: C.accentBg, mb: 2, borderRadius: 3, p: 2,
                        border: `1px solid ${C.border}`, justifyContent: "space-between",
                      }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: C.accent }}>{req.student.name?.[0]}</Avatar>
                          <ListItemText
                            primary={req.student.name}
                            primaryTypographyProps={{ fontWeight: 700, color: C.dark }}
                            secondary={req.student.email}
                            secondaryTypographyProps={{ sx: { color: C.textDim } }}
                          />
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Button variant="contained" size="small"
                            onClick={() => navigate("/chat", { state: { receiverId: req.student._id, receiverName: req.student.name } })}
                            sx={{ bgcolor: C.accent, borderRadius: 2, textTransform: "none" }}>
                            Chat
                          </Button>
                        </Stack>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            ) : (
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                  <Typography variant="h5" fontWeight={800} color={C.dark}>Explore Mentors</Typography>
                  <Chip label={`${mentors.length} available`} size="small"
                    sx={{ bgcolor: C.accentBg, color: C.accent, border: `1px solid ${C.border}`, fontWeight: 700 }} />
                </Stack>
                {mentors.length === 0 ? (
                  <Typography sx={{ color: C.textDim }}>Finding experts...</Typography>
                ) : (
                  <Grid container spacing={3}>
                    {mentors.map((mentor) => {
                      const status = myRequests.find((r) => r.mentor._id === mentor._id)?.status || null;
                      return (
                        <Grid item xs={12} sm={6} key={mentor._id}>
                          <MentorCard mentor={mentor} mentorshipStatus={status} onRequest={handleRequest} />
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>
            )}
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={4}>
              {/* Mentor Profile Card */}
              {user?.role === "mentor" && mentorProfile && (
                <Paper sx={{ ...card, p: 0, overflow: "hidden" }}>
                  <Box sx={{
                    height: 100, bgcolor: C.accentBg,
                    background: mentorProfile.banner ? `url(${mentorProfile.banner}) center/cover` : `linear-gradient(135deg, ${C.accent} 0%, ${C.accentLight} 100%)`,
                  }} />
                  <Box sx={{ p: 3, textAlign: "center", mt: -6 }}>
                    <Avatar src={mentorProfile.avatar}
                      sx={{ width: 80, height: 80, mx: "auto", border: `4px solid ${C.white}`, bgcolor: C.accent, boxShadow: "0 4px 14px rgba(21,101,192,0.3)" }} />
                    <Typography variant="h6" fontWeight={800} mt={1} color={C.dark}>{mentorProfile.name}</Typography>
                    <Chip label="MENTOR" size="small" sx={{ bgcolor: C.accentBg, color: C.accent, fontWeight: 800, mt: 0.5 }} />
                    <Box mt={2} display="flex" flexWrap="wrap" justifyContent="center" gap={0.5}>
                      {mentorProfile.expertise?.slice(0, 3).map((s, i) => (
                        <Chip key={i} label={s} size="small" sx={{ bgcolor: C.accentBg, color: C.accent, border: `1px solid ${C.border}`, fontSize: "0.65rem" }} />
                      ))}
                    </Box>
                    <Stack spacing={1.5} mt={3}>
                      <Button fullWidth variant="outlined" component={Link} to="/my-profile"
                        sx={{ color: C.accent, borderColor: C.border, borderRadius: 2, fontWeight: 700, textTransform: "none", "&:hover": { borderColor: C.accent, bgcolor: C.accentBg } }}>
                        Edit Profile
                      </Button>
                      <Button fullWidth variant="contained" component={Link} to="/student-history"
                        sx={{ bgcolor: C.accent, borderRadius: 2, fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: C.accentLight } }}>
                        Student History
                      </Button>
                    </Stack>
                  </Box>
                </Paper>
              )}

              {/* Connected Students (Mentor) */}
              {user?.role === "mentor" && connectedStudents.length > 0 && (
                <Paper sx={card}>
                  <Typography variant="h6" fontWeight={800} color={C.dark} mb={2}>
                    Connected Students
                  </Typography>
                  <List disablePadding sx={{ maxHeight: 280, overflowY: "auto" }}>
                    {connectedStudents.map((student, i) => (
                      <ListItem key={i} disableGutters
                        sx={{ cursor: "pointer", borderRadius: 2, px: 1, py: 0.5, "&:hover": { bgcolor: C.accentBg } }}
                        onClick={() => navigate(`/student-history/${student._id}`)}>
                        <Avatar src={student.avatar} sx={{ mr: 1.5, width: 32, height: 32, bgcolor: C.accent, fontSize: 14 }}>
                          {student.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <ListItemText
                          primary={student.name || "Unnamed"}
                          secondary={student.department || student.email}
                          primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: 700, color: C.dark }}
                          secondaryTypographyProps={{ fontSize: "0.68rem", color: C.textDim }}
                        />
                        <HistoryEduIcon sx={{ color: C.accentLight, fontSize: 18 }} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}

              {/* Student Quick Access */}
              {user?.role === "student" && (
                <Paper sx={card}>
                  <Typography variant="h6" fontWeight={800} color={C.dark} mb={2}>Quick Access</Typography>
                  <Stack spacing={1.5}>
                    <Button fullWidth variant="outlined" component={Link} to="/my-profile" startIcon={<PersonIcon />}
                      sx={{ color: C.accent, borderColor: C.border, borderRadius: 2, fontWeight: 700, textTransform: "none", justifyContent: "flex-start", px: 2, "&:hover": { borderColor: C.accent, bgcolor: C.accentBg } }}>
                      My Profile
                    </Button>
                    <Button fullWidth variant="contained" component={Link} to="/student-history" startIcon={<HistoryEduIcon />}
                      sx={{ bgcolor: C.accent, borderRadius: 2, fontWeight: 700, textTransform: "none", justifyContent: "flex-start", px: 2, "&:hover": { bgcolor: C.accentLight } }}>
                      Student History
                    </Button>
                  </Stack>
                </Paper>
              )}

              {/* Recent Chats */}
              <Paper sx={card}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={800} color={C.dark}>Recent Chats</Typography>
                  <ChatBubbleOutlineIcon sx={{ color: C.accent, fontSize: 20 }} />
                </Stack>
                {recentChats.length === 0 ? (
                  <Typography variant="caption" sx={{ color: C.textDim }}>No messages yet.</Typography>
                ) : (
                  <List disablePadding>
                    {recentChats.filter((p) => p?.name).map((person) => (
                      <ListItem key={person._id} disableGutters
                        sx={{ cursor: "pointer", borderRadius: 2, px: 1, "&:hover": { bgcolor: C.accentBg } }}
                        onClick={() => navigate("/chat", { state: { receiverId: person._id, receiverName: person.name } })}>
                        <Avatar src={person.avatar} sx={{ mr: 2, width: 32, height: 32 }} />
                        <ListItemText primary={person.name} primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600, color: C.dark }} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>

              {/* Accepted Mentors (Student) */}
              {user?.role === "student" && myRequests.some((r) => r.status === "accepted") && (
                <Paper sx={card}>
                  <Typography variant="h6" fontWeight={800} color={C.dark} mb={2}>Your Mentors</Typography>
                  <List disablePadding>
                    {myRequests.filter((r) => r.status === "accepted").map((req, i) => (
                      <ListItem key={i} disableGutters sx={{ mb: 1 }}>
                        <ListItemText
                          primary={req.mentor.name}
                          primaryTypographyProps={{ fontWeight: 700, color: C.dark }}
                          secondary="Connected"
                          secondaryTypographyProps={{ sx: { color: C.accentLight, fontSize: "0.7rem" } }}
                        />
                        <Button variant="text" size="small"
                          onClick={() => navigate("/chat", { state: { receiverId: req.mentor._id, receiverName: req.mentor.name } })}
                          sx={{ color: C.accent, textTransform: "none", fontWeight: 700 }}>
                          Chat
                        </Button>
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