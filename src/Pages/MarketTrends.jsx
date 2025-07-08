import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Link as MuiLink,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import toast from "react-hot-toast";

const MarketTrends = () => {
  const [resources, setResources] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/resources");
      setResources(res.data);
    } catch (error) {
      console.error("Failed to load resources", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Resource deleted");
      setResources(resources.filter((r) => r._id !== id));
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <Box sx={{ py: 6, px: { xs: 2, sm: 4 }, background: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h3" align="center" fontWeight="bold" gutterBottom data-aos="fade-down">
        📈 Market Trends & Resources
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" mb={4} data-aos="fade-up">
        Explore curated tools, blogs, insights, and market reports for your startup journey.
      </Typography>

      {resources.length === 0 ? (
        <Typography align="center" color="text.secondary" mt={4}>
          No resources available yet.
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
              <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 4 }}>
                {resource.image && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={resource.image}
                    alt={resource.title}
                    sx={{ objectFit: "cover" }}
                  />
                )}
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                      label={resource.type.toUpperCase()}
                      color="primary"
                      size="small"
                    />
                    {user?.role === "mentor" && (
                      <Tooltip title="Delete this resource">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(resource._id)}
                          sx={{ color: "red" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  <Typography variant="h6" fontWeight="bold" mt={1}>
                    {resource.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {resource.description}
                  </Typography>

                  <MuiLink
                    href={resource.link}
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    color="primary"
                    sx={{ mt: 2, display: "inline-block", fontWeight: "bold" }}
                  >
                    🔗 Read More
                  </MuiLink>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MarketTrends;
