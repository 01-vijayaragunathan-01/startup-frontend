import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Box,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";
import gsap from "gsap";

const Register = () => {
  const navigate = useNavigate();

  const colors = {
    bg: "#f0f4ff",
    accent: "#1565c0",
    accentLight: "#1e88e5",
    glass: "#ffffff",
    textDim: "#546e7a",
    border: "rgba(21, 101, 192, 0.18)",
  };

  useEffect(() => {
    gsap.fromTo(
      ".register-card",
      { opacity: 0, y: 40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power4.out" }
    );
  }, []);

  const registerMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(
        "https://startup-backend-1-cj33.onrender.com/api/auth/register",
        formData
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Registered successfully!");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Registration failed");
    },
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", role: "student" },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(6, "Must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: (values) => registerMutation.mutate(values),
  });

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      bgcolor: "#f8faff",
      "& fieldset": { borderColor: colors.border },
      "&:hover fieldset": { borderColor: colors.accent },
      "&.Mui-focused fieldset": { borderColor: colors.accent },
    },
    "& .MuiInputLabel-root": { color: colors.textDim },
    "& .MuiInputLabel-root.Mui-focused": { color: colors.accent },
    mb: 2.5,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        py: 8,
      }}
    >
      {/* Decorative blue glow */}
      <Box
        sx={{
          position: "absolute",
          width: "50vw",
          height: "50vw",
          background: `radial-gradient(circle, rgba(21,101,192,0.1) 0%, transparent 70%)`,
          filter: "blur(80px)",
          bottom: "-15%",
          left: "-10%",
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          className="register-card"
          elevation={0}
          sx={{
            p: { xs: 4, md: 5 },
            background: colors.glass,
            border: `1px solid ${colors.border}`,
            borderRadius: "32px",
            boxShadow: "0 25px 60px rgba(21,101,192,0.12)",
          }}
        >
          <Stack spacing={1} alignItems="center" sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                background: `linear-gradient(to right, ${colors.accent}, ${colors.accentLight})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-1px",
              }}
            >
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textDim }}>
              Join the Mentor Mentee ecosystem today
            </Typography>
          </Stack>

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth label="Full Name"
              {...formik.getFieldProps("name")}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={inputStyles}
            />
            <TextField
              fullWidth label="Email Address"
              {...formik.getFieldProps("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={inputStyles}
            />
            <TextField
              fullWidth label="Password" type="password"
              {...formik.getFieldProps("password")}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={inputStyles}
            />
            <TextField
              select fullWidth label="I am a..."
              {...formik.getFieldProps("role")}
              sx={inputStyles}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      bgcolor: "#fff",
                      color: "#1a237e",
                      borderRadius: "12px",
                      border: `1px solid ${colors.border}`,
                      boxShadow: "0 8px 24px rgba(21,101,192,0.12)",
                    },
                  },
                },
              }}
            >
              <MenuItem value="student">Student / Mentee</MenuItem>
              <MenuItem value="mentor">Expert / Mentor</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={registerMutation.isPending}
              sx={{
                py: 2,
                mt: 1,
                borderRadius: "14px",
                bgcolor: colors.accent,
                fontWeight: 800,
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: `0 10px 24px rgba(21,101,192,0.3)`,
                "&:hover": {
                  bgcolor: colors.accentLight,
                  transform: "translateY(-2px)",
                  boxShadow: `0 16px 32px rgba(21,101,192,0.4)`,
                },
                transition: "all 0.3s ease",
              }}
            >
              {registerMutation.isPending ? "Creating Account..." : "Join Now"}
            </Button>

            <Divider sx={{ my: 3, borderColor: colors.border }}>
              <Typography variant="caption" sx={{ color: colors.textDim }}>
                ALREADY HAVE AN ACCOUNT?
              </Typography>
            </Divider>

            <Typography variant="body2" align="center" sx={{ color: colors.textDim }}>
              Ready to mastery?{" "}
              <Link to="/login" style={{ color: colors.accent, textDecoration: "none", fontWeight: 700 }}>
                Log In
              </Link>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;