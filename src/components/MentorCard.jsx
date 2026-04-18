import {
  Box,
  Card,
  Typography,
  Button,
  Avatar,
  Chip,
  Stack,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const MentorCard = ({ mentor, mentorshipStatus }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(mentorshipStatus || null);

  const colors = {
    accent: "#1565c0",
    accentLight: "#1e88e5",
    chipBg: "#e3f2fd",
    chipText: "#1565c0",
  };

  const {
    _id,
    name,
    expertise = [],
    about,
    avatar,
    rating = 4.8,
  } = mentor || {};

  const handleMentorRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://startup-backend-1-cj33.onrender.com/api/mentorship/request",
        { mentorId: _id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("pending");
      toast.success("Mentorship request sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  };

  const handleChat = () => {
    navigate("/chat", { state: { receiverId: _id, receiverName: name } });
  };

  return (
    <Card
      elevation={0}
      sx={{
        width: 300,
        height: "100%",
        p: 3,
        borderRadius: 4,
        background: "#ffffff",
        border: "1px solid rgba(21,101,192,0.12)",
        boxShadow: "0 4px 24px rgba(21,101,192,0.08)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 40px rgba(21,101,192,0.18)",
          borderColor: colors.accent,
        },
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar
          src={avatar}
          sx={{
            bgcolor: colors.accent,
            width: 80,
            height: 80,
            fontSize: 32,
            mb: 2,
            boxShadow: `0 4px 14px rgba(21,101,192,0.3)`,
          }}
        >
          {!avatar && name?.[0]?.toUpperCase()}
        </Avatar>

        <Typography variant="h6" fontWeight={800} textAlign="center" color="#1a237e">
          {name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mt={0.5}
          sx={{ lineHeight: 1.6 }}
        >
          {about || "No bio added yet."}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          mt={1.5}
          flexWrap="wrap"
          justifyContent="center"
        >
          {expertise.length > 0 ? (
            expertise.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                sx={{
                  bgcolor: colors.chipBg,
                  color: colors.chipText,
                  fontWeight: 600,
                  mb: 0.5,
                }}
              />
            ))
          ) : (
            <Chip label="No expertise listed" size="small" />
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} mt={2}>
          <StarIcon sx={{ color: "#ffc107" }} />
          <Typography fontWeight={600} color="#1a237e">{rating}</Typography>
        </Stack>

        <Box mt={2} width="100%">
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate(`/mentor/${_id}`)}
            sx={{
              bgcolor: colors.accent,
              fontWeight: 700,
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "0 4px 14px rgba(21,101,192,0.3)",
              "&:hover": { bgcolor: colors.accentLight },
            }}
          >
            View Profile
          </Button>

          {status === "accepted" ? (
            <Button
              variant="outlined"
              fullWidth
              sx={{
                mt: 1, borderRadius: 2, textTransform: "none", fontWeight: 700,
                color: colors.accent, borderColor: colors.accent,
                "&:hover": { bgcolor: colors.accent, color: "#fff" },
              }}
              onClick={handleChat}
            >
              Chat with Mentor
            </Button>
          ) : status === "pending" ? (
            <Button variant="outlined" fullWidth disabled sx={{ mt: 1, borderRadius: 2, textTransform: "none" }}>
              Request Sent
            </Button>
          ) : (
            <Button
              variant="outlined"
              fullWidth
              sx={{
                mt: 1, borderRadius: 2, textTransform: "none", fontWeight: 700,
                color: colors.accent, borderColor: colors.accent,
                "&:hover": { bgcolor: colors.accent, color: "#fff" },
              }}
              onClick={handleMentorRequest}
            >
              Request Mentorship
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default MentorCard;
