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

      const res = await axios.post(
        "http://localhost:5000/api/mentorship/request",
        { mentorId: _id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus("pending");
      toast.success("Mentorship request sent!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send request"
      );
    }
  };

  const handleChat = () => {
    navigate("/chat", {
      state: { receiverId: _id, receiverName: name },
    });
  };

  return (
    <Card
      elevation={6}
      sx={{
        width: 300,
        height: "100%",
        p: 2,
        borderRadius: 4,
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar
          src={avatar}
          sx={{
            bgcolor: "#1976d2",
            width: 80,
            height: 80,
            fontSize: 32,
            mb: 2,
          }}
        >
          {!avatar && name?.[0]?.toUpperCase()}
        </Avatar>

        <Typography variant="h6" fontWeight="bold" textAlign="center">
          {name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mt={0.5}
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
                  bgcolor: "#e3f2fd",
                  color: "#1976d2",
                  fontWeight: 500,
                }}
              />
            ))
          ) : (
            <Chip label="No expertise listed" size="small" />
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} mt={2}>
          <StarIcon sx={{ color: "#ffc107" }} />
          <Typography fontWeight={500}>{rating}</Typography>
        </Stack>

        <Box mt={2} width="100%">
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={() => navigate(`/mentor/${_id}`)}
          >
            View Profile
          </Button>

          {status === "accepted" ? (
            <Button
              variant="outlined"
              fullWidth
              color="secondary"
              sx={{ mt: 1 }}
              onClick={handleChat}
            >
              Chat with Mentor
            </Button>
          ) : status === "pending" ? (
            <Button
              variant="outlined"
              fullWidth
              disabled
              sx={{ mt: 1 }}
            >
              Request Sent
            </Button>
          ) : (
            <Button
              variant="outlined"
              fullWidth
              color="secondary"
              sx={{ mt: 1 }}
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
