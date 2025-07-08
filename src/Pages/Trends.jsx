import { Box, Typography, Grid, Paper } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InsightsIcon from "@mui/icons-material/Insights";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AOS from "aos";
import { useEffect } from "react";

const insights = [
  {
    title: "Startup Growth Trends",
    desc: "Understand how startups in India are scaling with minimal investment.",
    icon: <TrendingUpIcon fontSize="large" />,
    bg: "linear-gradient(135deg, #1CB5E0 0%, #000851 100%)",
  },
  {
    title: "Investor Interest Areas",
    desc: "What sectors are hot? AI, Green Tech, Fintech — find the top trends.",
    icon: <InsightsIcon fontSize="large" />,
    bg: "linear-gradient(135deg, #F7971E 0%, #FFD200 100%)",
  },
  {
    title: "College Startup Insights",
    desc: "How grassroots innovators are solving real problems in colleges.",
    icon: <ShowChartIcon fontSize="large" />,
    bg: "linear-gradient(135deg, #6D6027 0%, #D3CBB8 100%)",
  },
];

const Trends = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 6,
        px: 3,
        background: "radial-gradient(circle, #e0f7fa, #ffffff)",
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
        align="center"
        gutterBottom
        data-aos="fade-down"
      >
        Market Trends & Insights
      </Typography>

      <Typography
        variant="h6"
        align="center"
        color="text.secondary"
        mb={6}
        data-aos="fade-up"
      >
        Stay ahead by learning where the startup world is heading.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {insights.map((trend, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx} data-aos="zoom-in">
            <Paper
              elevation={6}
              sx={{
                p: 4,
                height: "100%",
                borderRadius: 4,
                background: trend.bg,
                color: "#fff",
                boxShadow: 6,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box>{trend.icon}</Box>
              <Typography variant="h6" fontWeight="bold">
                {trend.title}
              </Typography>
              <Typography variant="body2">{trend.desc}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Trends;
