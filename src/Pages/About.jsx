import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Slide,
  Divider,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";

const teamMembers = [
  { name: "Vijayaragunathan", role: "Team Lead", avatar: "V" },
  { name: "Tarunkumar", role: "Frontend Developer", avatar: "T" },
  { name: "Ajay", role: "Backend Developer", avatar: "A" },
  { name: "Vishal", role: "UI/UX Designer", avatar: "V" },
];

const About = () => {
  return (
    <Box
      sx={{
        py: 8,
        background: "linear-gradient(to bottom, #e3f2fd, #ffffff)",
      }}
    >
      <Container maxWidth="lg">
        {/* Intro */}
        <Slide direction="down" in timeout={800}>
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight="bold" color="primary">
              About Mentor Metee
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              maxWidth={700}
              mx="auto"
              mt={2}
            >
              We’re a platform empowering student-led startups with expert guidance,
              real-time tools, and a mission to make innovation mainstream.
            </Typography>
          </Box>
        </Slide>

        {/* Core Sections */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={6}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 4,
                height: "100%",
                backgroundColor: "#ffffff",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                },
              }}
            >
              <RocketLaunchIcon color="primary" fontSize="large" />
              <Typography variant="h6" fontWeight="bold" mt={2}>
                Our Mission
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                To ignite entrepreneurial spirit in students by connecting them with
                mentors and a startup ecosystem tailored for college founders.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={6}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 4,
                height: "100%",
                backgroundColor: "#ffffff",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                },
              }}
            >
              <GroupIcon color="secondary" fontSize="large" />
              <Typography variant="h6" fontWeight="bold" mt={2}>
                Our Platform
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Real-time chat, mentorship sessions, growth tracking, and
                resource-rich tools — all designed to support student startups.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={6}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 4,
                height: "100%",
                backgroundColor: "#ffffff",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                },
              }}
            >
              <TipsAndUpdatesIcon color="success" fontSize="large" />
              <Typography variant="h6" fontWeight="bold" mt={2}>
                Why Mentor Metee?
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Smart mentor-matching, startup insights, and a passionate student-driven
                team pushing the boundaries of grassroots innovation.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 8 }} />

        {/* Team Section */}
        <Box textAlign="center" mb={5}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Meet the Founding Team
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Students. Builders. Dreamers. We're the team behind the vision.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 4,
                  transition: "all 0.3s",
                  "&:hover": {
                    backgroundColor: "#f0f4f8",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#1976d2",
                    mx: "auto",
                    width: 64,
                    height: 64,
                    fontSize: 28,
                    fontWeight: "bold",
                  }}
                >
                  {member.avatar}
                </Avatar>
                <Typography mt={2} fontWeight="bold">
                  {member.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.role}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
