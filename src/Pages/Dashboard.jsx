import {
  Box, Typography, Grid, List, ListItem, ListItemText, Avatar, Chip,
  Button, Container, Paper, Stack, Divider, Tooltip, CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import axios from "axios";
import toast from "react-hot-toast";

import ChatBubbleOutlineIcon  from "@mui/icons-material/ChatBubbleOutline";
import HistoryEduIcon         from "@mui/icons-material/HistoryEdu";
import SchoolIcon             from "@mui/icons-material/School";
import OpenInNewIcon          from "@mui/icons-material/OpenInNew";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon     from "@mui/icons-material/CancelOutlined";
import HourglassEmptyIcon     from "@mui/icons-material/HourglassEmpty";
import PeopleIcon             from "@mui/icons-material/People";
import InboxIcon              from "@mui/icons-material/Inbox";
import StarIcon               from "@mui/icons-material/Star";
import LinkIcon               from "@mui/icons-material/Link";
import BookIcon               from "@mui/icons-material/Book";
import { useUnread }          from "../Context/UnreadContext";

const BASE_URL = "https://startup-backend-1-cj33.onrender.com";

const C = {
  bg:          "#f0f4ff",
  white:       "#ffffff",
  accent:      "#1565c0",
  accentLight: "#1e88e5",
  accentBg:    "rgba(21,101,192,0.07)",
  border:      "rgba(21,101,192,0.14)",
  textDim:     "#546e7a",
  dark:        "#1a237e",
  success:     "#2e7d32",
  successBg:   "rgba(46,125,50,0.08)",
  danger:      "#c62828",
  dangerBg:    "rgba(198,40,40,0.07)",
};

const card = {
  background:   C.white,
  border:       `1px solid ${C.border}`,
  borderRadius: "20px",
  p:            3,
  boxShadow:    "0 4px 24px rgba(21,101,192,0.07)",
};

// ── Mentor Card (Student view) ────────────────────────────────────────────────
const MentorCard = ({ mentor, connectionStatus, onConnect }) => (
  <Box sx={{ ...card, display: "flex", flexDirection: "column", gap: 1.5, height: "100%" }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar src={mentor.avatar}
        sx={{ width: 52, height: 52, bgcolor: C.accent, border: `2px solid ${C.border}`, fontWeight: 900 }}>
        {mentor.name?.[0]?.toUpperCase()}
      </Avatar>
      <Box>
        <Typography fontWeight={800} color={C.dark} fontSize="0.95rem">{mentor.name}</Typography>
        <Typography fontSize="0.68rem" color={C.accentLight} fontWeight={700} letterSpacing={1}>MENTOR</Typography>
      </Box>
    </Stack>

    <Typography variant="body2" sx={{ color: C.textDim, fontSize: "0.78rem", lineHeight: 1.6, minHeight: 36 }}>
      {mentor.about || "No bio added yet."}
    </Typography>

    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, minHeight: 28 }}>
      {mentor.expertise?.length > 0
        ? mentor.expertise.slice(0, 3).map((s, i) => (
          <Chip key={i} label={s} size="small"
            sx={{ bgcolor: C.accentBg, color: C.accent, border: `1px solid ${C.border}`, borderRadius: "6px", fontSize: "0.65rem", fontWeight: 700 }} />
        ))
        : <Typography fontSize="0.68rem" sx={{ color: C.textDim, fontStyle: "italic" }}>No expertise listed</Typography>
      }
    </Box>

    <Stack direction="row" alignItems="center" spacing={0.5}>
      <StarIcon sx={{ fontSize: 16, color: "#ffc107" }} />
      <Typography fontSize="0.78rem" fontWeight={700} color={C.dark}>{mentor.rating || "4.8"}</Typography>
    </Stack>

    <Divider sx={{ borderColor: C.border }} />

    <Stack spacing={1}>
      <Button fullWidth variant="contained" component={Link} to={`/mentor/${mentor._id}`}
        endIcon={<OpenInNewIcon sx={{ fontSize: "0.75rem" }} />}
        sx={{ bgcolor: C.accent, borderRadius: "10px", fontWeight: 800, fontSize: "0.7rem", textTransform: "none",
          "&:hover": { bgcolor: C.accentLight } }}>
        View Profile
      </Button>

      {connectionStatus === "pending" ? (
        <Button fullWidth variant="outlined" disabled startIcon={<HourglassEmptyIcon sx={{ fontSize: "0.75rem" }} />}
          sx={{ borderRadius: "10px", fontSize: "0.7rem", textTransform: "none" }}>
          Request Sent
        </Button>
      ) : connectionStatus === "accepted" ? (
        <Button fullWidth variant="outlined" disabled startIcon={<LinkIcon sx={{ fontSize: "0.75rem" }} />}
          sx={{ borderColor: C.success, color: C.success, borderRadius: "10px", fontSize: "0.7rem", textTransform: "none" }}>
          Connected
        </Button>
      ) : (
        <Button fullWidth variant="outlined" onClick={() => onConnect(mentor._id)}
          startIcon={<LinkIcon sx={{ fontSize: "0.75rem" }} />}
          sx={{ borderColor: C.accent, color: C.accent, borderRadius: "10px", fontWeight: 700, fontSize: "0.7rem",
            textTransform: "none", "&:hover": { bgcolor: C.accentBg } }}>
          Connect
        </Button>
      )}
    </Stack>
  </Box>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
const SectionHead = ({ title, count }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
    <Typography variant="h6" fontWeight={800} color={C.dark}>{title}</Typography>
    {count !== undefined && (
      <Chip label={count} size="small"
        sx={{ bgcolor: C.accentBg, color: C.accent, border: `1px solid ${C.border}`, fontWeight: 800, minWidth: 32 }} />
    )}
  </Stack>
);

const Empty = ({ text }) => (
  <Stack alignItems="center" spacing={1} sx={{ py: 4 }}>
    <InboxIcon sx={{ fontSize: 40, color: C.border }} />
    <Typography variant="body2" color={C.textDim} fontStyle="italic">{text}</Typography>
  </Stack>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [studentRequests,   setStudentRequests]   = useState([]);
  const [mentorProfile,     setMentorProfile]     = useState(null);
  const [mentors,           setMentors]           = useState([]);
  const [myRequests,        setMyRequests]        = useState([]);
  const [recentChats,       setRecentChats]       = useState([]);
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [responding,        setResponding]        = useState({}); // { [requestId]: bool }

  const user        = JSON.parse(localStorage.getItem("user") || "{}");
  const token       = localStorage.getItem("token");
  const navigate    = useNavigate();
  const authHeaders = { Authorization: `Bearer ${token}` };
  const isMentor    = user?.role === "mentor";
  const { unreadBySender, markRead } = useUnread();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const fetchData = async () => {
      try {
        if (isMentor) {
          const [reqRes, profileRes, studentsRes] = await Promise.all([
            axios.get(`${BASE_URL}/api/mentorship/requests`,                { headers: authHeaders }),
            axios.get(`${BASE_URL}/api/profile/me`,                         { headers: authHeaders }),
            axios.get(`${BASE_URL}/api/student-history/connected-students`, { headers: authHeaders }),
          ]);
          setStudentRequests(reqRes.data.requests || []);
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
  }, []); // eslint-disable-line

  // ── Student: send connection request ──────────────────────────────────────
  const handleConnect = async (mentorId) => {
    try {
      await axios.post(`${BASE_URL}/api/mentorship/request`, { mentorId }, { headers: authHeaders });
      toast.success("Connection request sent!");
      setMyRequests((p) => [...p, { mentor: { _id: mentorId }, status: "pending" }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request.");
    }
  };

  // ── Mentor: accept or reject a connection request ────────────────────────
  const handleRespond = async (requestId, status) => {
    setResponding((p) => ({ ...p, [requestId]: true }));
    try {
      await axios.put(
        `${BASE_URL}/api/mentorship/respond/${requestId}`,
        { status },
        { headers: authHeaders }
      );
      toast.success(status === "accepted" ? "✅ Connection accepted!" : "Connection declined.");

      // Update local state immediately
      setStudentRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status } : r))
      );

      // If accepted, add to connected students list
      if (status === "accepted") {
        const accepted = studentRequests.find((r) => r._id === requestId);
        if (accepted?.student) {
          setConnectedStudents((prev) => [...prev, accepted.student]);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to respond.");
    } finally {
      setResponding((p) => ({ ...p, [requestId]: false }));
    }
  };

  const pendingRequests  = studentRequests.filter((r) => r.status === "pending");
  const acceptedRequests = studentRequests.filter((r) => r.status === "accepted");

  const statCards = isMentor
    ? [
      { label: "Pending Connections",   value: pendingRequests.length,    icon: <PeopleIcon />,            color: C.accent },
      { label: "Connected Students",    value: connectedStudents.length,  icon: <SchoolIcon />,            color: "#0d47a1" },
      { label: "Recent Chats",          value: recentChats.length,        icon: <ChatBubbleOutlineIcon />, color: C.accentLight },
    ]
    : [
      { label: "Available Mentors",     value: mentors.length,            icon: <PeopleIcon />,            color: C.accent },
      { label: "My Connections",        value: myRequests.length,         icon: <SchoolIcon />,            color: "#0d47a1" },
      { label: "Recent Chats",          value: recentChats.length,        icon: <ChatBubbleOutlineIcon />, color: C.accentLight },
    ];




  return (
    <Box sx={{ minHeight: "100vh", py: 12, px: { xs: 2, md: 4 }, bgcolor: C.bg }}>
      <Container maxWidth="xl">

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <Box sx={{ mb: 6, textAlign: "center" }} data-aos="fade-down">
          <Typography variant="h3" fontWeight={900} color={C.dark} letterSpacing="-0.02em">
            Dashboard
          </Typography>
          <Typography variant="body1" color={C.textDim} sx={{ mt: 1 }}>
            Welcome back, <strong style={{ color: C.accent }}>{user?.name}</strong>.{" "}
            {isMentor ? "Manage your connections and mentees." : "Connect with experts and grow your skills."}
          </Typography>
        </Box>

        {/* ── STAT CARDS ─────────────────────────────────────────────────── */}
        <Grid container spacing={3} sx={{ mb: 5 }} data-aos="fade-up">
          {statCards.map((s, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Paper sx={{ ...card, display: "flex", alignItems: "center", gap: 2.5, py: 2.5, px: 3 }}>
                <Box sx={{ p: 1.5, borderRadius: "14px", bgcolor: "rgba(21,101,192,0.1)", color: s.color, display: "flex" }}>
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

        {/* ── QUICK NAV ──────────────────────────────────────────────────── */}
        <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center" sx={{ mb: 6 }} data-aos="fade-up">
          {[
            // Students: Student History + Courses
            // Mentors: Courses only
            ...(!isMentor
              ? [
                { label: "Student History", to: "/student-history", icon: <HistoryEduIcon /> },
                { label: "Courses",         to: "/courses",         icon: <BookIcon /> },
              ]
              : [
                { label: "Courses",         to: "/courses",         icon: <BookIcon /> },
              ]
            ),
          ].map((nav) => (
            <Button key={nav.to} component={Link} to={nav.to} variant="outlined" startIcon={nav.icon}
              sx={{ borderColor: C.border, color: C.accent, borderRadius: "14px", px: 3, py: 1,
                fontWeight: 700, fontSize: "0.82rem", textTransform: "none", bgcolor: C.white,
                "&:hover": { borderColor: C.accent, bgcolor: C.accentBg } }}>
              {nav.label}
            </Button>
          ))}
        </Stack>

        {/* ── MAIN GRID ──────────────────────────────────────────────────── */}
        <Grid container spacing={4}>

          {/* ── LEFT ───────────────────────────────────────────────────── */}
          <Grid item xs={12} lg={8}>

            {/* ══ MENTOR: Pending Connection Requests ═══════════════════ */}
            {isMentor && (
              <Paper sx={{ ...card, mb: 4 }} data-aos="fade-up">
                <SectionHead title="Connection Requests" count={pendingRequests.length} />
                {pendingRequests.length === 0 ? (
                  <Empty text="No pending connection requests." />
                ) : (
                  <Stack spacing={2}>
                    {pendingRequests.map((req) => (
                      <Box key={req._id} sx={{
                        display: "flex", alignItems: "center", gap: 2,
                        p: 2, bgcolor: C.accentBg, borderRadius: "14px",
                        border: `1px solid ${C.border}`, flexWrap: "wrap",
                      }}>
                        <Avatar src={req.student?.avatar}
                          sx={{ bgcolor: C.accent, width: 44, height: 44, fontWeight: 900 }}>
                          {req.student?.name?.[0]}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography fontWeight={800} color={C.dark} fontSize="0.9rem" noWrap>
                            {req.student?.name}
                          </Typography>
                          <Typography variant="caption" color={C.textDim} noWrap>
                            {req.student?.email} · wants to connect with you
                          </Typography>
                        </Box>

                        {/* Accept / Decline */}
                        <Stack direction="row" spacing={1} flexShrink={0}>
                          <Button variant="contained" size="small"
                            disabled={responding[req._id]}
                            onClick={() => handleRespond(req._id, "accepted")}
                            startIcon={responding[req._id]
                              ? <CircularProgress size={12} color="inherit" />
                              : <CheckCircleOutlineIcon sx={{ fontSize: "0.85rem" }} />
                            }
                            sx={{ bgcolor: C.success, borderRadius: "10px", textTransform: "none", fontWeight: 700,
                              fontSize: "0.72rem", "&:hover": { bgcolor: "#1b5e20" } }}>
                            Accept
                          </Button>
                          <Button variant="outlined" size="small"
                            disabled={responding[req._id]}
                            onClick={() => handleRespond(req._id, "rejected")}
                            startIcon={<CancelOutlinedIcon sx={{ fontSize: "0.85rem" }} />}
                            sx={{ borderColor: C.danger, color: C.danger, borderRadius: "10px", textTransform: "none",
                              fontWeight: 700, fontSize: "0.72rem", "&:hover": { bgcolor: C.dangerBg } }}>
                            Decline
                          </Button>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Paper>
            )}

            {/* ══ MENTOR: Connected Students ════════════════════════════ */}
            {isMentor && (
              <Paper sx={{ ...card }} data-aos="fade-up">
                <SectionHead title="Connected Students" count={connectedStudents.length} />
                {connectedStudents.length === 0 ? (
                  <Empty text="No connected students yet. Accept a connection request to get started." />
                ) : (
                  <Stack spacing={1.5}>
                    {connectedStudents.map((student, i) => (
                      <Box key={i} sx={{
                        display: "flex", alignItems: "center", gap: 2,
                        p: 2, bgcolor: C.successBg, borderRadius: "14px",
                        border: "1px solid rgba(46,125,50,0.15)", flexWrap: "wrap",
                      }}>
                        <Avatar src={student.avatar}
                          sx={{ bgcolor: C.accent, width: 44, height: 44, fontWeight: 900 }}>
                          {student.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography fontWeight={800} color={C.dark} fontSize="0.9rem" noWrap>
                              {student.name || "Unknown"}
                            </Typography>
                            <CheckCircleOutlineIcon sx={{ fontSize: 14, color: C.success }} />
                          </Stack>
                          <Typography variant="caption" color={C.textDim} noWrap>
                            {student.department || student.email}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} flexShrink={0}>
                          <Tooltip title="View Academic History">
                            <Button variant="outlined" size="small"
                              startIcon={<HistoryEduIcon sx={{ fontSize: "0.8rem" }} />}
                              onClick={() => navigate(`/student-history/${student._id}`)}
                              sx={{ borderColor: C.border, color: C.accent, borderRadius: "10px",
                                textTransform: "none", fontWeight: 700, fontSize: "0.72rem",
                                "&:hover": { borderColor: C.accent, bgcolor: C.accentBg } }}>
                              History
                            </Button>
                          </Tooltip>
                          <Button variant="contained" size="small"
                            onClick={() => navigate("/chat", { state: { receiverId: student._id, receiverName: student.name } })}
                            sx={{ bgcolor: C.accent, borderRadius: "10px", textTransform: "none",
                              fontWeight: 700, fontSize: "0.72rem", "&:hover": { bgcolor: C.accentLight } }}>
                            Chat
                          </Button>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Paper>
            )}

            {/* ══ STUDENT: Explore Mentors ══════════════════════════════ */}
            {!isMentor && (
              <Box data-aos="fade-up">
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={800} color={C.dark}>Find a Mentor</Typography>
                  <Chip label={`${mentors.length} available`} size="small"
                    sx={{ bgcolor: C.accentBg, color: C.accent, border: `1px solid ${C.border}`, fontWeight: 700 }} />
                </Stack>
                {mentors.length === 0 ? (
                  <Empty text="Finding experts..." />
                ) : (
                  <Grid container spacing={3}>
                    {mentors.map((mentor) => {
                      const req    = myRequests.find((r) => r.mentor?._id === mentor._id || r.mentor === mentor._id);
                      const status = req?.status || null;
                      return (
                        <Grid item xs={12} sm={6} md={4} key={mentor._id}>
                          <MentorCard mentor={mentor} connectionStatus={status} onConnect={handleConnect} />
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>
            )}
          </Grid>

          {/* ── RIGHT SIDEBAR ──────────────────────────────────────────── */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={4}>

              {/* Mentor own profile mini-card */}
              {isMentor && mentorProfile && (
                <Paper sx={{ ...card, p: 0, overflow: "hidden" }} data-aos="fade-left">
                  <Box sx={{
                    height: 100,
                    background: mentorProfile.banner
                      ? `url(${mentorProfile.banner}) center/cover`
                      : `linear-gradient(135deg, ${C.dark} 0%, ${C.accent} 60%, ${C.accentLight} 100%)`,
                  }} />
                  <Box sx={{ p: 3, pt: 0, textAlign: "center", mt: -6 }}>
                    <Avatar src={mentorProfile.avatar}
                      sx={{ width: 80, height: 80, mx: "auto", border: `4px solid ${C.white}`, bgcolor: C.accent,
                        boxShadow: "0 4px 16px rgba(21,101,192,0.3)", fontWeight: 900 }}>
                      {mentorProfile.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Typography variant="h6" fontWeight={900} color={C.dark} mt={1}>{mentorProfile.name}</Typography>
                    <Chip label="MENTOR" size="small"
                      sx={{ bgcolor: C.accentBg, color: C.accent, fontWeight: 800, mt: 0.5, borderRadius: "8px" }} />
                    <Box mt={1.5} display="flex" flexWrap="wrap" justifyContent="center" gap={0.5}>
                      {mentorProfile.expertise?.slice(0, 4).map((s, i) => (
                        <Chip key={i} label={s} size="small"
                          sx={{ bgcolor: C.accentBg, color: C.accent, border: `1px solid ${C.border}`, fontSize: "0.65rem" }} />
                      ))}
                    </Box>
                    <Stack spacing={1.5} mt={3}>
                      <Button fullWidth variant="outlined" component={Link} to="/my-profile"
                        sx={{ color: C.accent, borderColor: C.border, borderRadius: "12px", fontWeight: 700,
                          textTransform: "none", "&:hover": { borderColor: C.accent, bgcolor: C.accentBg } }}>
                        Edit Profile
                      </Button>
                    </Stack>
                  </Box>
                </Paper>
              )}

              {/* Student quick access — Courses + History only (no profile/messages) */}
              {!isMentor && (
                <Paper sx={card} data-aos="fade-left">
                  <SectionHead title="Quick Access" />
                  <Stack spacing={1.5}>
                    <Button fullWidth variant="contained" component={Link} to="/student-history"
                      startIcon={<HistoryEduIcon />}
                      sx={{ bgcolor: C.accent, borderRadius: "12px", fontWeight: 700, textTransform: "none",
                        justifyContent: "flex-start", px: 2, "&:hover": { bgcolor: C.accentLight } }}>
                      My Student History
                    </Button>
                    <Button fullWidth variant="outlined" component={Link} to="/courses"
                      startIcon={<BookIcon />}
                      sx={{ color: C.accent, borderColor: C.border, borderRadius: "12px", fontWeight: 700,
                        textTransform: "none", justifyContent: "flex-start", px: 2,
                        "&:hover": { borderColor: C.accent, bgcolor: C.accentBg } }}>
                      My Courses
                    </Button>
                  </Stack>
                </Paper>
              )}

              {/* Recent Chats */}
              <Paper sx={card} data-aos="fade-left">
                <SectionHead title="Recent Chats" count={recentChats.length} />
                {recentChats.length === 0 ? (
                  <Empty text="No messages yet." />
                ) : (
                  <Stack spacing={0.5}>
                    {recentChats.filter((p) => p?.name).map((person) => {
                      const unread = unreadBySender[person._id] || 0;
                      return (
                        <Box key={person._id}
                          sx={{
                            display: "flex", alignItems: "center", gap: 1.5,
                            p: 1.2, borderRadius: "12px", cursor: "pointer",
                            position: "relative",
                            bgcolor: unread > 0 ? "rgba(21,101,192,0.06)" : "transparent",
                            border: unread > 0 ? `1px solid ${C.border}` : "1px solid transparent",
                            "&:hover": { bgcolor: C.accentBg },
                            transition: "all 0.2s",
                          }}
                          onClick={() => {
                            markRead(person._id);
                            navigate("/chat", { state: { receiverId: person._id, receiverName: person.name } });
                          }}>
                          <Box sx={{ position: "relative" }}>
                            <Avatar src={person.avatar}
                              sx={{ width: 38, height: 38, bgcolor: C.accent, fontWeight: 900, fontSize: 14 }}>
                              {person.name?.[0]?.toUpperCase()}
                            </Avatar>
                            {unread > 0 && (
                              <Box sx={{
                                position: "absolute", top: -4, right: -4,
                                width: 18, height: 18, borderRadius: "50%",
                                bgcolor: "#e53935", border: "2px solid #fff",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                <Typography sx={{ fontSize: "0.52rem", color: "#fff", fontWeight: 900, lineHeight: 1 }}>
                                  {unread > 9 ? "9+" : unread}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={unread > 0 ? 800 : 600} color={C.dark} noWrap>
                              {person.name}
                            </Typography>
                            {unread > 0 && (
                              <Typography variant="caption" color={C.accent} fontWeight={700}>
                                {unread} new message{unread > 1 ? "s" : ""}
                              </Typography>
                            )}
                          </Box>
                          <ChatBubbleOutlineIcon sx={{ color: unread > 0 ? C.accent : C.border, fontSize: 16, flexShrink: 0 }} />
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </Paper>

              {/* Student: connected mentors */}
              {!isMentor && myRequests.some((r) => r.status === "accepted") && (
                <Paper sx={card} data-aos="fade-left">
                  <SectionHead title="Your Connections" />
                  <Stack spacing={1}>
                    {myRequests.filter((r) => r.status === "accepted").map((req, i) => (
                      <Box key={i} sx={{
                        display: "flex", alignItems: "center", gap: 1.5, p: 1.5,
                        bgcolor: C.successBg, border: "1px solid rgba(46,125,50,0.15)", borderRadius: "12px",
                      }}>
                        <Avatar src={req.mentor?.avatar}
                          sx={{ width: 36, height: 36, bgcolor: C.accent, fontSize: 14, fontWeight: 900 }}>
                          {req.mentor?.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography fontWeight={700} color={C.dark} fontSize="0.88rem" noWrap>
                            {req.mentor?.name}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <CheckCircleOutlineIcon sx={{ fontSize: 12, color: C.success }} />
                            <Typography variant="caption" color={C.success} fontWeight={700}>Connected</Typography>
                          </Stack>
                        </Box>
                        <Button variant="text" size="small"
                          onClick={() => navigate("/chat", { state: { receiverId: req.mentor._id, receiverName: req.mentor.name } })}
                          sx={{ color: C.accent, textTransform: "none", fontWeight: 700, fontSize: "0.75rem", flexShrink: 0 }}>
                          Chat
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              )}

              {/* Student: pending connections summary */}
              {!isMentor && myRequests.some((r) => r.status === "pending") && (
                <Paper sx={card} data-aos="fade-left">
                  <SectionHead title="Pending Requests" />
                  <Stack spacing={1}>
                    {myRequests.filter((r) => r.status === "pending").map((req, i) => (
                      <Box key={i} sx={{
                        display: "flex", alignItems: "center", gap: 1.5, p: 1.5,
                        bgcolor: C.accentBg, border: `1px solid ${C.border}`, borderRadius: "12px",
                      }}>
                        <HourglassEmptyIcon sx={{ color: C.textDim, fontSize: 18 }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography fontWeight={700} color={C.dark} fontSize="0.85rem" noWrap>
                            {req.mentor?.name}
                          </Typography>
                          <Typography variant="caption" color={C.textDim}>Awaiting mentor response</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
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