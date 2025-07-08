import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Chip,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

const MentorProfile = () => {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/mentors/${id}`);
        setMentor(data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load mentor profile");
        setLoading(false);
      }
    };
    fetchMentor();
  }, [id]);

  const handleRequest = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/mentorship/request",
        { mentorId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Request sent successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    }
  };

  if (loading) {
    return (
      <Box mt={10} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!mentor) {
    return (
      <Box mt={10} textAlign="center">
        <Typography variant="h5" color="error">
          Mentor not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#f5f5f5", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 4,
            boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
          }}
        >
          {/* Banner */}
          {mentor.banner && (
            <Box
              sx={{
                height: 220,
                backgroundImage: `url(${mentor.banner})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}

          {/* Avatar overlapping banner */}
          <Avatar
            src={mentor.avatar}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid white",
              position: "absolute",
              top: 160,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1,
              bgcolor: "#1976d2",
              fontSize: 40,
            }}
          >
            {mentor.name[0]}
          </Avatar>

          {/* Content */}
          <Box pt={10} pb={5} px={4} textAlign="center">
            <Typography variant="h5" fontWeight="bold">
              {mentor.name}
            </Typography>

            <Typography variant="body1" color="text.secondary" mt={1}>
              {mentor.about || "No bio provided"}
            </Typography>

            <Box mt={2} display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
              <Typography variant="h5" fontSize={"23px"} fontWeight="bold">
                Expertise :
              </Typography>
              {mentor.expertise?.map((skill, i) => (
                <Chip key={i} label={skill} color="primary" variant="outlined" />
              ))}
            </Box>

            <Box mt={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRequest}
                size="large"
              >
                Request Mentorship
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default MentorProfile;
