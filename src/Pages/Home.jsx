import {
  Box, Container, Typography, Button, Grid, Stack, Avatar, AvatarGroup,
  useTheme, useMediaQuery, Divider, Chip,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import StarIcon        from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChatIcon        from "@mui/icons-material/Chat";
import SchoolIcon      from "@mui/icons-material/School";
import PersonIcon      from "@mui/icons-material/Person";
import HistoryEduIcon  from "@mui/icons-material/HistoryEdu";
import SmartToyIcon    from "@mui/icons-material/SmartToy";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const C = {
  bg:        "#f0f4ff",
  white:     "#ffffff",
  accent:    "#1565c0",
  accentAlt: "#1e88e5",
  dark:      "#1a237e",
  textDim:   "#546e7a",
  border:    "rgba(21,101,192,0.13)",
  deepBg:    "#0a0f2e",
  deepBg2:   "#0d1640",
};

// ── Data ─────────────────────────────────────────────────────────────────────

const steps = [
  { num: "01", title: "Create Your Profile",     desc: "Sign up as a student or mentor and complete your academic profile in under 3 minutes." },
  { num: "02", title: "Find Your Perfect Match", desc: "Browse verified SRM mentors by expertise, department, and availability." },
  { num: "03", title: "Connect & Grow",          desc: "Request mentorship, start real-time chat, and track your academic journey together." },
];

const allInOneFeatures = [
  { icon: <PersonIcon sx={{ fontSize: 28 }} />,      label: "Student Portal",    desc: "Complete academic profile, blood group, admission no, guardian details — all secured.", color: "#1e88e5" },
  { icon: <PersonIcon sx={{ fontSize: 28 }} />,      label: "Mentor Dashboard",  desc: "Track connected students, view their semester GPA & achievements in real time.",         color: "#1565c0" },
  { icon: <ChatIcon sx={{ fontSize: 28 }} />,         label: "Live Chat",         desc: "Real-time messaging between mentors and mentees — no third-party apps needed.",          color: "#0288d1" },
  { icon: <HistoryEduIcon sx={{ fontSize: 28 }} />,   label: "Student History",   desc: "Semester-by-semester academic ledger with PDF export — shareable with anyone.",         color: "#283593" },
  { icon: <SmartToyIcon sx={{ fontSize: 28 }} />,     label: "Smart Matching",    desc: "AI-assisted mentor matching based on your department, goals, and skill gaps.",           color: "#1976d2" },
  { icon: <EmojiEventsIcon sx={{ fontSize: 28 }} />,  label: "Achievements",      desc: "Log certifications, projects, and milestones to build a world-class portfolio.",        color: "#0d47a1" },
];

const praises = [
  "The #1 mentor platform for SRM students",
  "Trusted by 12,000+ students",
  "800+ verified mentors",
  "Real GPA tracking",
  "Instant PDF export",
  "Zero third-party apps needed",
  "Secure academic records",
  "50,000+ sessions done",
];

const testimonials = [
  { name: "Aarav S.",    role: "B.Tech CSE, SRM IST",       text: "My mentor helped me land an internship at Microsoft. The AI match was perfect — same specialization, same goals." },
  { name: "Priya R.",    role: "Mentor — Sr. Engineer",     text: "Mentoring here is seamless. I can track my mentees' real GPA and semester ledger — no more guesswork." },
  { name: "Vikram T.",   role: "M.Tech Student",            text: "From zero connections to three live sessions a week. The chat + scheduling combo is unbeatable." },
  { name: "Sneha M.",    role: "B.Tech ECE, SRM TRP",       text: "The student history PDF feature is incredible. Shared it with my placement office and they were stunned." },
  { name: "Rohan K.",    role: "Mentor — Data Scientist",   text: "I see my students' blood group, academic records, and skills all in one dashboard. Truly comprehensive." },
  { name: "Divya N.",    role: "MBA Student",               text: "Registered Monday, had my first mentor session Thursday. Fastest onboarding I've ever experienced." },
];

const stats = [
  { value: "12,000+", label: "Active Students" },
  { value: "800+",    label: "Verified Mentors" },
  { value: "50,000+", label: "Sessions Completed" },
  { value: "4.9★",    label: "Average Rating" },
];

// ── Component ─────────────────────────────────────────────────────────────────
const Home = () => {
  const [user, setUser] = useState(null);
  const navigate        = useNavigate();
  const theme           = useTheme();
  const isSmall         = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic" });
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleGetStarted = () => navigate(user ? "/dashboard" : "/register");

  return (
    <Box sx={{ bgcolor: C.bg, color: C.dark, overflowX: "hidden" }}>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — full-bleed image, dark overlay, bold text
      ══════════════════════════════════════════════════════════════════════ */}
      <Box sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        backgroundImage: "url('/hero_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}>
        {/* Dark gradient overlay */}
        <Box sx={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(10,15,46,0.88) 0%, rgba(13,22,64,0.80) 50%, rgba(21,101,192,0.55) 100%)",
          zIndex: 1,
        }} />

        {/* Glowing orbs */}
        <Box sx={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", zIndex: 1, top: "10%", right: "-10%", background: "radial-gradient(circle, rgba(30,136,229,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", zIndex: 1, bottom: "5%", left: "-5%", background: "radial-gradient(circle, rgba(21,101,192,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, pt: { xs: 16, md: 20 }, pb: { xs: 12, md: 18 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={4}>
                {/* Badge */}
                <Box data-aos="fade-right">
                  <Chip
                    label="🎓 SRM's #1 Mentor-Mentee Platform"
                    sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", fontWeight: 700, backdropFilter: "blur(10px)", px: 1, fontSize: "0.82rem" }}
                  />
                </Box>

                {/* Main heading */}
                <Typography data-aos="fade-right" data-aos-delay="80"
                  variant={isSmall ? "h3" : "h1"} fontWeight={900}
                  sx={{ letterSpacing: "-0.04em", lineHeight: 1.0, color: "#fff" }}>
                  Learn. Grow.
                  <br />
                  <Box component="span" sx={{
                    background: "linear-gradient(90deg, #60a5fa, #93c5fd, #ffffff)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>
                    Lead Together.
                  </Box>
                </Typography>

                <Typography data-aos="fade-right" data-aos-delay="160"
                  variant="h6" sx={{ color: "rgba(255,255,255,0.75)", fontWeight: 400, lineHeight: 1.7, maxWidth: 520 }}>
                  The world-class mentorship ecosystem built for SRM University students —
                  where every session, every grade, and every breakthrough is tracked in one powerful platform.
                </Typography>

                {/* CTAs */}
                <Stack data-aos="fade-right" data-aos-delay="240" direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button variant="contained" onClick={handleGetStarted} size="large"
                    sx={{
                      background: "linear-gradient(135deg, #1565c0, #1e88e5)",
                      px: 5, py: 1.9, borderRadius: "14px", fontWeight: 800, fontSize: "1rem", textTransform: "none",
                      boxShadow: "0 8px 30px rgba(21,101,192,0.5)",
                      "&:hover": { background: "linear-gradient(135deg, #1e88e5, #42a5f5)", transform: "translateY(-3px)", boxShadow: "0 14px 40px rgba(21,101,192,0.55)" },
                      transition: "all 0.3s ease",
                    }}>
                    {user ? "Go to Dashboard" : "Get Started — Free"}
                  </Button>
                  <Button variant="outlined" size="large"
                    onClick={() => document.getElementById("all-in-one")?.scrollIntoView({ behavior: "smooth" })}
                    sx={{
                      borderColor: "rgba(255,255,255,0.4)", color: "#fff", px: 5, py: 1.9, borderRadius: "14px",
                      fontWeight: 700, textTransform: "none", backdropFilter: "blur(8px)",
                      "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
                    }}>
                    Explore Platform
                  </Button>
                </Stack>

                {/* Social proof */}
                <Stack data-aos="fade-up" data-aos-delay="320" direction="row" alignItems="center" spacing={2} sx={{ pt: 1 }}>
                  <AvatarGroup max={5} sx={{ "& .MuiAvatar-root": { width: 38, height: 38, border: "2px solid rgba(255,255,255,0.4)" } }}>
                    {[1,2,3,4,5].map((i) => <Avatar key={i} src={`https://i.pravatar.cc/100?u=${i}`} />)}
                  </AvatarGroup>
                  <Box>
                    <Typography variant="body2" color="rgba(255,255,255,0.9)" fontWeight={700}>
                      12,000+ students already growing
                    </Typography>
                    <Stack direction="row" spacing={0.3}>
                      {[...Array(5)].map((_, i) => <StarIcon key={i} sx={{ fontSize: 14, color: "#ffc107" }} />)}
                      <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ ml: 0.5 }}>4.9 / 5</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            </Grid>

            {/* ── Right: floating feature pills ── */}
            <Grid item xs={12} md={5} sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center", alignItems: "center" }}>
              <Box sx={{ position: "relative", width: 340, height: 400 }}>
                {/* Centre glow circle */}
                <Box sx={{
                  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                  width: 120, height: 120, borderRadius: "50%",
                  background: "linear-gradient(135deg, #1565c0, #1e88e5)",
                  boxShadow: "0 0 60px rgba(30,136,229,0.6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: 5,
                }}>
                  <SchoolIcon sx={{ fontSize: 52, color: "#fff" }} />
                </Box>
                {/* Orbit ring */}
                <Box sx={{
                  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                  width: 260, height: 260, borderRadius: "50%",
                  border: "1px dashed rgba(255,255,255,0.2)",
                }} />
                {/* Orbiting pills */}
                {[
                  { label: "Student Portal",  top: "5%",  left: "50%",  transform: "translateX(-50%)" },
                  { label: "Mentor View",     top: "30%", left: "88%" },
                  { label: "Live Chat",       top: "70%", left: "88%" },
                  { label: "Student History", top: "85%", left: "50%",  transform: "translateX(-50%)" },
                  { label: "PDF Export",      top: "70%", left: "-18%" },
                  { label: "Smart Match",     top: "30%", left: "-18%" },
                ].map((p, i) => (
                  <Box key={i} data-aos="zoom-in" data-aos-delay={i * 100}
                    sx={{
                      position: "absolute", top: p.top, left: p.left, transform: p.transform || "none",
                      bgcolor: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50px",
                      px: 2, py: 0.8, whiteSpace: "nowrap",
                      animation: `floatY${i % 3} ${3 + i * 0.4}s ease-in-out infinite`,
                    }}>
                    <Typography variant="caption" color="#fff" fontWeight={700}>{p.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Bottom wave */}
        <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2 }}>
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <path fill="#f0f4ff" fillOpacity="1" d="M0,48L80,42.7C160,37,320,27,480,32C640,37,800,59,960,64C1120,69,1280,59,1360,53.3L1440,48L1440,80L0,80Z" />
          </svg>
        </Box>
      </Box>

      {/* ══════════════════════════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <Box sx={{ bgcolor: C.accent, py: 5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {stats.map((s) => (
              <Grid item xs={6} md={3} key={s.label} sx={{ textAlign: "center" }}>
                <Typography variant="h4" fontWeight={900} color="#fff">{s.value}</Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.72)" fontWeight={600}>{s.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════════════════════════════════
          ALL IN ONE — inspired by reference image
          Dark deep-blue bg, HUGE bold text, feature orbit around centre
      ══════════════════════════════════════════════════════════════════════ */}
      <Box id="all-in-one" sx={{ bgcolor: C.deepBg, py: { xs: 14, md: 20 }, position: "relative", overflow: "hidden" }}>
        {/* Background glow blobs */}
        <Box sx={{ position: "absolute", width: 700, height: 700, top: "-20%", right: "-15%", borderRadius: "50%", background: "radial-gradient(circle, rgba(21,101,192,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", width: 500, height: 500, bottom: "-10%", left: "-10%",  borderRadius: "50%", background: "radial-gradient(circle, rgba(30,136,229,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          {/* Section label */}
          <Stack spacing={1} alignItems="center" sx={{ mb: 4 }} data-aos="fade-down">
            <Typography variant="overline" sx={{ color: "rgba(30,136,229,0.9)", fontWeight: 800, letterSpacing: 4, fontSize: "0.72rem" }}>
              THE COMPLETE ECOSYSTEM
            </Typography>
          </Stack>

          {/* BIG headline — reference image style */}
          <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 } }}>
            <Typography data-aos="zoom-in"
              sx={{
                fontSize: { xs: "13vw", sm: "10vw", md: "7.5vw" },
                fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.04em",
                color: "#fff", userSelect: "none",
              }}>
              ALL IN ONE
            </Typography>
            <Typography data-aos="zoom-in" data-aos-delay="80"
              sx={{
                fontSize: { xs: "13vw", sm: "10vw", md: "7.5vw" },
                fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.04em",
                background: "linear-gradient(90deg, #60a5fa 0%, #93c5fd 50%, #1e88e5 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
              PLATFORM.
            </Typography>
            <Typography data-aos="fade-up" data-aos-delay="160"
              variant="h6"
              sx={{ color: "rgba(255,255,255,0.55)", mt: 4, maxWidth: 580, mx: "auto", fontWeight: 400, lineHeight: 1.7 }}>
              Every tool a student and mentor ever needs — connected, seamless, and{" "}
              <Box component="span" sx={{ color: "#60a5fa", fontWeight: 700 }}>
                world-class.
              </Box>
            </Typography>
          </Box>

          {/* Feature grid — compact CSS grid, all cards equal size */}
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
            gap: 2,
          }}>
            {allInOneFeatures.map((f, i) => (
              <Box key={i} data-aos="fade-up" data-aos-delay={i * 60}
                sx={{
                  p: 2.5,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  backdropFilter: "blur(12px)",
                  display: "flex", flexDirection: "column", gap: 1.5,
                  transition: "all 0.3s ease",
                  cursor: "default",
                  "&:hover": {
                    background: "rgba(255,255,255,0.07)",
                    borderColor: "rgba(30,136,229,0.45)",
                    transform: "translateY(-5px)",
                    boxShadow: "0 16px 40px rgba(21,101,192,0.18)",
                  },
                }}>
                {/* Icon badge */}
                <Box sx={{
                  width: 44, height: 44, borderRadius: "12px", flexShrink: 0,
                  background: `linear-gradient(135deg, ${f.color}30, ${f.color}10)`,
                  border: `1px solid ${f.color}40`,
                  color: "#60a5fa",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {f.icon}
                </Box>
                <Typography variant="subtitle1" fontWeight={800} color="#fff" sx={{ lineHeight: 1.2 }}>
                  {f.label}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.48)", lineHeight: 1.65, display: "block" }}>
                  {f.desc}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Bottom praise marquee */}
          <Box sx={{ mt: 10, overflow: "hidden", py: 2 }}>
            <Box sx={{
              display: "flex", gap: 4, whiteSpace: "nowrap",
              animation: "slidePraise 30s linear infinite",
              "&:hover": { animationPlayState: "paused" },
            }}>
              {[...praises, ...praises].map((p, i) => (
                <Stack key={i} direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#1e88e5", flexShrink: 0 }} />
                  <Typography sx={{ color: "rgba(255,255,255,0.45)", fontWeight: 700, fontSize: "0.9rem", letterSpacing: 0.5, textTransform: "uppercase" }}>
                    {p}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Box>
        </Container>

        <style>{`
          @keyframes slidePraise {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes floatY0 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          @keyframes floatY1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
          @keyframes floatY2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px);  } }
        `}</style>
      </Box>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS — circles with fade animation (no cards)
      ══════════════════════════════════════════════════════════════════════ */}
      <Box sx={{ py: 16, bgcolor: C.white }}>
        <Container maxWidth="lg">
          <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ mb: 10 }} data-aos="fade-up">
            <Typography variant="overline" sx={{ color: C.accent, fontWeight: 800, letterSpacing: 4 }}>HOW IT WORKS</Typography>
            <Typography variant="h3" fontWeight={900} color={C.dark} sx={{ letterSpacing: "-0.02em" }}>
              Three Steps to Your{" "}
              <Box component="span" sx={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentAlt})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Dream Mentor
              </Box>
            </Typography>
          </Stack>

          {/* Steps: circles + connecting line */}
          <Box sx={{ position: "relative" }}>
            {/* Connector line (desktop) */}
            <Box sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: 56, left: "16.67%", right: "16.67%",
              height: 2,
              background: `linear-gradient(90deg, ${C.accent}, ${C.accentAlt}, ${C.accent})`,
              zIndex: 0,
              opacity: 0.25,
            }} />

            <Grid container spacing={{ xs: 6, md: 4 }}>
              {steps.map((s, i) => (
                <Grid item xs={12} md={4} key={i} sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>

                  {/* Outer fade ring */}
                  <Box data-aos="fade-in" data-aos-delay={i * 180} sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
                    <Box sx={{
                      position: "relative",
                      width: 130, height: 130,
                    }}>
                      {/* Ripple rings — pure CSS keyframe */}
                      {[1.0, 1.4, 1.8].map((scale, ri) => (
                        <Box key={ri} sx={{
                          position: "absolute", top: "50%", left: "50%",
                          width: 130, height: 130, borderRadius: "50%",
                          border: `1.5px solid ${C.accent}`,
                          opacity: 0,
                          transform: `translate(-50%, -50%) scale(${scale})`,
                          animation: `rippleStep ${2 + ri * 0.6}s ease-out ${i * 0.3 + ri * 0.5}s infinite`,
                        }} />
                      ))}

                      {/* Main circle */}
                      <Box sx={{
                        position: "absolute", top: "50%", left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 110, height: 110, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${C.accent}, ${C.accentAlt})`,
                        boxShadow: `0 10px 40px rgba(21,101,192,0.35)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexDirection: "column",
                      }}>
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)", fontWeight: 800, fontSize: "0.62rem", letterSpacing: 2 }}>
                          STEP
                        </Typography>
                        <Typography variant="h4" fontWeight={900} color="#fff" lineHeight={1}>
                          {s.num}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Text fades in */}
                  <Box data-aos="fade-up" data-aos-delay={i * 180 + 100}>
                    <Typography variant="h6" fontWeight={800} color={C.dark} mb={1.5}>{s.title}</Typography>
                    <Typography variant="body2" sx={{ color: C.textDim, lineHeight: 1.8, maxWidth: 260, mx: "auto" }}>{s.desc}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <style>{`
            @keyframes rippleStep {
              0%   { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
              100% { opacity: 0;   transform: translate(-50%, -50%) scale(2.2); }
            }
          `}</style>
        </Container>
      </Box>



      {/* ══════════════════════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <Box sx={{ py: 16, background: `linear-gradient(135deg, ${C.dark} 0%, ${C.accent} 50%, ${C.accentAlt} 100%)`, position: "relative", overflow: "hidden" }} data-aos="fade-in">
        {/* Glow orbs */}
        <Box sx={{ position: "absolute", width: 500, height: 500, top: "-30%", right: "5%", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)" }} />
        <Box sx={{ position: "absolute", width: 300, height: 300, bottom: "-10%", left: "10%",  borderRadius: "50%", background: "radial-gradient(circle, rgba(30,136,229,0.25) 0%, transparent 70%)" }} />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <Stack spacing={3} alignItems="center">
            <Chip label="START TODAY — NO CREDIT CARD" size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 800, letterSpacing: 1, border: "1px solid rgba(255,255,255,0.25)" }} />
            <Typography variant={isSmall ? "h4" : "h2"} fontWeight={900} color="#fff" sx={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              Ready to Master Everything You Love?
            </Typography>
            <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.75)", fontWeight: 400, maxWidth: 520 }}>
              Join 12,000+ SRM students who found their mentors, tracked their GPA, and built careers they're proud of.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button variant="contained" onClick={handleGetStarted} size="large"
                sx={{
                  bgcolor: "#fff", color: C.accent, px: 5, py: 1.9, borderRadius: "14px", fontWeight: 800,
                  textTransform: "none", fontSize: "1rem", boxShadow: "0 8px 28px rgba(0,0,0,0.25)",
                  "&:hover": { bgcolor: "#f0f4ff", transform: "translateY(-3px)", boxShadow: "0 14px 40px rgba(0,0,0,0.3)" },
                  transition: "all 0.3s",
                }}>
                {user ? "Go to Dashboard" : "Join Now — It's Free"}
              </Button>
              <Button variant="outlined" onClick={() => navigate("/resources")} size="large"
                sx={{
                  borderColor: "rgba(255,255,255,0.4)", color: "#fff", px: 5, py: 1.9, borderRadius: "14px",
                  fontWeight: 700, textTransform: "none",
                  "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
                }}>
                Browse Resources
              </Button>
            </Stack>
            <Stack direction="row" spacing={3} sx={{ pt: 1, flexWrap: "wrap", justifyContent: "center" }}>
              {["No credit card required", "Free forever plan", "Instant access"].map((item) => (
                <Stack key={item} direction="row" spacing={0.5} alignItems="center">
                  <CheckCircleIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }} />
                  <Typography variant="caption" color="rgba(255,255,255,0.7)" fontWeight={600}>{item}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════════════════════════════════
          TRUSTED BY
      ══════════════════════════════════════════════════════════════════════ */}
      <Box sx={{ py: 7, bgcolor: C.white, textAlign: "center" }}>
        <Typography variant="overline" sx={{ color: C.textDim, letterSpacing: 4, display: "block", mb: 4, fontSize: "0.68rem" }}>
          TRUSTED ACROSS SRM CAMPUSES
        </Typography>
        <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={{ xs: 3, md: 6 }}>
          {["SRM IST Kattankulathur", "SRM TRP", "SRM Medical", "SRM KTR", "SRM Arts & Science"].map((b) => (
            <Typography key={b} variant="subtitle1" fontWeight={900}
              sx={{ color: C.accent, opacity: 0.45, letterSpacing: 1, fontSize: { xs: "0.8rem", md: "1rem" } }}>
              {b}
            </Typography>
          ))}
        </Stack>
      </Box>

    </Box>
  );
};

export default Home;