import {
  Box, Typography, Grid, Avatar, Chip, Button, Container,
  Paper, Stack, Divider, Tooltip, CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import ChatBubbleOutlineIcon  from "@mui/icons-material/ChatBubbleOutline";
import HistoryEduIcon         from "@mui/icons-material/HistoryEdu";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon     from "@mui/icons-material/CancelOutlined";
import HourglassEmptyIcon     from "@mui/icons-material/HourglassEmpty";
import PeopleIcon             from "@mui/icons-material/People";
import SchoolIcon             from "@mui/icons-material/School";
import InboxIcon              from "@mui/icons-material/Inbox";
import StarIcon               from "@mui/icons-material/Star";
import LinkIcon               from "@mui/icons-material/Link";
import OpenInNewIcon          from "@mui/icons-material/OpenInNew";
import { useUnread }          from "../Context/UnreadContext";

const BASE_URL = "https://startup-backend-1-cj33.onrender.com";

/* ── Design tokens ────────────────────────────────────────────────────────── */
const C = {
  bg:        "#f0f4ff",
  white:     "#ffffff",
  accent:    "#1565c0",
  accentL:   "#1e88e5",
  accentBg:  "rgba(21,101,192,0.07)",
  border:    "rgba(21,101,192,0.14)",
  textDim:   "#546e7a",
  dark:      "#1a237e",
  success:   "#2e7d32",
  successBg: "rgba(46,125,50,0.08)",
  danger:    "#c62828",
  dangerBg:  "rgba(198,40,40,0.07)",
};

const panel = {
  bgcolor: C.white, border: `1px solid ${C.border}`,
  borderRadius: "20px", p: 3,
  boxShadow: "0 4px 24px rgba(21,101,192,0.07)",
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
const SectionHead = ({ title, count }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
    <Typography variant="h6" fontWeight={800} color={C.dark} fontSize="1rem">{title}</Typography>
    {count !== undefined && (
      <Chip label={count} size="small"
        sx={{ bgcolor: C.accentBg, color: C.accent, border: `1px solid ${C.border}`, fontWeight: 800, minWidth: 28, height: 22 }} />
    )}
  </Stack>
);

const Empty = ({ text }) => (
  <Stack alignItems="center" spacing={1} sx={{ py: 5 }}>
    <InboxIcon sx={{ fontSize: 38, color: C.border }} />
    <Typography variant="body2" color={C.textDim} fontStyle="italic" textAlign="center">{text}</Typography>
  </Stack>
);

/* ── Mentor Card (student view only) ─────────────────────────────────────── */
const MentorCard = ({ mentor, status, onConnect }) => (
  <Box sx={{
    ...panel, p: 2.5, display: "flex", flexDirection: "column", gap: 1.5,
    height: "100%", transition: "all 0.2s",
    "&:hover": { borderColor: C.accent, boxShadow: "0 8px 32px rgba(21,101,192,0.12)" },
  }}>
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar src={mentor.avatar}
        sx={{ width: 46, height: 46, bgcolor: C.accent, fontWeight: 900, border: `2px solid ${C.border}` }}>
        {mentor.name?.[0]?.toUpperCase()}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography fontWeight={800} color={C.dark} fontSize="0.88rem" noWrap>{mentor.name}</Typography>
        <Typography fontSize="0.62rem" color={C.accentL} fontWeight={700} letterSpacing={1.5}>MENTOR</Typography>
      </Box>
    </Stack>

    <Typography variant="body2" sx={{ color: C.textDim, fontSize: "0.75rem", lineHeight: 1.6,
      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
      {mentor.about || "No bio added yet."}
    </Typography>

    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {mentor.expertise?.length > 0
        ? mentor.expertise.slice(0, 3).map((s, i) => (
          <Chip key={i} label={s} size="small"
            sx={{ bgcolor: C.accentBg, color: C.accent, border: `1px solid ${C.border}`,
              borderRadius: "6px", fontSize: "0.6rem", fontWeight: 700, height: 20 }} />
        ))
        : <Typography fontSize="0.65rem" sx={{ color: C.textDim, fontStyle: "italic" }}>No expertise listed</Typography>
      }
    </Box>

    <Stack direction="row" alignItems="center" spacing={0.5}>
      <StarIcon sx={{ fontSize: 14, color: "#ffc107" }} />
      <Typography fontSize="0.75rem" fontWeight={700} color={C.dark}>{mentor.rating || "4.8"}</Typography>
    </Stack>

    <Divider sx={{ borderColor: C.border }} />

    {/* Actions */}
    <Stack spacing={0.8}>
      <Button fullWidth variant="contained" component={Link} to={`/mentor/${mentor._id}`}
        size="small" endIcon={<OpenInNewIcon sx={{ fontSize: "0.7rem" }} />}
        sx={{ bgcolor: C.accent, borderRadius: "8px", fontWeight: 800, fontSize: "0.7rem",
          textTransform: "none", "&:hover": { bgcolor: C.accentL }, py: 0.7 }}>
        View Profile
      </Button>

      {status === "pending" && (
        <Button fullWidth variant="outlined" disabled size="small"
          startIcon={<HourglassEmptyIcon sx={{ fontSize: "0.7rem" }} />}
          sx={{ borderRadius: "8px", fontSize: "0.68rem", textTransform: "none", py: 0.7 }}>
          Request Sent
        </Button>
      )}
      {status === "accepted" && (
        <Button fullWidth variant="outlined" disabled size="small"
          startIcon={<CheckCircleOutlineIcon sx={{ fontSize: "0.7rem" }} />}
          sx={{ borderColor: C.success, color: C.success, borderRadius: "8px",
            fontSize: "0.68rem", textTransform: "none", py: 0.7 }}>
          Connected ✓
        </Button>
      )}
      {!status && (
        <Button fullWidth variant="outlined" size="small"
          startIcon={<LinkIcon sx={{ fontSize: "0.7rem" }} />}
          onClick={() => onConnect(mentor._id)}
          sx={{ borderColor: C.accent, color: C.accent, borderRadius: "8px", fontWeight: 700,
            fontSize: "0.68rem", textTransform: "none", py: 0.7,
            "&:hover": { bgcolor: C.accentBg } }}>
          Connect
        </Button>
      )}
    </Stack>
  </Box>
);

/* ── Stat Card ────────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, icon, color }) => (
  <Paper sx={{ ...panel, p: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
    <Box sx={{ p: 1.4, borderRadius: "12px", bgcolor: "rgba(21,101,192,0.09)", color, display: "flex" }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="h4" fontWeight={900} color={C.dark} lineHeight={1}>{value}</Typography>
      <Typography variant="caption" color={C.textDim} fontWeight={600}>{label}</Typography>
    </Box>
  </Paper>
);

/* ── Chat contact row ─────────────────────────────────────────────────────── */
const ChatRow = ({ person, unread, onClick }) => (
  <Box onClick={onClick} sx={{
    display: "flex", alignItems: "center", gap: 1.5, p: 1.2,
    borderRadius: "12px", cursor: "pointer",
    bgcolor: unread > 0 ? "rgba(21,101,192,0.05)" : "transparent",
    border: unread > 0 ? `1px solid ${C.border}` : "1px solid transparent",
    "&:hover": { bgcolor: C.accentBg }, transition: "all 0.15s",
  }}>
    <Box sx={{ position: "relative" }}>
      <Avatar src={person.avatar} sx={{ width: 36, height: 36, bgcolor: C.accent, fontSize: 13, fontWeight: 900 }}>
        {person.name?.[0]?.toUpperCase()}
      </Avatar>
      {unread > 0 && (
        <Box sx={{
          position: "absolute", top: -3, right: -3, width: 17, height: 17,
          borderRadius: "50%", bgcolor: "#e53935", border: "2px solid #fff",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Typography sx={{ fontSize: "0.48rem", color: "#fff", fontWeight: 900 }}>
            {unread > 9 ? "9+" : unread}
          </Typography>
        </Box>
      )}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="body2" fontWeight={unread > 0 ? 800 : 600} color={C.dark} noWrap fontSize="0.83rem">
        {person.name}
      </Typography>
      {unread > 0 && (
        <Typography variant="caption" color={C.accent} fontWeight={700} fontSize="0.64rem">
          {unread} new
        </Typography>
      )}
    </Box>
    <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: unread > 0 ? C.accent : C.border, flexShrink: 0 }} />
  </Box>
);

/* ══════════════════════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const [studentRequests,   setStudentRequests]   = useState([]);
  const [mentorProfile,     setMentorProfile]     = useState(null);
  const [mentors,           setMentors]           = useState([]);
  const [myRequests,        setMyRequests]        = useState([]);
  const [recentChats,       setRecentChats]       = useState([]);
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [responding,        setResponding]        = useState({});
  const [loading,           setLoading]           = useState(true);

  const user        = JSON.parse(localStorage.getItem("user") || "{}");
  const token       = localStorage.getItem("token");
  const navigate    = useNavigate();
  const auth        = { headers: { Authorization: `Bearer ${token}` } };
  const isMentor    = user?.role === "mentor";
  const { unreadBySender, markRead } = useUnread();

  /* ── fetch data ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isMentor) {
          const [reqRes, profileRes, studentsRes] = await Promise.all([
            axios.get(`${BASE_URL}/api/mentorship/requests`,                auth),
            axios.get(`${BASE_URL}/api/profile/me`,                         auth),
            axios.get(`${BASE_URL}/api/student-history/connected-students`, auth),
          ]);
          setStudentRequests(reqRes.data.requests || []);
          setMentorProfile(profileRes.data);
          setConnectedStudents(studentsRes.data.data || []);
        } else {
          const [mentorRes, reqRes] = await Promise.all([
            axios.get(`${BASE_URL}/api/mentors`),
            axios.get(`${BASE_URL}/api/mentorship/my-requests`, auth),
          ]);
          setMentors(mentorRes.data || []);
          setMyRequests(reqRes.data.requests || []);
        }
        const chatRes = await axios.get(`${BASE_URL}/api/messages/contacts/recent`, auth);
        setRecentChats(chatRes.data || []);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // eslint-disable-line

  /* ── connect (student) ──────────────────────────────────────────────────── */
  const handleConnect = async (mentorId) => {
    try {
      await axios.post(`${BASE_URL}/api/mentorship/request`, { mentorId }, auth);
      toast.success("Connection request sent!");
      setMyRequests((p) => [...p, { mentor: { _id: mentorId }, status: "pending" }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request.");
    }
  };

  /* ── respond (mentor) ───────────────────────────────────────────────────── */
  const handleRespond = async (requestId, status) => {
    setResponding((p) => ({ ...p, [requestId]: true }));
    try {
      await axios.put(`${BASE_URL}/api/mentorship/respond/${requestId}`, { status }, auth);
      toast.success(status === "accepted" ? "✅ Connection accepted!" : "Declined.");
      setStudentRequests((prev) => prev.map((r) => r._id === requestId ? { ...r, status } : r));
      if (status === "accepted") {
        const acc = studentRequests.find((r) => r._id === requestId);
        if (acc?.student) setConnectedStudents((p) => [...p, acc.student]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    } finally {
      setResponding((p) => ({ ...p, [requestId]: false }));
    }
  };

  const goChat = (person) => {
    markRead(person._id);
    navigate("/chat", { state: { receiverId: person._id, receiverName: person.name } });
  };

  const pending  = studentRequests.filter((r) => r.status === "pending");
  const accepted = myRequests.filter((r) => r.status === "accepted");

  /* ─────────────────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────────────────── */
  return (
    <Box sx={{ minHeight: "100vh", py: 11, bgcolor: C.bg }}>
      <Container maxWidth="xl">

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" fontWeight={900} color={C.dark} letterSpacing="-0.02em">
            {isMentor ? "Mentor Dashboard" : "Student Dashboard"}
          </Typography>
          <Typography variant="body2" color={C.textDim} sx={{ mt: 0.5 }}>
            Welcome back, <strong style={{ color: C.accent }}>{user?.name}</strong>
          </Typography>
        </Box>

        {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {(isMentor ? [
            { label: "Pending Connections", value: pending.length,           icon: <PeopleIcon />,            color: C.accent },
            { label: "Connected Students",  value: connectedStudents.length, icon: <SchoolIcon />,            color: "#0d47a1" },
            { label: "Recent Chats",        value: recentChats.length,       icon: <ChatBubbleOutlineIcon />, color: C.accentL },
          ] : [
            { label: "Available Mentors",   value: mentors.length,           icon: <PeopleIcon />,            color: C.accent },
            { label: "My Connections",      value: myRequests.length,        icon: <SchoolIcon />,            color: "#0d47a1" },
            { label: "Recent Chats",        value: recentChats.length,       icon: <ChatBubbleOutlineIcon />, color: C.accentL },
          ]).map((s, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <StatCard {...s} />
            </Grid>
          ))}
        </Grid>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: C.accent }} />
          </Box>
        ) : (
          /* ── MAIN TWO-COLUMN LAYOUT ──────────────────────────────────────── */
          <Grid container spacing={3}>

            {/* ══ LEFT COLUMN (main content) ══════════════════════════════ */}
            <Grid item xs={12} lg={8}>

              {/* ── MENTOR: pending connection requests ─────────────────── */}
              {isMentor && (
                <Paper sx={{ ...panel, mb: 3 }}>
                  <SectionHead title="Connection Requests" count={pending.length} />
                  {pending.length === 0 ? (
                    <Empty text="No pending connection requests." />
                  ) : (
                    <Stack spacing={1.5}>
                      {pending.map((req) => (
                        <Box key={req._id} sx={{
                          display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap",
                          p: 2, bgcolor: C.accentBg, borderRadius: "14px", border: `1px solid ${C.border}`,
                        }}>
                          <Avatar src={req.student?.avatar}
                            sx={{ bgcolor: C.accent, width: 42, height: 42, fontWeight: 900 }}>
                            {req.student?.name?.[0]}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography fontWeight={800} color={C.dark} fontSize="0.88rem" noWrap>
                              {req.student?.name}
                            </Typography>
                            <Typography variant="caption" color={C.textDim} noWrap>
                              {req.student?.email}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1} flexShrink={0}>
                            <Button variant="contained" size="small" disabled={responding[req._id]}
                              onClick={() => handleRespond(req._id, "accepted")}
                              startIcon={responding[req._id]
                                ? <CircularProgress size={11} color="inherit" />
                                : <CheckCircleOutlineIcon sx={{ fontSize: "0.8rem" }} />}
                              sx={{ bgcolor: C.success, borderRadius: "9px", textTransform: "none",
                                fontWeight: 700, fontSize: "0.7rem", "&:hover": { bgcolor: "#1b5e20" } }}>
                              Accept
                            </Button>
                            <Button variant="outlined" size="small" disabled={responding[req._id]}
                              onClick={() => handleRespond(req._id, "rejected")}
                              startIcon={<CancelOutlinedIcon sx={{ fontSize: "0.8rem" }} />}
                              sx={{ borderColor: C.danger, color: C.danger, borderRadius: "9px",
                                textTransform: "none", fontWeight: 700, fontSize: "0.7rem",
                                "&:hover": { bgcolor: C.dangerBg } }}>
                              Decline
                            </Button>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Paper>
              )}

              {/* ── MENTOR: connected students ───────────────────────────── */}
              {isMentor && (
                <Paper sx={panel}>
                  <SectionHead title="Connected Students" count={connectedStudents.length} />
                  {connectedStudents.length === 0 ? (
                    <Empty text="No connected students yet." />
                  ) : (
                    <Stack spacing={1.5}>
                      {connectedStudents.map((s, i) => (
                        <Box key={i} sx={{
                          display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap",
                          p: 2, bgcolor: C.successBg, borderRadius: "14px",
                          border: "1px solid rgba(46,125,50,0.18)",
                        }}>
                          <Avatar src={s.avatar} sx={{ bgcolor: C.accent, width: 42, height: 42, fontWeight: 900 }}>
                            {s.name?.[0]?.toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" alignItems="center" spacing={0.8}>
                              <Typography fontWeight={800} color={C.dark} fontSize="0.88rem" noWrap>{s.name}</Typography>
                              <CheckCircleOutlineIcon sx={{ fontSize: 13, color: C.success }} />
                            </Stack>
                            <Typography variant="caption" color={C.textDim} noWrap>
                              {s.department || s.email}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1} flexShrink={0}>
                            <Tooltip title="View Academic History">
                              <Button variant="outlined" size="small"
                                startIcon={<HistoryEduIcon sx={{ fontSize: "0.8rem" }} />}
                                onClick={() => navigate(`/student-history/${s._id}`)}
                                sx={{ borderColor: C.border, color: C.accent, borderRadius: "9px",
                                  textTransform: "none", fontWeight: 700, fontSize: "0.7rem",
                                  "&:hover": { borderColor: C.accent, bgcolor: C.accentBg } }}>
                                History
                              </Button>
                            </Tooltip>
                            <Button variant="contained" size="small"
                              onClick={() => goChat(s)}
                              sx={{ bgcolor: C.accent, borderRadius: "9px", textTransform: "none",
                                fontWeight: 700, fontSize: "0.7rem", "&:hover": { bgcolor: C.accentL } }}>
                              Chat
                            </Button>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Paper>
              )}

              {/* ── STUDENT: find a mentor ───────────────────────────────── */}
              {!isMentor && (
                <Paper sx={panel}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                    <Typography variant="h6" fontWeight={800} color={C.dark} fontSize="1rem">
                      Find a Mentor
                    </Typography>
                    <Chip label={`${mentors.length} available`} size="small"
                      sx={{ bgcolor: C.accentBg, color: C.accent, border: `1px solid ${C.border}`,
                        fontWeight: 700, height: 22 }} />
                  </Stack>

                  {mentors.length === 0 ? (
                    <Empty text="Loading mentors..." />
                  ) : (
                    /* ── Clean 3-column grid (no nested Grid container issues) */
                    <Box sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                        md: "1fr 1fr 1fr",
                      },
                      gap: 2,
                    }}>
                      {mentors.map((mentor) => {
                        const req    = myRequests.find((r) =>
                          (r.mentor?._id || r.mentor) === mentor._id
                        );
                        const status = req?.status || null;
                        return (
                          <MentorCard
                            key={mentor._id}
                            mentor={mentor}
                            status={status}
                            onConnect={handleConnect}
                          />
                        );
                      })}
                    </Box>
                  )}
                </Paper>
              )}
            </Grid>

            {/* ══ RIGHT COLUMN (sidebar) ══════════════════════════════════ */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={3}>

                {/* ── Student: my history quick-access ──────────────────── */}
                {!isMentor && (
                  <Paper sx={panel}>
                    <SectionHead title="My History" />
                    <Button fullWidth variant="contained"
                      startIcon={<HistoryEduIcon />}
                      component={Link} to="/student-history"
                      sx={{ bgcolor: C.accent, borderRadius: "12px", fontWeight: 700,
                        textTransform: "none", py: 1.2, "&:hover": { bgcolor: C.accentL } }}>
                      Open Student History
                    </Button>
                  </Paper>
                )}

                {/* ── Student: my connections ────────────────────────────── */}
                {!isMentor && myRequests.length > 0 && (
                  <Paper sx={panel}>
                    <SectionHead title="My Connections" count={myRequests.length} />
                    <Stack spacing={0.8}>
                      {myRequests.map((req, i) => (
                        <Box key={i} sx={{
                          display: "flex", alignItems: "center", gap: 1.5, p: 1.5,
                          bgcolor: req.status === "accepted" ? C.successBg : C.accentBg,
                          border: `1px solid ${req.status === "accepted" ? "rgba(46,125,50,0.2)" : C.border}`,
                          borderRadius: "12px",
                        }}>
                          <Avatar src={req.mentor?.avatar}
                            sx={{ width: 34, height: 34, bgcolor: C.accent, fontSize: 12, fontWeight: 900 }}>
                            {req.mentor?.name?.[0]?.toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography fontWeight={700} color={C.dark} fontSize="0.83rem" noWrap>
                              {req.mentor?.name}
                            </Typography>
                            <Chip
                              label={req.status === "accepted" ? "Connected" : "Pending"}
                              size="small"
                              sx={{
                                height: 16, fontSize: "0.58rem", fontWeight: 800,
                                bgcolor: req.status === "accepted" ? C.successBg : C.accentBg,
                                color:   req.status === "accepted" ? C.success : C.accent,
                              }}
                            />
                          </Box>
                          {req.status === "accepted" && (
                            <Button variant="text" size="small"
                              onClick={() => goChat({ _id: req.mentor._id, name: req.mentor.name })}
                              sx={{ color: C.accent, textTransform: "none", fontWeight: 700, fontSize: "0.7rem",
                                flexShrink: 0 }}>
                              Chat
                            </Button>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                )}

                {/* ── Mentor: own mini profile card ─────────────────────── */}
                {isMentor && mentorProfile && (
                  <Paper sx={{ ...panel, p: 0, overflow: "hidden" }}>
                    <Box sx={{
                      height: 80,
                      background: mentorProfile.banner
                        ? `url(${mentorProfile.banner}) center/cover`
                        : `linear-gradient(135deg, ${C.dark} 0%, ${C.accent} 60%, ${C.accentL} 100%)`,
                    }} />
                    <Box sx={{ px: 3, pb: 3, pt: 0, textAlign: "center", mt: -5 }}>
                      <Avatar src={mentorProfile.avatar}
                        sx={{ width: 68, height: 68, mx: "auto", border: `3px solid ${C.white}`,
                          bgcolor: C.accent, boxShadow: "0 4px 16px rgba(21,101,192,0.3)", fontWeight: 900 }}>
                        {mentorProfile.name?.[0]?.toUpperCase()}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={900} color={C.dark} mt={0.8}>
                        {mentorProfile.name}
                      </Typography>
                      <Chip label="MENTOR" size="small"
                        sx={{ bgcolor: C.accentBg, color: C.accent, fontWeight: 800, fontSize: "0.6rem",
                          borderRadius: "6px", mt: 0.5 }} />
                      <Box mt={1.5} display="flex" flexWrap="wrap" justifyContent="center" gap={0.5}>
                        {mentorProfile.expertise?.slice(0, 4).map((s, i) => (
                          <Chip key={i} label={s} size="small"
                            sx={{ bgcolor: C.accentBg, color: C.accent, border: `1px solid ${C.border}`,
                              fontSize: "0.6rem", height: 20 }} />
                        ))}
                      </Box>
                    </Box>
                  </Paper>
                )}

                {/* ── Recent Chats (all contacts) ───────────────────────── */}
                <Paper sx={panel}>
                  <SectionHead title="All Chats" count={recentChats.length} />
                  {recentChats.length === 0 ? (
                    <Empty text="No messages yet." />
                  ) : (
                    <Stack spacing={0.3}>
                      {recentChats.filter((p) => p?.name).map((person) => {
                        const unread = unreadBySender[person._id] || 0;
                        return (
                          <ChatRow
                            key={person._id}
                            person={person}
                            unread={unread}
                            onClick={() => goChat(person)}
                          />
                        );
                      })}
                    </Stack>
                  )}
                </Paper>

              </Stack>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;