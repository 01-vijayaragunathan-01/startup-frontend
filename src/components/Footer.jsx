import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";

const Footer = () => {
  // Theme Constants to match Home.jsx
  const colors = {
    bg: "#030014",
    accent: "#7000ff",
    textDim: "rgba(255, 255, 255, 0.6)",
    glassBorder: "rgba(255, 255, 255, 0.08)",
  };

  const footerLinkStyle = {
    color: colors.textDim,
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "0.3s",
    "&:hover": {
      color: colors.accent,
      transform: "translateX(5px)",
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: colors.bg,
        pt: 10,
        pb: 4,
        borderTop: `1px solid ${colors.glassBorder}`,
        position: "relative",
        zIndex: 2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Brand & Mission */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{
                mb: 2,
                background: "linear-gradient(to right, #fff, #b983ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: -1,
                cursor: "pointer",
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Mentor Mentee
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textDim, mb: 3, lineHeight: 1.8 }}>
              Empowering the next generation of engineers through high-precision 
              matchmaking and real-time collaborative mentorship.
            </Typography>
            <Stack direction="row" spacing={1}>
              {[
                { icon: <GitHubIcon />, link: "#" },
                { icon: <LinkedInIcon />, link: "#" },
                { icon: <TwitterIcon />, link: "#" },
                { icon: <LanguageIcon />, link: "#" },
              ].map((social, i) => (
                <IconButton
                  key={i}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.03)",
                    border: `1px solid ${colors.glassBorder}`,
                    "&:hover": {
                      bgcolor: colors.accent,
                      borderColor: colors.accent,
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3, color: "white" }}>
              Platform
            </Typography>
            <Stack spacing={2}>
              {["Find Mentors", "How it Works", "Pricing", "Success Stories"].map((text) => (
                <Typography key={text} sx={footerLinkStyle}>
                  {text}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Support */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3, color: "white" }}>
              Support
            </Typography>
            <Stack spacing={2}>
              {["Help Center", "Safety Center", "Community Guidelines", "Contact Us"].map((text) => (
                <Typography key={text} sx={footerLinkStyle}>
                  {text}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Live System Status */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3, color: "white" }}>
              System Status
            </Typography>
            <Box
              sx={{
                p: 3,
                borderRadius: "20px",
                bgcolor: "rgba(112,0,255,0.05)",
                border: `1px solid rgba(112,0,255,0.2)`,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#27c93f",
                    boxShadow: "0 0 10px #27c93f",
                    animation: "pulse 2s infinite",
                  }}
                />
                <Typography variant="caption" fontWeight={800} sx={{ color: "white", letterSpacing: 1 }}>
                  142 MENTORS ONLINE
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: colors.textDim, fontSize: "0.8rem" }}>
                Our matching engine is currently processing at peak efficiency. 
                Avg. match time: 4.2 mins.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, borderColor: "rgba(255,255,255,0.05)" }} />

        {/* Legal & Copyright */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="caption" sx={{ color: colors.textDim }}>
            © 2026 Mentor Mentee. All rights reserved. Built for innovators.
          </Typography>
          <Stack direction="row" spacing={4}>
            {["Privacy", "Terms", "Cookies"].map((text) => (
              <Typography
                key={text}
                variant="caption"
                sx={{
                  color: colors.textDim,
                  cursor: "pointer",
                  "&:hover": { color: colors.accent },
                }}
              >
                {text}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Container>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(0.95); opacity: 0.8; }
            70% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(0.95); opacity: 0.8; }
          }
        `}
      </style>
    </Box>
  );
};

export default Footer;