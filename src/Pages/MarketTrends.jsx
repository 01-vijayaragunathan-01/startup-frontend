import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Link as MuiLink,
  IconButton,
  Tooltip,
  Container,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LaunchIcon from "@mui/icons-material/Launch";
import axios from "axios";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import toast from "react-hot-toast";

const MarketTrends = () => {
  const [resources, setResources] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Premium Theme Colors
  const colors = {
    bg: "#030014",
    accent: "#7000ff",
    glass: "rgba(255, 255, 255, 0.03)",
    glassBorder: "rgba(255, 255, 255, 0.08)",
    textDim: "rgba(255, 255, 255, 0.6)",
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await axios.get("https://startup-backend-1-cj33.onrender.com/api/resources");
      setResources(res.data);
    } catch (error) {
      console.error("Failed to load resources", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://startup-backend-1-cj33.onrender.com/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Resource deleted");
      setResources(resources.filter((r) => r._id !== id));
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <Box 
      sx={{ 
        py: 12, 
        px: { xs: 2, sm: 4 }, 
        bgcolor: colors.bg, 
        minHeight: "100vh",
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Decorative Glow */}
      <Box sx={{
        position: 'absolute',
        top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '80vw', height: '400px',
        background: `radial-gradient(circle, rgba(112,0,255,0.1) 0%, transparent 70%)`,
        filter: 'blur(100px)',
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={2} alignItems="center" sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            align="center" 
            fontWeight={900} 
            data-aos="fade-down"
            sx={{
              background: "linear-gradient(to right, #fff, #b983ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -1
            }}
          >
            Market Trends & Resources
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            sx={{ color: colors.textDim, maxWidth: 600 }} 
            data-aos="fade-up"
          >
            Curated tools, insights, and global reports to accelerate your journey.
          </Typography>
        </Stack>

        {resources.length === 0 ? (
          <Typography align="center" sx={{ color: colors.textDim, mt: 10 }}>
            No resources available yet. Check back soon.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {resources.map((resource, idx) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={resource._id}
                data-aos="zoom-in"
                data-aos-delay={idx * 100}
              >
                <Card 
                  sx={{ 
                    height: "100%", 
                    borderRadius: "24px", 
                    bgcolor: colors.glass,
                    backdropFilter: "blur(12px)",
                    border: `1px solid ${colors.glassBorder}`,
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      borderColor: colors.accent,
                      boxShadow: `0 20px 40px rgba(112,0,255,0.15)`,
                    }
                  }}
                >
                  {resource.image && (
                    <Box sx={{ position: 'relative', overflow: 'hidden', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={resource.image}
                        alt={resource.title}
                        sx={{ 
                          objectFit: "cover",
                          transition: "transform 0.6s ease",
                          ".MuiCard-root:hover &": { transform: "scale(1.1)" }
                        }}
                      />
                      <Box sx={{
                        position: 'absolute',
                        top: 12, left: 12,
                        zIndex: 2
                      }}>
                        <Chip
                          label={resource.type.toUpperCase()}
                          size="small"
                          sx={{ 
                            bgcolor: colors.accent, 
                            color: 'white', 
                            fontWeight: 800,
                            fontSize: '0.65rem',
                            letterSpacing: 1
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                  
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" fontWeight={800} sx={{ color: 'white', lineHeight: 1.3, mb: 1 }}>
                        {resource.title}
                      </Typography>
                      {user?.role === "mentor" && (
                        <Tooltip title="Delete Resource">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(resource._id)}
                            sx={{ 
                              color: "rgba(255,255,255,0.3)",
                              "&:hover": { color: "#ff4d4d" }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>

                    <Typography variant="body2" sx={{ color: colors.textDim, mb: 3, height: '3.6em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {resource.description}
                    </Typography>

                    <MuiLink
                      href={resource.link}
                      target="_blank"
                      rel="noopener"
                      sx={{ 
                        textDecoration: "none",
                        color: colors.accent,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontSize: '0.9rem',
                        transition: '0.2s',
                        "&:hover": { color: '#fff' }
                      }}
                    >
                      Read Report <LaunchIcon sx={{ fontSize: 16 }} />
                    </MuiLink>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MarketTrends;