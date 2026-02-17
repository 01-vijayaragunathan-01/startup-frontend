import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Chip,
  Container,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const BASE_URL = "https://startup-backend-1-cj33.onrender.com";

const MentorProfile = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const token       = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [mentor,    setMentor]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [requested, setRequested] = useState(false);
  const [sending,   setSending]   = useState(false);

  const colors = {
    bg:          "#030014",
    accent:      "#7000ff",
    accentGlow:  "rgba(112,0,255,0.18)",
    accentSoft:  "rgba(112,0,255,0.10)",
    glass:       "rgba(255,255,255,0.03)",
    border:      "rgba(255,255,255,0.08)",
    borderHover: "rgba(112,0,255,0.5)",
    textDim:     "rgba(255,255,255,0.55)",
    textMuted:   "rgba(255,255,255,0.25)",
  };

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/mentors/${id}`);
        setMentor(data);

        // Check if student already sent a request to this mentor
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
  }, [id]);

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

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ bgcolor: colors.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: colors.accent }} />
      </Box>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────────
  if (!mentor) {
    return (
      <Box sx={{ bgcolor: colors.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h5" sx={{ color: "rgba(255,255,255,0.4)" }}>
          Mentor not found.
        </Typography>
      </Box>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: "100vh", py: 8, color: "#fff" }}>
      <Container maxWidth="md">

        {/* Back button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            color:        colors.textDim,
            mb:           4,
            fontWeight:   700,
            fontSize:     "0.78rem",
            letterSpacing: 1,
            "&:hover":    { color: "#fff" },
          }}
        >
          BACK
        </Button>

        {/* ── Profile Card ──────────────────────────────────────────────────── */}
        <Box
          sx={{
            border:       `1px solid ${colors.border}`,
            borderRadius: "24px",
            overflow:     "hidden",
            background:   colors.glass,
            backdropFilter: "blur(20px)",
            transition:   "border-color 0.3s",
            "&:hover":    { borderColor: colors.borderHover },
          }}
        >
          {/* Banner */}
          <Box
            sx={{
              height:             220,
              backgroundImage:    mentor.banner
                ? `url(${mentor.banner})`
                : `linear-gradient(135deg, #0d0025 0%, #1a0050 50%, #0d0025 100%)`,
              backgroundSize:     "cover",
              backgroundPosition: "center",
              position:           "relative",
              // subtle scanline texture
              "&::after": {
                content:    '""',
                position:   "absolute",
                inset:      0,
                background: "linear-gradient(to bottom, transparent 60%, rgba(3,0,20,0.85) 100%)",
              },
            }}
          />

          {/* Avatar — overlaps banner */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: "-60px", position: "relative", zIndex: 2 }}>
            <Avatar
              src={mentor.avatar}
              sx={{
                width:      120,
                height:     120,
                border:     `4px solid ${colors.bg}`,
                bgcolor:    colors.accent,
                fontSize:   "2.8rem",
                fontWeight: 900,
                boxShadow:  `0 0 32px ${colors.accentGlow}`,
              }}
            >
              {mentor.name?.[0]?.toUpperCase()}
            </Avatar>
          </Box>

          {/* Body */}
          <Box sx={{ px: { xs: 3, md: 6 }, pb: 6, pt: 3, textAlign: "center" }}>

            {/* Name + role badge */}
            <Typography variant="h4" fontWeight={900} letterSpacing="-0.02em">
              {mentor.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: colors.accent, fontWeight: 800, letterSpacing: 3, display: "block", mt: 0.5 }}
            >
              MENTOR
            </Typography>

            {/* Bio */}
            <Typography
              variant="body1"
              sx={{ color: colors.textDim, mt: 2.5, lineHeight: 1.8, maxWidth: 520, mx: "auto" }}
            >
              {mentor.about || "No bio provided yet."}
            </Typography>

            <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.06)" }} />

            {/* Expertise */}
            <Box>
              <Typography
                variant="overline"
                sx={{ color: colors.accent, fontWeight: 800, letterSpacing: 3, display: "block", mb: 2 }}
              >
                EXPERTISE
              </Typography>

              {mentor.expertise?.length > 0 ? (
                <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 1 }}>
                  {mentor.expertise.map((skill, i) => (
                    <Chip
                      key={i}
                      label={skill}
                      sx={{
                        bgcolor:    colors.accentSoft,
                        color:      colors.accent,
                        border:     `1px solid rgba(112,0,255,0.4)`,
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize:   "0.78rem",
                        px:         0.5,
                        "&:hover":  { bgcolor: "rgba(112,0,255,0.2)" },
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography sx={{ color: colors.textMuted, fontStyle: "italic", fontSize: "0.85rem" }}>
                  No expertise listed.
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.06)" }} />

            {/* Action buttons */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">

              {/* Chat */}
              <Button
                variant="outlined"
                startIcon={<ChatBubbleOutlineIcon />}
                onClick={() => navigate("/chat", { state: { receiverId: mentor._id, receiverName: mentor.name } })}
                sx={{
                  borderColor:  colors.border,
                  color:        "#fff",
                  borderRadius: "12px",
                  fontWeight:   800,
                  px:           4,
                  py:           1.2,
                  fontSize:     "0.82rem",
                  letterSpacing: 1,
                  "&:hover":    { borderColor: colors.accent, bgcolor: colors.accentGlow },
                }}
              >
                MESSAGE
              </Button>

              {/* Request mentorship — hidden for mentors viewing other mentors */}
              {currentUser?.role === "student" && (
                requested ? (
                  <Button
                    variant="outlined"
                    disabled
                    startIcon={<CheckCircleOutlineIcon />}
                    sx={{
                      borderColor:  "rgba(112,0,255,0.3)",
                      color:        colors.accent,
                      borderRadius: "12px",
                      fontWeight:   800,
                      px:           4,
                      py:           1.2,
                      fontSize:     "0.82rem",
                      letterSpacing: 1,
                    }}
                  >
                    REQUEST SENT
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={
                      sending
                        ? <CircularProgress size={14} color="inherit" />
                        : <PersonAddAlt1Icon />
                    }
                    onClick={handleRequest}
                    disabled={sending}
                    sx={{
                      bgcolor:      colors.accent,
                      borderRadius: "12px",
                      fontWeight:   800,
                      px:           4,
                      py:           1.2,
                      fontSize:     "0.82rem",
                      letterSpacing: 1,
                      boxShadow:    `0 4px 20px ${colors.accentGlow}`,
                      "&:hover":    { bgcolor: "#5a00cc" },
                    }}
                  >
                    {sending ? "SENDING…" : "REQUEST MENTORSHIP"}
                  </Button>
                )
              )}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MentorProfile;