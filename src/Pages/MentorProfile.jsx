import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Avatar, Typography, Button, Chip, Container, CircularProgress, Stack, Divider, Paper,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import ArrowBackIcon          from "@mui/icons-material/ArrowBack";
import ChatBubbleOutlineIcon  from "@mui/icons-material/ChatBubbleOutline";
import PersonAddAlt1Icon      from "@mui/icons-material/PersonAddAlt1";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WorkOutlineIcon        from "@mui/icons-material/WorkOutline";

const BASE_URL = "https://startup-backend-1-cj33.onrender.com";

const C = {
  bg:        "#f0f4ff",
  white:     "#ffffff",
  accent:    "#1565c0",
  accentAlt: "#1e88e5",
  accentBg:  "rgba(21,101,192,0.07)",
  border:    "rgba(21,101,192,0.14)",
  textDim:   "#546e7a",
  dark:      "#1a237e",
};

const MentorProfile = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const token       = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [mentor,    setMentor]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [requested, setRequested] = useState(false);
  const [sending,   setSending]   = useState(false);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/mentors/${id}`);
        setMentor(data);

        if (currentUser?.role === "student") {
          const reqRes = await axios.get(
            `${BASE_URL}/api/mentorship/my-requests`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const alreadySent = reqRes.data.requests?.some(
            (r) => r.mentor._id === id || r.mentor === id
          );
          setRequested(alreadySent);
        }
      } catch {
        toast.error("Failed to load mentor profile");
      } finally {
        setLoading(false);
      }
    };
    fetchMentor();
  }, [id]); // eslint-disable-line

  const handleRequest = async () => {
    setSending(true);
    try {
      await axios.post(
        `${BASE_URL}/api/mentorship/request`,
        { mentorId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Request sent successfully!");
      setRequested(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <Box sx={{ bgcolor: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress sx={{ color: C.accent }} />
    </Box>
  );

  if (!mentor) return (
    <Box sx={{ bgcolor: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Typography color={C.textDim} fontWeight={700}>Mentor not found.</Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: C.bg, minHeight: "100vh", py: 10 }}>
      <Container maxWidth="md">

        {/* Back */}
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}
          sx={{ color: C.textDim, mb: 4, fontWeight: 700, textTransform: "none", "&:hover": { color: C.accent } }}>
          Back
        </Button>

        {/* Profile Card */}
        <Paper sx={{ borderRadius: "28px", border: `1px solid ${C.border}`, overflow: "hidden", bgcolor: C.white, boxShadow: "0 8px 40px rgba(21,101,192,0.09)" }}>

          {/* Banner */}
          <Box sx={{
            height: 220,
            backgroundImage: mentor.banner
              ? `url(${mentor.banner})`
              : `linear-gradient(135deg, ${C.dark} 0%, ${C.accent} 50%, ${C.accentAlt} 100%)`,
            backgroundSize: "cover", backgroundPosition: "center",
          }} />

          {/* Avatar overlapping banner */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: "-64px", position: "relative", zIndex: 2 }}>
            <Box sx={{ p: "4px", borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.accentAlt})` }}>
              <Avatar src={mentor.avatar} sx={{ width: 120, height: 120, bgcolor: C.accent, fontSize: "2.8rem", fontWeight: 900, border: `4px solid ${C.white}` }}>
                {mentor.name?.[0]?.toUpperCase()}
              </Avatar>
            </Box>
          </Box>

          {/* Body */}
          <Box sx={{ px: { xs: 3, md: 6 }, pb: 6, pt: 3, textAlign: "center" }}>
            <Typography variant="h4" fontWeight={900} color={C.dark} letterSpacing="-0.02em">
              {mentor.name}
            </Typography>
            <Chip label="MENTOR" size="small"
              sx={{ mt: 1, mb: 2, bgcolor: C.accentBg, color: C.accent, fontWeight: 800, letterSpacing: 2, borderRadius: "8px" }} />

            <Typography variant="body1" sx={{ color: C.textDim, lineHeight: 1.8, maxWidth: 520, mx: "auto" }}>
              {mentor.about || "No bio provided yet."}
            </Typography>

            <Divider sx={{ my: 4, borderColor: C.border }} />

            {/* Expertise */}
            <Box>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                <WorkOutlineIcon sx={{ color: C.accent, fontSize: 18 }} />
                <Typography variant="overline" sx={{ color: C.accent, fontWeight: 800, letterSpacing: 3 }}>
                  EXPERTISE
                </Typography>
              </Stack>

              {mentor.expertise?.length > 0 ? (
                <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 1 }}>
                  {mentor.expertise.map((skill, i) => (
                    <Chip key={i} label={skill}
                      sx={{ bgcolor: C.accentBg, color: C.accent, border: `1px solid ${C.border}`, borderRadius: "8px", fontWeight: 700, fontSize: "0.78rem" }} />
                  ))}
                </Box>
              ) : (
                <Typography sx={{ color: C.textDim, fontStyle: "italic", fontSize: "0.85rem" }}>No expertise listed.</Typography>
              )}
            </Box>

            <Divider sx={{ my: 4, borderColor: C.border }} />

            {/* Actions */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button variant="outlined" startIcon={<ChatBubbleOutlineIcon />}
                onClick={() => navigate("/chat", { state: { receiverId: mentor._id, receiverName: mentor.name } })}
                sx={{
                  borderColor: C.border, color: C.accent, borderRadius: "12px", fontWeight: 800,
                  px: 4, py: 1.2, textTransform: "none",
                  "&:hover": { borderColor: C.accent, bgcolor: C.accentBg },
                }}>
                Message
              </Button>

              {currentUser?.role === "student" && (
                requested ? (
                  <Button variant="outlined" disabled startIcon={<CheckCircleOutlineIcon />}
                    sx={{ borderColor: C.border, color: C.accent, borderRadius: "12px", fontWeight: 800, px: 4, py: 1.2, textTransform: "none" }}>
                    Request Sent
                  </Button>
                ) : (
                  <Button variant="contained" startIcon={sending ? <CircularProgress size={14} color="inherit" /> : <PersonAddAlt1Icon />}
                    onClick={handleRequest} disabled={sending}
                    sx={{
                      bgcolor: C.accent, borderRadius: "12px", fontWeight: 800, px: 4, py: 1.2, textTransform: "none",
                      boxShadow: "0 4px 20px rgba(21,101,192,0.3)",
                      "&:hover": { bgcolor: C.accentAlt, transform: "translateY(-2px)" }, transition: "all 0.2s",
                    }}>
                    {sending ? "Sending…" : "Connect"}
                  </Button>
                )
              )}
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default MentorProfile;