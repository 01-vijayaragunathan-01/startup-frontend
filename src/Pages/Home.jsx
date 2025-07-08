import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      {/* Hero Section */}
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6} data-aos="fade-right">
          <Typography
            variant={isSmall ? "h4" : "h3"}
            fontWeight="bold"
            gutterBottom
            sx={{
              background: "black",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Empowering Startups, Connecting Mentors
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Join the most powerful mentorship platform designed to guide startups from
            grassroots to greatness.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              mt: 2,
              textTransform: "uppercase",
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              borderRadius: 2,
            }}
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </Grid>

        <Grid item xs={12} md={6} data-aos="zoom-in">
          <Box
            component="img"
            src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
            alt="Mentorship illustration"
            sx={{
              width: "100%",
              maxWidth: 500,
              borderRadius: 3,
              mx: "auto",
              display: "block",
              boxShadow: 4,
            }}
          />
        </Grid>
      </Grid>
      
      {/* Features Section */}
      <Box mt={10}>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          data-aos="fade-up"
          sx={{
            color: "black",
          }}
        >
          Why Choose Mentor Metee?
        </Typography>

        <Grid container spacing={4} mt={2}>
          {[
            {
              title: "Find the Right Mentor",
              desc: "Connect with experienced professionals tailored to your startup domain.",
              img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            },
            {
              title: "Track Your Growth",
              desc: "Get insights, feedback, and personalized mentorship plans.",
              img: "https://cdn-icons-png.flaticon.com/512/4741/4741130.png",
            },
            {
              title: "Access Market Resources",
              desc: "Stay updated with industry trends, startup news, and tools.",
              img: "https://cdn-icons-png.flaticon.com/512/3794/3794515.png",
            },
          ].map((feature, i) => (
            <Grid
              item
              xs={12}
              md={4}
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 200}
            >
              <Box
                textAlign="center"
                p={4}
                sx={{
                  borderRadius: 4,
                  boxShadow: 3,
                  backgroundColor: "#ffffff",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                    backgroundColor: "#f5faff",
                  },
                }}
              >
                <Box
                  component="img"
                  src={feature.img}
                  alt={feature.title}
                  sx={{ height: 80, mb: 2 }}
                />
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" mt={1}>
                  {feature.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
