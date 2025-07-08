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
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import axios from "axios";
import toast from "react-hot-toast";
import MentorCard from "../components/MentorCard";

const Dashboard = () => {
  const [studentRequests, setStudentRequests] = useState([]);
  const [mentorProfile, setMentorProfile] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchData = async () => {
      try {
        if (user?.role === "mentor") {
          const reqRes = await axios.get("https://startup-backend-1-cj33.onrender.com/api/mentorship/requests", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStudentRequests(reqRes.data.requests);

          const profileRes = await axios.get("https://startup-backend-1-cj33.onrender.com/api/profile/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMentorProfile(profileRes.data);
        } else if (user?.role === "student") {
          const mentorRes = await axios.get("https://startup-backend-1-cj33.onrender.com/api/mentors");
          setMentors(mentorRes.data);

          const reqRes = await axios.get("https://startup-backend-1-cj33.onrender.com/api/mentorship/my-requests", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMyRequests(reqRes.data.requests || []);
        }

        // Fetch recent chats for both roles
        const chatRes = await axios.get("https://startup-backend-1-cj33.onrender.com/api/messages/contacts/recent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentChats(chatRes.data);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      }
    };

    fetchData();
  }, [user?.role]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 6,
        px: 3,
        background: "radial-gradient(circle, #e3f2fd, #ffffff)",
      }}
    >
      <Typography variant="h3" fontWeight="bold" align="center" gutterBottom data-aos="fade-down">
        Welcome to Your Dashboard
      </Typography>

      <Typography variant="h6" align="center" color="text.secondary" mb={6} data-aos="fade-up">
        {user?.role === "mentor"
          ? "Here are students who requested your mentorship and your public profile."
          : "Find mentors, request help, and start your mentorship journey."}
      </Typography>

      {/* MENTOR VIEW */}
      {user?.role === "mentor" ? (
        <>
          <Box>
            <Typography variant="h5" mb={2}>
              Student Requests
            </Typography>
            {studentRequests.length === 0 ? (
              <Typography>No requests yet.</Typography>
            ) : (
              <List>
                {studentRequests.map((req, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      background: "#fff",
                      mb: 1,
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <ListItemText
                      primary={req.student.name}
                      secondary={`Email: ${req.student.email}`}
                    />
                    <Button
                      variant="outlined"
                      onClick={() =>
                        navigate("/chat", {
                          state: {
                            receiverId: req.student._id,
                            receiverName: req.student.name,
                          },
                        })
                      }
                    >
                      Chat
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* MENTOR RECENT CHATS */}
          {recentChats.length > 0 && (
            <>
              <Typography variant="h5" mt={6} mb={2}>
                Recent Chats
              </Typography>
              <List>
                {recentChats
                  .filter((person) => person && person.name)
                  .map((person) => (
                    <ListItem
                      key={person._id}
                      sx={{
                        background: "#f9f9f9",
                        mb: 1,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        navigate("/chat", {
                          state: {
                            receiverId: person._id,
                            receiverName: person.name,
                          },
                        })
                      }
                    >
                      <Avatar src={person.avatar} sx={{ mr: 2 }} />
                      <ListItemText primary={person.name} />
                    </ListItem>
                  ))}
              </List>
            </>
          )}

          {/* MENTOR PROFILE CARD */}
          {mentorProfile && (
            <Box
              mt={5}
              mx="auto"
              maxWidth="600px"
              sx={{
                backdropFilter: "blur(6px)",
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: 6,
                backgroundColor: "rgba(255,255,255,0.95)",
              }}
              data-aos="fade-up"
            >
              {mentorProfile.banner && (
                <Box
                  component="img"
                  src={mentorProfile.banner}
                  alt="Banner"
                  sx={{ width: "100%", height: "180px", objectFit: "cover" }}
                />
              )}

              <Box sx={{ p: 3, textAlign: "center" }}>
                <Avatar
                  src={mentorProfile.avatar}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mt: -8,
                    border: "4px solid white",
                  }}
                />
                <Typography variant="h5" fontWeight="bold" mt={1}>
                  {mentorProfile.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" mt={1}>
                  {mentorProfile.about}
                </Typography>

                <Box mt={2} display="flex" flexWrap="wrap" justifyContent="center" gap={1}>
                  {mentorProfile.expertise?.map((skill, idx) => (
                    <Chip key={idx} label={skill} color="primary" />
                  ))}
                </Box>

                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 3 }}
                  component={Link}
                  to="/my-profile"
                >
                  Edit Profile
                </Button>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <>
          {/* STUDENT: EXPLORE MENTORS */}
          <Typography variant="h5" mb={3}>
            Explore Mentors
          </Typography>
          {mentors.length === 0 ? (
            <Typography>No mentors available right now.</Typography>
          ) : (
            <Grid container spacing={4}>
              {mentors.map((mentor) => {
                const matchedRequest = myRequests.find(
                  (req) => req.mentor._id === mentor._id
                );
                const status = matchedRequest?.status || null;

                return (
                  <Grid item xs={12} sm={6} md={4} key={mentor._id}>
                    <MentorCard mentor={mentor} mentorshipStatus={status} />
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* STUDENT: RECENT CHATS */}
          {recentChats.length > 0 && (
            <>
              <Typography variant="h5" mt={5} mb={2}>
                Recent Chats
              </Typography>
              <List>
                {recentChats.map((person) => (
                  <ListItem
                    key={person._id}
                    sx={{
                      background: "#f9f9f9",
                      mb: 1,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate("/chat", {
                        state: {
                          receiverId: person._id,
                          receiverName: person.name,
                        },
                      })
                    }
                  >
                    <Avatar src={person.avatar} sx={{ mr: 2 }} />
                    <ListItemText primary={person.name} />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {/* STUDENT: ACCEPTED MENTORS */}
          {myRequests.some((req) => req.status === "accepted") && (
            <>
              <Typography variant="h5" mt={5} mb={2}>
                Your Mentors
              </Typography>
              <List>
                {myRequests
                  .filter((req) => req.status === "accepted")
                  .map((req, i) => (
                    <ListItem
                      key={i}
                      sx={{
                        background: "#fff",
                        mb: 1,
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <ListItemText
                        primary={req.mentor.name}
                        secondary={`Email: ${req.mentor.email}`}
                      />
                      <Button
                        variant="outlined"
                        onClick={() =>
                          navigate("/chat", {
                            state: {
                              receiverId: req.mentor._id,
                              receiverName: req.mentor.name,
                            },
                          })
                        }
                      >
                        Chat
                      </Button>
                    </ListItem>
                  ))}
              </List>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default Dashboard;
