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
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Login failed");
    },
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => loginMutation.mutate(values),
  });

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      bgcolor: "#f8faff",
      "& fieldset": { borderColor: colors.border },
      "&:hover fieldset": { borderColor: colors.accent },
      "&.Mui-focused fieldset": { borderColor: colors.accent },
    },
    "& .MuiInputLabel-root": { color: colors.textDim },
    "& .MuiInputLabel-root.Mui-focused": { color: colors.accent },
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
        pt: 8,
      }}
    >
      {/* Decorative blue glow */}
      <Box
        sx={{
          position: "absolute",
          width: "40vw",
          height: "40vw",
          background: `radial-gradient(circle, rgba(21,101,192,0.12) 0%, transparent 70%)`,
          filter: "blur(60px)",
          top: "-10%",
          right: "-10%",
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          className="login-card"
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            background: colors.glass,
            border: `1px solid ${colors.border}`,
            borderRadius: "32px",
            boxShadow: "0 20px 60px rgba(21,101,192,0.1)",
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
                sx={inputSx}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                {...formik.getFieldProps("password")}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                sx={inputSx}
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
                  boxShadow: `0 10px 20px rgba(21,101,192,0.3)`,
                  "&:hover": { bgcolor: colors.accentLight, transform: "translateY(-2px)", boxShadow: "0 14px 28px rgba(21,101,192,0.4)" },
                  transition: "all 0.3s ease",
                }}
              >
                {loginMutation.isPending ? "Authenticating..." : "Sign In"}
              </Button>

              <Divider sx={{ my: 1, borderColor: colors.border }}>
                <Typography variant="caption" sx={{ color: colors.textDim }}>OR</Typography>
              </Divider>

              <Typography variant="body2" align="center" sx={{ color: colors.textDim }}>
                Don't have an account?{" "}
                <Link to="/register" style={{ color: colors.accent, textDecoration: "none", fontWeight: 700 }}>
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