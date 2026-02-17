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
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import axios from "axios";
import toast from "react-hot-toast";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import PersonIcon from "@mui/icons-material/Person";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

const BASE_URL = "https://startup-backend-1-cj33.onrender.com";

// ─── Inline themed MentorCard (replaces the imported light-theme component) ───
const ThemedMentorCard = ({ mentor, mentorshipStatus, onRequest }) => {
  const colors = {
    accent:      "#7000ff",
    accentGlow:  "rgba(112,0,255,0.18)",
    glass:       "rgba(255,255,255,0.03)",
    border:      "rgba(255,255,255,0.08)",
    borderHover: "rgba(112,0,255,0.5)",
    textDim:     "rgba(255,255,255,0.55)",
  };

  return (
    <Box
      sx={{
        background:     colors.glass,
        border:         `1px solid ${colors.border}`,
        borderRadius:   "16px",
        p:              2.5,
        height:         "100%",
        display:        "flex",
        flexDirection:  "column",
        gap:            1.5,
        transition:     "border-color 0.25s, box-shadow 0.25s",
        "&:hover": {
          borderColor: colors.borderHover,
          boxShadow:   `0 0 28px ${colors.accentGlow}`,
        },
      }}
    >
      {/* Avatar + Name */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={mentor.avatar}
          sx={{
            width:  52,
            height: 52,
            border: `2px solid ${colors.accent}`,
            bgcolor: colors.accent,
            fontSize: "1.2rem",
            fontWeight: 900,
          }}
        >
          {mentor.name?.[0]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography fontWeight={800} fontSize="1rem" color="#fff">
            {mentor.name}
          </Typography>
          <Typography fontSize="0.72rem" sx={{ color: colors.accent, fontWeight: 700, letterSpacing: 1 }}>
            MENTOR
          </Typography>
        </Box>
      </Stack>

      {/* Bio */}
      <Typography
        variant="body2"
        sx={{
          color:      colors.textDim,
          fontSize:   "0.78rem",
          minHeight:  36,
          lineHeight: 1.5,
        }}
      >
        {mentor.about || "No bio added yet."}
      </Typography>

      {/* Expertise chips */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, minHeight: 28 }}>
        {mentor.expertise?.length > 0 ? (
          mentor.expertise.slice(0, 3).map((skill, idx) => (
            <Chip
              key={idx}
              label={skill}
              size="small"
              sx={{
                bgcolor:    "rgba(112,0,255,0.12)",
                color:      colors.accent,
                border:     `1px solid rgba(112,0,255,0.35)`,
                borderRadius: "6px",
                fontSize:   "0.65rem",
                fontWeight: 700,
              }}
            />
          ))
        ) : (
          <Typography fontSize="0.7rem" sx={{ color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>
            No expertise listed
          </Typography>
        )}
      </Box>

      {/* Rating */}
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography fontSize="1rem">⭐</Typography>
        <Typography fontSize="0.8rem" fontWeight={700} color="#fff">
          {mentor.rating || "4.8"}
        </Typography>
      </Stack>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

      {/* Actions */}
      <Stack spacing={1}>
        <Button
          fullWidth
          variant="contained"
          component={Link}
          to={`/mentor/${mentor._id}`}
          endIcon={<OpenInNewIcon sx={{ fontSize: "0.8rem" }} />}
          sx={{
            bgcolor:      colors.accent,
            borderRadius: "8px",
            fontWeight:   800,
            fontSize:     "0.72rem",
            letterSpacing: 1,
            py:           0.9,
            "&:hover":    { bgcolor: "#5a00cc" },
          }}
        >
          VIEW PROFILE
        </Button>

        {mentorshipStatus === "pending" ? (
          <Button
            fullWidth
            variant="outlined"
            disabled
            startIcon={<HourglassEmptyIcon sx={{ fontSize: "0.8rem" }} />}
            sx={{
              borderColor:  "rgba(255,255,255,0.15)",
              color:        "rgba(255,255,255,0.3)",
              borderRadius: "8px",
              fontSize:     "0.72rem",
              letterSpacing: 1,
            }}
          >
            REQUEST SENT
          </Button>
        ) : mentorshipStatus === "accepted" ? (
          <Button
            fullWidth
            variant="outlined"
            disabled
            startIcon={<CheckCircleOutlineIcon sx={{ fontSize: "0.8rem" }} />}
            sx={{
              borderColor:  "rgba(112,0,255,0.3)",
              color:        colors.accent,
              borderRadius: "8px",
              fontSize:     "0.72rem",
              letterSpacing: 1,
            }}
          >
            CONNECTED
          </Button>
        ) : (
          <Button
            fullWidth
            variant="outlined"
            onClick={() => onRequest(mentor._id)}
            sx={{
              borderColor:  colors.accent,
              color:        colors.accent,
              borderRadius: "8px",
              fontWeight:   800,
              fontSize:     "0.72rem",
              letterSpacing: 1,
              py:           0.9,
              "&:hover": {
                bgcolor:     colors.accentGlow,
                borderColor: colors.accent,
              },
            }}
          >
            REQUEST MENTORSHIP
          </Button>
        )}
      </Stack>
    </Box>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [studentRequests, setStudentRequests] = useState([]);
  const [mentorProfile,   setMentorProfile]   = useState(null);
  const [mentors,         setMentors]         = useState([]);
  const [myRequests,      setMyRequests]      = useState([]);
  const [recentChats,     setRecentChats]     = useState([]);

  const user     = JSON.parse(localStorage.getItem("user"));
  const token    = localStorage.getItem("token");
  const navigate = useNavigate();

  const colors = {
    bg:          "#030014",
    accent:      "#7000ff",
    accentGlow:  "rgba(112,0,255,0.15)",
    glass:       "rgba(255, 255, 255, 0.03)",
    glassBorder: "rgba(255, 255, 255, 0.08)",
    textDim:     "rgba(255, 255, 255, 0.6)",
  };

  const glassCard = {
    background:    colors.glass,
    backdropFilter: "blur(12px)",
    border:        `1px solid ${colors.glassBorder}`,
    borderRadius:  "24px",
    p:             3,
    transition:    "border-color 0.25s",
    "&:hover":     { borderColor: colors.accent },
  };

  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    AOS.init({ duration: 900, once: true });

    const fetchData = async () => {
      try {
        if (user?.role === "mentor") {
          const [reqRes, profileRes] = await Promise.all([
            axios.get(`${BASE_URL}/api/mentorship/requests`,  { headers: authHeaders }),
            axios.get(`${BASE_URL}/api/profile/me`,           { headers: authHeaders }),
          ]);
          setStudentRequests(reqRes.data.requests);
          setMentorProfile(profileRes.data);
        } else {
          const [mentorRes, reqRes] = await Promise.all([
            axios.get(`${BASE_URL}/api/mentors`),
            axios.get(`${BASE_URL}/api/mentorship/my-requests`, { headers: authHeaders }),
          ]);
          setMentors(mentorRes.data);
          setMyRequests(reqRes.data.requests || []);
        }

        const chatRes = await axios.get(
          `${BASE_URL}/api/messages/contacts/recent`,
          { headers: authHeaders }
        );
        setRecentChats(chatRes.data);
      } catch {
        toast.error("Failed to load dashboard data");
      }
    };

    fetchData();
  }, [user?.role, token]);

  // Send mentorship request (student)
  const handleRequest = async (mentorId) => {
    try {
      await axios.post(
        `${BASE_URL}/api/mentorship/request`,
        { mentorId },
        { headers: authHeaders }
      );
      toast.success("Request sent!");
      setMyRequests((prev) => [...prev, { mentor: { _id: mentorId }, status: "pending" }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 12, px: { xs: 2, md: 4 }, bgcolor: colors.bg, color: "white" }}>
      <Container maxWidth="xl">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h3" fontWeight={900}
            data-aos="fade-down"
            sx={{
              background:            "linear-gradient(to right, #fff, #b983ff)",
              WebkitBackgroundClip:  "text",
              WebkitTextFillColor:   "transparent",
              letterSpacing:         -1,
            }}
          >
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: colors.textDim, mt: 1 }} data-aos="fade-up">
            Welcome back, {user?.name}.{" "}
            {user?.role === "mentor"
              ? "Manage your mentees and profile."
              : "Explore experts and grow your skills."}
          </Typography>
        </Box>

        {/* ── Quick Nav Bar ────────────────────────────────────────────────── */}
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          justifyContent="center"
          sx={{ mb: 6 }}
          data-aos="fade-up"
        >
          {/* Own Profile */}
          <Button
            component={Link}
            to="/my-profile"
            variant="outlined"
            startIcon={<PersonIcon />}
            sx={{
              borderColor:  colors.glassBorder,
              color:        "white",
              borderRadius: "12px",
              px:           3,
              fontWeight:   700,
              fontSize:     "0.78rem",
              letterSpacing: 0.8,
              "&:hover":    { borderColor: colors.accent, bgcolor: colors.accentGlow },
            }}
          >
            MY PROFILE
          </Button>

          {/* Student History — visible to both roles */}
          <Button
            component={Link}
            to="/student-history"
            variant="outlined"
            startIcon={<HistoryEduIcon />}
            sx={{
              borderColor:  colors.glassBorder,
              color:        "white",
              borderRadius: "12px",
              px:           3,
              fontWeight:   700,
              fontSize:     "0.78rem",
              letterSpacing: 0.8,
              "&:hover":    { borderColor: colors.accent, bgcolor: colors.accentGlow },
            }}
          >
            STUDENT HISTORY
          </Button>

          {/* Chat shortcut */}
          <Button
            component={Link}
            to="/chat"
            variant="outlined"
            startIcon={<ChatBubbleOutlineIcon />}
            sx={{
              borderColor:  colors.glassBorder,
              color:        "white",
              borderRadius: "12px",
              px:           3,
              fontWeight:   700,
              fontSize:     "0.78rem",
              letterSpacing: 0.8,
              "&:hover":    { borderColor: colors.accent, bgcolor: colors.accentGlow },
            }}
          >
            MESSAGES
          </Button>
        </Stack>

        <Grid container spacing={4}>

          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <Grid item xs={12} lg={8}>
            {user?.role === "mentor" ? (
              /* Mentor: student requests */
              <Paper sx={glassCard}>
                <Typography variant="h5" fontWeight={800} mb={3}>
                  Student Requests
                </Typography>
                {studentRequests.length === 0 ? (
                  <Typography sx={{ color: colors.textDim }}>No pending requests.</Typography>
                ) : (
                  <List disablePadding>
                    {studentRequests.map((req, i) => (
                      <ListItem
                        key={i}
                        sx={{
                          bgcolor:      "rgba(255,255,255,0.02)",
                          mb:           2,
                          borderRadius: 3,
                          p:            2,
                          border:       "1px solid rgba(255,255,255,0.05)",
                          justifyContent: "space-between",
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: colors.accent }}>
                            {req.student.name[0]}
                          </Avatar>
                          <ListItemText
                            primary={req.student.name}
                            secondary={req.student.email}
                            secondaryTypographyProps={{ sx: { color: colors.textDim } }}
                          />
                        </Stack>
                        <Button
                          variant="contained" size="small"
                          onClick={() => navigate("/chat", { state: { receiverId: req.student._id, receiverName: req.student.name } })}
                          sx={{ bgcolor: colors.accent, borderRadius: 2 }}
                        >
                          Chat
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            ) : (
              /* Student: explore mentors */
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                  <Typography variant="h5" fontWeight={800}>
                    Explore Mentors
                  </Typography>
                  <Chip
                    label={`${mentors.length} available`}
                    size="small"
                    sx={{
                      bgcolor:  "rgba(112,0,255,0.12)",
                      color:    colors.accent,
                      border:   `1px solid rgba(112,0,255,0.3)`,
                      fontWeight: 700,
                      fontSize: "0.7rem",
                    }}
                  />
                </Stack>

                {mentors.length === 0 ? (
                  <Typography sx={{ color: colors.textDim }}>Finding experts...</Typography>
                ) : (
                  <Grid container spacing={3}>
                    {mentors.map((mentor) => {
                      const status =
                        myRequests.find((req) => req.mentor._id === mentor._id)?.status || null;
                      return (
                        <Grid item xs={12} sm={6} key={mentor._id}>
                          <ThemedMentorCard
                            mentor={mentor}
                            mentorshipStatus={status}
                            onRequest={handleRequest}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>
            )}
          </Grid>

          {/* ── RIGHT COLUMN ────────────────────────────────────────────── */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={4}>

              {/* Mentor profile card */}
              {user?.role === "mentor" && mentorProfile && (
                <Paper sx={{ ...glassCard, p: 0, overflow: "hidden" }}>
                  <Box
                    component="img"
                    src={mentorProfile.banner || "https://images.unsplash.com/photo-1557683316-973673baf926"}
                    sx={{ width: "100%", height: 100, objectFit: "cover" }}
                  />
                  <Box sx={{ p: 3, textAlign: "center", mt: -6 }}>
                    <Avatar
                      src={mentorProfile.avatar}
                      sx={{ width: 80, height: 80, mx: "auto", border: `4px solid ${colors.bg}` }}
                    />
                    <Typography variant="h6" fontWeight={800} mt={1}>
                      {mentorProfile.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 700 }}>
                      {user.role.toUpperCase()}
                    </Typography>
                    <Box mt={2} display="flex" flexWrap="wrap" justifyContent="center" gap={0.5}>
                      {mentorProfile.expertise?.slice(0, 3).map((skill, idx) => (
                        <Chip
                          key={idx} label={skill} size="small"
                          sx={{
                            bgcolor:  "rgba(112,0,255,0.1)",
                            color:    colors.accent,
                            border:   `1px solid ${colors.accent}`,
                            fontSize: "0.65rem",
                          }}
                        />
                      ))}
                    </Box>

                    {/* Profile + History nav */}
                    <Stack spacing={1.5} mt={3}>
                      <Button
                        fullWidth variant="outlined"
                        component={Link} to="/my-profile"
                        startIcon={<SettingsIcon />}
                        sx={{ color: "white", borderColor: colors.glassBorder, borderRadius: 2, fontWeight: 700, "&:hover": { borderColor: colors.accent, bgcolor: colors.accentGlow } }}
                      >
                        Edit Profile
                      </Button>
                      <Button
                        fullWidth variant="outlined"
                        component={Link} to="/student-history"
                        startIcon={<HistoryEduIcon />}
                        sx={{ color: colors.accent, borderColor: "rgba(112,0,255,0.35)", borderRadius: 2, fontWeight: 700, "&:hover": { borderColor: colors.accent, bgcolor: colors.accentGlow } }}
                      >
                        Student History
                      </Button>
                    </Stack>
                  </Box>
                </Paper>
              )}

              {/* Student quick nav card */}
              {user?.role === "student" && (
                <Paper sx={glassCard}>
                  <Typography variant="h6" fontWeight={800} mb={2}>
                    Quick Access
                  </Typography>
                  <Stack spacing={1.5}>
                    <Button
                      fullWidth variant="outlined"
                      component={Link} to="/my-profile"
                      startIcon={<PersonIcon />}
                      sx={{ color: "white", borderColor: colors.glassBorder, borderRadius: 2, fontWeight: 700, justifyContent: "flex-start", px: 2, "&:hover": { borderColor: colors.accent, bgcolor: colors.accentGlow } }}
                    >
                      My Profile
                    </Button>
                    <Button
                      fullWidth variant="outlined"
                      component={Link} to="/student-history"
                      startIcon={<HistoryEduIcon />}
                      sx={{ color: colors.accent, borderColor: "rgba(112,0,255,0.35)", borderRadius: 2, fontWeight: 700, justifyContent: "flex-start", px: 2, "&:hover": { borderColor: colors.accent, bgcolor: colors.accentGlow } }}
                    >
                      Student History
                    </Button>
                  </Stack>
                </Paper>
              )}

              {/* Recent Chats */}
              <Paper sx={glassCard}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={800}>Recent Chats</Typography>
                  <ChatBubbleOutlineIcon sx={{ color: colors.accent, fontSize: 20 }} />
                </Stack>
                {recentChats.length === 0 ? (
                  <Typography variant="caption" sx={{ color: colors.textDim }}>
                    No messages yet.
                  </Typography>
                ) : (
                  <List disablePadding>
                    {recentChats.filter((p) => p?.name).map((person) => (
                      <ListItem
                        key={person._id}
                        disableGutters
                        sx={{ cursor: "pointer", borderRadius: 2, px: 1, "&:hover": { bgcolor: "rgba(112,0,255,0.06)" } }}
                        onClick={() => navigate("/chat", { state: { receiverId: person._id, receiverName: person.name } })}
                      >
                        <Avatar src={person.avatar} sx={{ mr: 2, width: 32, height: 32 }} />
                        <ListItemText
                          primary={person.name}
                          primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>

              {/* Accepted mentors (student) */}
              {user?.role === "student" && myRequests.some((r) => r.status === "accepted") && (
                <Paper sx={glassCard}>
                  <Typography variant="h6" fontWeight={800} mb={2}>Your Mentors</Typography>
                  <List disablePadding>
                    {myRequests.filter((r) => r.status === "accepted").map((req, i) => (
                      <ListItem key={i} disableGutters sx={{ mb: 1 }}>
                        <ListItemText
                          primary={req.mentor.name}
                          primaryTypographyProps={{ fontWeight: 700 }}
                          secondary="Connected"
                          secondaryTypographyProps={{ sx: { color: colors.accent, fontSize: "0.7rem" } }}
                        />
                        <Button
                          variant="text" size="small"
                          onClick={() => navigate("/chat", { state: { receiverId: req.mentor._id, receiverName: req.mentor.name } })}
                          sx={{ color: colors.accent }}
                        >
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