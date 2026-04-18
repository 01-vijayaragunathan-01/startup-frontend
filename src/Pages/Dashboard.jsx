import {
  Box, Typography, Grid, Avatar, Chip, Button, Container,
  Paper, Stack, Divider, Tooltip, CircularProgress, TextField, IconButton,
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
import SearchIcon             from "@mui/icons-material/Search";
import { useUnread }          from "../Context/UnreadContext";

const BASE_URL = "https://startup-backend-1-cj33.onrender.com";

/* ── tokens ─────────────────────────────────────────────────────────────── */
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
  chatBg:    "#eef2fb",
};
const panel = { bgcolor: C.white, border: `1px solid ${C.border}`, borderRadius: "20px", boxShadow: "0 4px 24px rgba(21,101,192,0.07)" };

/* ── tiny helpers ────────────────────────────────────────────────────────── */
const Empty = ({ text }) => (
  <Stack alignItems="center" spacing={1} py={5}>
    <InboxIcon sx={{ fontSize: 38, color: C.border }} />
    <Typography variant="body2" color={C.textDim} fontStyle="italic" textAlign="center">{text}</Typography>
  </Stack>
);

const SectionHead = ({ title, count }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
    <Typography fontWeight={800} color={C.dark} fontSize="0.95rem">{title}</Typography>
    {count !== undefined && (
      <Chip label={count} size="small"
        sx={{ bgcolor: C.accentBg, color: C.accent, fontWeight: 800, height: 20, fontSize: "0.65rem" }} />
    )}
  </Stack>
);

/* ── mentor card ─────────────────────────────────────────────────────────── */
const MentorCard = ({ mentor, status, onConnect }) => (
  <Box sx={{
    ...panel, p: 2.5, display: "flex", flexDirection: "column", gap: 1.2, height: "100%",
    transition: "all 0.2s", "&:hover": { borderColor: C.accent, transform: "translateY(-2px)" },
  }}>
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar src={mentor.avatar}
        sx={{ width: 44, height: 44, bgcolor: C.accent, fontWeight: 900, border: `2px solid ${C.border}` }}>
        {mentor.name?.[0]?.toUpperCase()}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography fontWeight={800} color={C.dark} fontSize="0.85rem" noWrap>{mentor.name}</Typography>
        <Typography fontSize="0.6rem" color={C.accentL} fontWeight={700} letterSpacing={1.5}>MENTOR</Typography>
      </Box>
    </Stack>

    <Typography variant="body2" sx={{ color: C.textDim, fontSize: "0.73rem", lineHeight: 1.5,
      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
      {mentor.about || "No bio added yet."}
    </Typography>

    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.4 }}>
      {mentor.expertise?.length > 0
        ? mentor.expertise.slice(0, 3).map((s, i) => (
          <Chip key={i} label={s} size="small"
            sx={{ bgcolor: C.accentBg, color: C.accent, border: `1px solid ${C.border}`,
              borderRadius: "5px", fontSize: "0.58rem", fontWeight: 700, height: 18 }} />
        ))
        : <Typography fontSize="0.62rem" color={C.textDim} fontStyle="italic">No expertise</Typography>
      }
    </Box>

    <Stack direction="row" alignItems="center" spacing={0.5}>
      <StarIcon sx={{ fontSize: 13, color: "#ffc107" }} />
      <Typography fontSize="0.72rem" fontWeight={700} color={C.dark}>{mentor.rating || "4.8"}</Typography>
    </Stack>

    <Divider sx={{ borderColor: C.border }} />

    <Stack spacing={0.7}>
      <Button fullWidth variant="contained" component={Link} to={`/mentor/${mentor._id}`}
        size="small" endIcon={<OpenInNewIcon sx={{ fontSize: "0.65rem" }} />}
        sx={{ bgcolor: C.accent, borderRadius: "8px", fontWeight: 800, fontSize: "0.68rem",
          textTransform: "none", py: 0.6, "&:hover": { bgcolor: C.accentL } }}>
        View Profile
      </Button>

      {status === "pending" && (
        <Button fullWidth variant="outlined" disabled size="small"
          startIcon={<HourglassEmptyIcon sx={{ fontSize: "0.65rem" }} />}
          sx={{ borderRadius: "8px", fontSize: "0.65rem", textTransform: "none", py: 0.6 }}>
          Request Sent
        </Button>
      )}
      {status === "accepted" && (
        <Button fullWidth variant="outlined" disabled size="small"
          startIcon={<CheckCircleOutlineIcon sx={{ fontSize: "0.65rem" }} />}
          sx={{ borderColor: C.success, color: C.success, borderRadius: "8px",
            fontSize: "0.65rem", textTransform: "none", py: 0.6 }}>
          Connected ✓
        </Button>
      )}
      {!status && (
        <Button fullWidth variant="outlined" size="small"
          startIcon={<LinkIcon sx={{ fontSize: "0.65rem" }} />}
          onClick={() => onConnect(mentor._id)}
          sx={{ borderColor: C.accent, color: C.accent, borderRadius: "8px", fontWeight: 700,
            fontSize: "0.65rem", textTransform: "none", py: 0.6, "&:hover": { bgcolor: C.accentBg } }}>
          Connect
        </Button>
      )}
    </Stack>
  </Box>
);

/* ════════════════════════════════════════════════════════════════════════════
   CHAT PANEL — contact list only, clicking navigates to full /chat page
════════════════════════════════════════════════════════════════════════════ */
const ChatPanel = ({ contacts, navigate }) => {
  const { unreadBySender, markRead } = useUnread();
  const [search, setSearch] = useState("");
  const filtered = contacts.filter((c) => c?.name?.toLowerCase().includes(search.toLowerCase()));
  const totalUnread = Object.values(unreadBySender).reduce((a, b) => a + b, 0);

  const openChat = (person) => {
    markRead(person._id);
    navigate("/chat", { state: { receiverId: person._id, receiverName: person.name } });
  };

  return (
    <Box sx={{ ...panel, overflow: "hidden", display: "flex", flexDirection: "column",
      height: "calc(100vh - 160px)", minHeight: 420 }}>

      {/* header */}
      <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <ChatBubbleOutlineIcon sx={{ color: C.accent, fontSize: 18 }} />
            <Typography fontWeight={900} color={C.dark} fontSize="0.95rem">Chats</Typography>
          </Stack>
          {totalUnread > 0 && (
            <Chip label={`${totalUnread} new`} size="small"
              sx={{ bgcolor: "#e53935", color: "#fff", fontWeight: 800, fontSize: "0.58rem", height: 18 }} />
          )}
        </Stack>
      </Box>

      {/* search */}
      <Box sx={{ px: 1.5, py: 1, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <TextField fullWidth size="small" placeholder="Find by name…"
          value={search} onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ fontSize: 16, color: C.textDim, mr: 0.5 }} />,
            sx: { borderRadius: "10px", fontSize: "0.75rem", bgcolor: C.chatBg,
              "& fieldset": { border: "none" } },
          }} />
      </Box>

      {/* contact list */}
      <Box sx={{ flex: 1, overflowY: "auto",
        "&::-webkit-scrollbar": { width: 3 },
        "&::-webkit-scrollbar-thumb": { bgcolor: C.border, borderRadius: 4 },
      }}>
        {filtered.length === 0 ? (
          <Stack alignItems="center" spacing={1} py={6}>
            <InboxIcon sx={{ fontSize: 36, color: C.border }} />
            <Typography variant="caption" color={C.textDim} textAlign="center">
              {contacts.length === 0 ? "No chats yet" : "No matching contacts"}
            </Typography>
          </Stack>
        ) : (
          filtered.map((person) => {
            const unread = unreadBySender[person._id] || 0;
            return (
              <Box key={person._id} onClick={() => openChat(person)}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.4,
                  cursor: "pointer", transition: "all 0.15s",
                  bgcolor: unread > 0 ? "rgba(21,101,192,0.04)" : "transparent",
                  borderLeft: unread > 0 ? `3px solid ${C.accent}` : "3px solid transparent",
                  "&:hover": { bgcolor: C.chatBg },
                }}>
                {/* avatar with badge */}
                <Box sx={{ position: "relative", flexShrink: 0 }}>
                  <Avatar src={person.avatar}
                    sx={{ width: 38, height: 38, bgcolor: C.accent, fontSize: 13, fontWeight: 900 }}>
                    {person.name?.[0]?.toUpperCase()}
                  </Avatar>
                  {unread > 0 && (
                    <Box sx={{
                      position: "absolute", top: -3, right: -3,
                      width: 17, height: 17, bgcolor: "#e53935",
                      borderRadius: "50%", border: "2px solid #fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Typography sx={{ fontSize: "0.45rem", color: "#fff", fontWeight: 900 }}>
                        {unread > 9 ? "9+" : unread}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* name + new tag */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography fontSize="0.82rem" fontWeight={unread > 0 ? 800 : 600}
                    color={C.dark} noWrap>
                    {person.name}
                  </Typography>
                  {unread > 0 && (
                    <Typography fontSize="0.62rem" color={C.accent} fontWeight={700}>
                      {unread} new message{unread > 1 ? "s" : ""}
                    </Typography>
                  )}
                </Box>

                <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: unread > 0 ? C.accent : C.border, flexShrink: 0 }} />
              </Box>
            );
          })
        )}
      </Box>

      {/* footer hint */}
      <Box sx={{ px: 2, py: 1.2, borderTop: `1px solid ${C.border}`, bgcolor: C.chatBg }}>
        <Typography variant="caption" color={C.textDim} fontSize="0.62rem" textAlign="center" display="block">
          Click any contact to open full chat
        </Typography>
      </Box>
    </Box>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const [studentRequests,   setStudentRequests]   = useState([]);
  const [mentorProfile,     setMentorProfile]     = useState(null);
  const [mentors,           setMentors]           = useState([]);
  const [myRequests,        setMyRequests]        = useState([]);
  const [recentChats,       setRecentChats]       = useState([]);
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [responding,        setResponding]        = useState({});
  const [loading,           setLoading]           = useState(true);

  const user     = JSON.parse(localStorage.getItem("user") || "{}");
  const token    = localStorage.getItem("token");
  const navigate = useNavigate();
  const auth     = { headers: { Authorization: `Bearer ${token}` } };
  const isMentor = user?.role === "mentor";

  useEffect(() => {
    const go = async () => {
      setLoading(true);
      try {
        if (isMentor) {
          const [a, b, c] = await Promise.all([
            axios.get(`${BASE_URL}/api/mentorship/requests`,                auth),
            axios.get(`${BASE_URL}/api/profile/me`,                         auth),
            axios.get(`${BASE_URL}/api/student-history/connected-students`, auth),
          ]);
          setStudentRequests(a.data.requests || []);
          setMentorProfile(b.data);
          setConnectedStudents(c.data.data || []);
        } else {
          const [a, b] = await Promise.all([
            axios.get(`${BASE_URL}/api/mentors`),
            axios.get(`${BASE_URL}/api/mentorship/my-requests`, auth),
          ]);
          setMentors(a.data || []);
          setMyRequests(b.data.requests || []);
        }
        const cr = await axios.get(`${BASE_URL}/api/messages/contacts/recent`, auth);
        setRecentChats(cr.data || []);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    go();
  }, []); // eslint-disable-line

  const handleConnect = async (mentorId) => {
    try {
      await axios.post(`${BASE_URL}/api/mentorship/request`, { mentorId }, auth);
      toast.success("Request sent!");
      setMyRequests((p) => [...p, { mentor: { _id: mentorId }, status: "pending" }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    }
  };

  const handleRespond = async (reqId, status) => {
    setResponding((p) => ({ ...p, [reqId]: true }));
    try {
      await axios.put(`${BASE_URL}/api/mentorship/respond/${reqId}`, { status }, auth);
      toast.success(status === "accepted" ? "✅ Accepted!" : "Declined.");
      setStudentRequests((p) => p.map((r) => r._id === reqId ? { ...r, status } : r));
      if (status === "accepted") {
        const acc = studentRequests.find((r) => r._id === reqId);
        if (acc?.student) setConnectedStudents((p) => [...p, acc.student]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    } finally {
      setResponding((p) => ({ ...p, [reqId]: false }));
    }
  };

  const pending = studentRequests.filter((r) => r.status === "pending");

  return (
    <Box sx={{ minHeight: "100vh", py: 10, bgcolor: C.bg }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h4" fontWeight={900} color={C.dark} letterSpacing="-0.02em">
            {isMentor ? "Mentor Dashboard" : "Student Dashboard"}
          </Typography>
          <Typography variant="body2" color={C.textDim} mt={0.5}>
            Welcome back, <strong style={{ color: C.accent }}>{user?.name}</strong>
          </Typography>
        </Box>

        {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, mb: 3 }}>
          {(isMentor ? [
            { label: "Pending",   value: pending.length,           icon: <PeopleIcon sx={{ fontSize: 22 }} />, color: C.accent },
            { label: "Students",  value: connectedStudents.length, icon: <SchoolIcon sx={{ fontSize: 22 }} />, color: "#0d47a1" },
            { label: "Chats",     value: recentChats.length,       icon: <ChatBubbleOutlineIcon sx={{ fontSize: 22 }} />, color: C.accentL },
          ] : [
            { label: "Mentors",   value: mentors.length,           icon: <PeopleIcon sx={{ fontSize: 22 }} />, color: C.accent },
            { label: "Connected", value: myRequests.length,        icon: <SchoolIcon sx={{ fontSize: 22 }} />, color: "#0d47a1" },
            { label: "Chats",     value: recentChats.length,       icon: <ChatBubbleOutlineIcon sx={{ fontSize: 22 }} />, color: C.accentL },
          ]).map((s, i) => (
            <Paper key={i} sx={{ ...panel, display: "flex", alignItems: "center", gap: 2, px: 2.5, py: 2 }}>
              <Box sx={{ p: 1.2, borderRadius: "12px", bgcolor: "rgba(21,101,192,0.09)", color: s.color, display: "flex" }}>
                {s.icon}
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={900} color={C.dark} lineHeight={1}>{s.value}</Typography>
                <Typography variant="caption" color={C.textDim} fontWeight={600}>{s.label}</Typography>
              </Box>
            </Paper>
          ))}
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: C.accent }} />
          </Box>
        ) : (
          /* ── TWO-COLUMN LAYOUT ─────────────────────────────────────────── */
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 400px" }, gap: 3, alignItems: "start" }}>

            {/* ══ LEFT MAIN CONTENT ════════════════════════════════════════ */}
            <Stack spacing={3}>

              {/* MENTOR: pending requests */}
              {isMentor && (
                <Paper sx={{ ...panel, p: 3 }}>
                  <SectionHead title="Connection Requests" count={pending.length} />
                  {pending.length === 0
                    ? <Empty text="No pending requests." />
                    : <Stack spacing={1.5}>
                        {pending.map((req) => (
                          <Box key={req._id} sx={{
                            display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap",
                            p: 2, bgcolor: C.accentBg, borderRadius: "14px", border: `1px solid ${C.border}`,
                          }}>
                            <Avatar src={req.student?.avatar}
                              sx={{ bgcolor: C.accent, width: 40, height: 40, fontWeight: 900 }}>
                              {req.student?.name?.[0]}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography fontWeight={800} color={C.dark} fontSize="0.86rem" noWrap>
                                {req.student?.name}
                              </Typography>
                              <Typography variant="caption" color={C.textDim} noWrap>{req.student?.email}</Typography>
                            </Box>
                            <Stack direction="row" spacing={1} flexShrink={0}>
                              <Button size="small" variant="contained" disabled={responding[req._id]}
                                onClick={() => handleRespond(req._id, "accepted")}
                                sx={{ bgcolor: C.success, borderRadius: "9px", textTransform: "none",
                                  fontWeight: 700, fontSize: "0.7rem", "&:hover": { bgcolor: "#1b5e20" } }}>
                                {responding[req._id] ? <CircularProgress size={12} color="inherit" /> : "Accept"}
                              </Button>
                              <Button size="small" variant="outlined" disabled={responding[req._id]}
                                onClick={() => handleRespond(req._id, "rejected")}
                                sx={{ borderColor: C.danger, color: C.danger, borderRadius: "9px",
                                  textTransform: "none", fontWeight: 700, fontSize: "0.7rem",
                                  "&:hover": { bgcolor: C.dangerBg } }}>
                                Decline
                              </Button>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                  }
                </Paper>
              )}

              {/* MENTOR: connected students */}
              {isMentor && (
                <Paper sx={{ ...panel, p: 3 }}>
                  <SectionHead title="Connected Students" count={connectedStudents.length} />
                  {connectedStudents.length === 0
                    ? <Empty text="No connected students yet." />
                    : <Stack spacing={1.5}>
                        {connectedStudents.map((s, i) => (
                          <Box key={i} sx={{
                            display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap",
                            p: 2, bgcolor: C.successBg, borderRadius: "14px",
                            border: "1px solid rgba(46,125,50,0.18)",
                          }}>
                            <Avatar src={s.avatar} sx={{ bgcolor: C.accent, width: 40, height: 40, fontWeight: 900 }}>
                              {s.name?.[0]?.toUpperCase()}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Stack direction="row" alignItems="center" spacing={0.8}>
                                <Typography fontWeight={800} color={C.dark} fontSize="0.86rem" noWrap>{s.name}</Typography>
                                <CheckCircleOutlineIcon sx={{ fontSize: 13, color: C.success }} />
                              </Stack>
                              <Typography variant="caption" color={C.textDim} noWrap>{s.department || s.email}</Typography>
                            </Box>
                            <Stack direction="row" spacing={1} flexShrink={0}>
                              <Tooltip title="View History">
                                <Button size="small" variant="outlined"
                                  startIcon={<HistoryEduIcon sx={{ fontSize: "0.75rem" }} />}
                                  onClick={() => navigate(`/student-history/${s._id}`)}
                                  sx={{ borderColor: C.border, color: C.accent, borderRadius: "9px",
                                    textTransform: "none", fontWeight: 700, fontSize: "0.68rem",
                                    "&:hover": { borderColor: C.accent, bgcolor: C.accentBg } }}>
                                  History
                                </Button>
                              </Tooltip>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                  }
                </Paper>
              )}

              {/* STUDENT: mentor profile mini card (accepted connections) */}
              {!isMentor && myRequests.some((r) => r.status === "accepted") && (
                <Paper sx={{ ...panel, p: 3 }}>
                  <SectionHead title="My Connections" count={myRequests.length} />
                  <Stack spacing={1}>
                    {myRequests.map((req, i) => (
                      <Box key={i} sx={{
                        display: "flex", alignItems: "center", gap: 1.5, p: 1.5, borderRadius: "12px",
                        bgcolor: req.status === "accepted" ? C.successBg : C.accentBg,
                        border: `1px solid ${req.status === "accepted" ? "rgba(46,125,50,0.2)" : C.border}`,
                      }}>
                        <Avatar src={req.mentor?.avatar}
                          sx={{ width: 32, height: 32, bgcolor: C.accent, fontSize: 11, fontWeight: 900 }}>
                          {req.mentor?.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Typography fontWeight={700} color={C.dark} fontSize="0.82rem" flex={1} noWrap>
                          {req.mentor?.name}
                        </Typography>
                        <Chip label={req.status === "accepted" ? "Connected" : "Pending"}
                          size="small" sx={{
                            height: 18, fontSize: "0.6rem", fontWeight: 800,
                            bgcolor: req.status === "accepted" ? C.successBg : C.accentBg,
                            color:   req.status === "accepted" ? C.success : C.accent,
                          }} />
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              )}

              {/* STUDENT: student history quick link */}
              {!isMentor && (
                <Paper sx={{ ...panel, p: 3 }}>
                  <SectionHead title="My Academic History" />
                  <Button fullWidth variant="contained"
                    startIcon={<HistoryEduIcon />} component={Link} to="/student-history"
                    sx={{ bgcolor: C.accent, borderRadius: "12px", fontWeight: 700,
                      textTransform: "none", py: 1.2, "&:hover": { bgcolor: C.accentL } }}>
                    Open Student History
                  </Button>
                </Paper>
              )}

              {/* STUDENT: find a mentor */}
              {!isMentor && (
                <Paper sx={{ ...panel, p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography fontWeight={800} color={C.dark} fontSize="0.95rem">Find a Mentor</Typography>
                    <Chip label={`${mentors.length} available`} size="small"
                      sx={{ bgcolor: C.accentBg, color: C.accent, fontWeight: 700, height: 20, fontSize: "0.6rem" }} />
                  </Stack>

                  {mentors.length === 0
                    ? <Empty text="Loading mentors..." />
                    : <Box sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                        gap: 2,
                      }}>
                        {mentors.map((mentor) => {
                          const req    = myRequests.find((r) => (r.mentor?._id || r.mentor) === mentor._id);
                          return (
                            <MentorCard
                              key={mentor._id}
                              mentor={mentor}
                              status={req?.status || null}
                              onConnect={handleConnect}
                            />
                          );
                        })}
                      </Box>
                  }
                </Paper>
              )}
            </Stack>

            {/* ══ RIGHT — CHAT PANEL ═══════════════════════════════════════ */}
            <Box sx={{ position: { lg: "sticky" }, top: { lg: 90 } }}>
              <ChatPanel contacts={recentChats.filter((c) => c?.name)} navigate={navigate} />
            </Box>

          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;