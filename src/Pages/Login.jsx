import {
  TextField,
  Button,
  Container,
  Typography,
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

const Login = () => {
  const navigate = useNavigate();

  // Premium Theme Colors
  const colors = {
    bg: "#030014",
    accent: "#7000ff",
    glass: "rgba(255, 255, 255, 0.03)",
    textDim: "rgba(255, 255, 255, 0.6)",
  };

  useEffect(() => {
    // Entrance animation for the login card
    gsap.fromTo(
      ".login-card",
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power4.out" }
    );
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(
        "https://startup-backend-1-cj33.onrender.com/api/auth/login",
        formData
      );
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login successful!");
      navigate("/dashboard"); // Updated to dashboard for consistent flow
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Login failed");
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      loginMutation.mutate(values);
    },
  });

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
        pt: 8, // Adjust for fixed navbar
      }}
    >
      {/* Background Decorative Glow */}
      <Box
        sx={{
          position: "absolute",
          width: "40vw",
          height: "40vw",
          background: `radial-gradient(circle, rgba(112,0,255,0.15) 0%, transparent 70%)`,
          filter: "blur(60px)",
          top: "-10%",
          right: "-10%",
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          className="login-card"
          sx={{
            p: { xs: 4, md: 6 },
            background: colors.glass,
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "32px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          <Stack spacing={1} alignItems="center" sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                background: "linear-gradient(to right, #fff, #b983ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-1px",
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textDim }}>
              Enter your credentials to access your account
            </Typography>
          </Stack>

          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                {...formik.getFieldProps("email")}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    borderRadius: "14px",
                    bgcolor: "rgba(255,255,255,0.03)",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                    "&:hover fieldset": { borderColor: colors.accent },
                  },
                  "& .MuiInputLabel-root": { color: colors.textDim },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                {...formik.getFieldProps("password")}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    borderRadius: "14px",
                    bgcolor: "rgba(255,255,255,0.03)",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                    "&:hover fieldset": { borderColor: colors.accent },
                  },
                  "& .MuiInputLabel-root": { color: colors.textDim },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loginMutation.isPending}
                sx={{
                  py: 1.8,
                  borderRadius: "14px",
                  bgcolor: colors.accent,
                  fontWeight: 800,
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow: `0 10px 20px rgba(112,0,255,0.3)`,
                  "&:hover": { bgcolor: "#5a00cc" },
                }}
              >
                {loginMutation.isPending ? "Authenticating..." : "Sign In"}
              </Button>

              <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.05)" }}>
                <Typography variant="caption" sx={{ color: colors.textDim }}>
                  OR
                </Typography>
              </Divider>

              <Typography
                variant="body2"
                align="center"
                sx={{ color: colors.textDim }}
              >
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    color: colors.accent,
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Create one now
                </Link>
              </Typography>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;