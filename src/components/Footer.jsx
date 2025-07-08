import { Box, Typography, Container, Grid, Divider } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#1a1a1a",
        color: "#fff",
        mt: 10,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Project Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Mentor Metee
            </Typography>
            <Typography variant="body2" color="gray">
              Empowering startups and connecting mentors. A community-driven platform for aspiring innovators.
            </Typography>
          </Grid>

          {/* Team Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Developed By
            </Typography>
            <Typography variant="body2">👑 Leader: Vijayaragunathan</Typography>
            <Typography variant="body2">🤝 Teammates: Tarunkumar, Ajay, Vishal</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              📧 Email: ragunathanvijay68@gmail.com
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: "#555" }} />

        <Typography variant="body2" align="center" color="gray">
          © {new Date().getFullYear()} Mentor Metee. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
