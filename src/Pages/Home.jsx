import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Avatar,
  AvatarGroup,
  Stack,
  TextField,
  Divider,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Icons
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import GroupsIcon from '@mui/icons-material/Groups';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  // Refs for GSAP animations
  const heroRef = useRef(null);
  const floatImg1 = useRef(null);
  const floatImg2 = useRef(null);
  const floatImg3 = useRef(null);

  useEffect(() => {
    // Initialize AOS
    AOS.init({ duration: 1200, once: true });

    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // GSAP Entrance & Scroll Animations
    const ctx = gsap.context(() => {
      // 1. Entrance Reveal for Hero Text
      gsap.from(".reveal", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      // 2. Scroll-driven Floating Image Animation
      const floatingImages = [floatImg1.current, floatImg2.current, floatImg3.current];
      floatingImages.forEach((img, i) => {
        if (img) {
          gsap.to(img, {
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom center",
              scrub: 1.5,
            },
            scale: 0.85,
            y: -120 * (i + 1),
            opacity: 0,
            rotate: i % 2 === 0 ? 8 : -8,
          });
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleGetStarted = () => (user ? navigate("/dashboard") : navigate("/register"));

  // Premium Theme Constants
  const colors = {
    bg: "#030014",
    accent: "#7000ff",
    textDim: "rgba(255, 255, 255, 0.6)",
    glass: "rgba(255, 255, 255, 0.02)",
  };

  const glassStyle = {
    background: colors.glass,
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "32px",
    transition: "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.06)",
      borderColor: colors.accent,
      transform: "translateY(-8px)",
    },
  };

  return (
    <Box ref={heroRef} sx={{ bgcolor: colors.bg, color: "white", minHeight: "100vh", overflowX: "hidden" }}>
{/* 1. HERO SECTION */}
      <Box 
        ref={heroRef} 
        sx={{ 
          position: "relative", 
          pt: { xs: 15, md: 25 }, 
          pb: { xs: 10, md: 25 },
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          // The Professional Background Logic
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15, // Low opacity for a professional technical look
            zIndex: 0,
          },
          // Added a subtle gradient to ensure bottom content blends into next section
          background: `linear-gradient(to bottom, transparent 0%, ${colors.bg} 100%)`
        }}
      >
        {/* Floating Images (Kept but refined for opacity) */}
        <Box
          ref={floatImg1}
          component="img"
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600"
          sx={{
            position: "absolute", left: "5%", top: "20%", width: { xs: 140, md: 300 },
            borderRadius: "140px 140px 0 140px", zIndex: 1, opacity: 0.3,
            filter: 'grayscale(0.5)'
          }}
        />
        <Box
          ref={floatImg2}
          component="img"
          src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=600"
          sx={{
            position: "absolute", right: "6%", top: "15%", width: { xs: 120, md: 260 },
            borderRadius: "50%", zIndex: 1, opacity: 0.2,
            filter: 'grayscale(0.5)'
          }}
        />
        <Box
          ref={floatImg3}
          component="img"
          src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600"
          sx={{
            position: "absolute", right: "10%", bottom: "10%", width: { xs: 130, md: 280 },
            borderRadius: "0 140px 140px 140px", zIndex: 1, opacity: 0.25,
            filter: 'grayscale(0.5)'
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            
            <Typography 
              className="reveal" 
              variant={isSmall ? "h3" : "h1"} 
              fontWeight="500" 
              sx={{ 
                letterSpacing: "-0.04em", 
                lineHeight: 1,
                textShadow: '0 0 30px rgba(0,0,0,0.5)' // Added for readability against image
              }}
            >
              Build the connection<br />
              <Box 
                component="span" 
                sx={{ 
                  background: `linear-gradient(to right, #fff, ${colors.accent})`, 
                  WebkitBackgroundClip: "text", 
                  WebkitTextFillColor: "transparent" 
                }}
              >
                Between Student & Mentor
              </Box>
            </Typography>

            <Typography 
              className="reveal" 
              variant="h6" 
              sx={{ 
                color: colors.textDim, 
                maxWidth: "650px", 
                lineHeight: 1.6,
                fontWeight: 400 
              }}
            >
              A high-precision matchmaking platform where ambitious students meet world-class SRM mentors to architect the future of engineering.
            </Typography>

            <Stack className="reveal" direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ pt: 2 }}>
              <Button 
                variant="contained" 
                onClick={handleGetStarted} 
                sx={{ 
                  bgcolor: colors.accent, 
                  px: 6, 
                  py: 2, 
                  borderRadius: "12px", 
                  fontWeight: 800,
                  boxShadow: `0 10px 30px rgba(112,0,255,0.3)` 
                }}
              >
                Find Your Mentor
              </Button>
              <Button 
                variant="outlined" 
                sx={{ 
                  borderColor: "rgba(255,255,255,0.2)", 
                  color: "white", 
                  px: 5, 
                  borderRadius: "12px",
                  backdropFilter: 'blur(10px)' 
                }}
              >
                Explore Programs
              </Button>
            </Stack>

            <Stack className="reveal" direction="row" alignItems="center" spacing={2} sx={{ pt: 6 }}>
              <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 45, height: 45, border: `3px solid ${colors.bg}` } }}>
                <Avatar src="https://i.pravatar.cc/150?u=1" />
                <Avatar src="https://i.pravatar.cc/150?u=2" />
                <Avatar src="https://i.pravatar.cc/150?u=3" />
              </AvatarGroup>
              <Typography variant="caption" sx={{ color: colors.textDim, fontWeight: 500, letterSpacing: 1 }}>
                JOINED BY <span style={{ color: "white", fontWeight: 800 }}>12,000+</span> SRM STUDENTS
              </Typography>
            </Stack>

          </Stack>
        </Container>
      </Box>

      {/* SECTION 2: LIVE INTERACTION ADVERTISEMENT */}
      <Box sx={{ py: 20, position: 'relative' }}>
        <Container maxWidth="lg">
          <Grid container spacing={10} alignItems="center">

            {/* TEXT CONTENT */}
            <Grid item xs={12} md={5} data-aos="fade-right">
              <Stack spacing={3}>
                <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 900, letterSpacing: 3 }}>
                  REAL-TIME ENGAGEMENT
                </Typography>
                <Typography variant="h3" fontWeight={900} sx={{ lineHeight: 1.1 }}>
                  Direct Access to <br />
                  <Box component="span" sx={{ color: colors.accent }}>Industry Intelligence.</Box>
                </Typography>
                <Typography sx={{ color: colors.textDim, fontSize: '1.1rem', lineHeight: 1.8 }}>
                  Break the digital barrier. Engage in high-bandwidth 1-on-1 video sessions with SRM alumni and technical leads from Tier-1 global firms.
                </Typography>
                <Stack spacing={2}>
                  {[
                    "High-Definition Low Latency Video",
                    "Integrated Collaborative Whiteboard",
                    "Instant Session Scheduling"
                  ].map((text, i) => (
                    <Stack key={i} direction="row" spacing={2} alignItems="center">
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: colors.accent }} />
                      <Typography variant="body2" fontWeight={700}>{text}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Button variant="contained" sx={{ width: 'fit-content', mt: 2, bgcolor: colors.accent, px: 4, borderRadius: '8px' }}>
                  SCHEDULE A MEET
                </Button>
              </Stack>
            </Grid>

{/* SECTION: LIVE SESSION AD BANNER (VERIFIED PRODUCTION LOAD) */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box 
          data-aos="zoom-in"
          sx={{ 
            width: '100%', 
            height: { xs: '300px', md: '550px' }, 
            position: 'relative', 
            overflow: 'hidden', 
            borderRadius: '40px',
            // FALLBACK: Deep Slate ensures the UI doesn't look "empty" if net is slow
            backgroundColor: '#0a0a20', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            // High-Resolution Engineering Session (Verified CDN)
            backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)',
            transition: 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
            cursor: 'pointer',
            '&:hover': {
              borderColor: '#7000ff',
              transform: 'scale(1.01)',
              boxShadow: `0 0 50px rgba(112, 0, 255, 0.2)`
            },
            // Cinematic Overlay
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(3,0,20,0.2) 0%, rgba(3,0,20,0.6) 100%)',
              pointerEvents: 'none'
            }
          }}
        />
      </Container>

          </Grid>
        </Container>
      </Box>
      {/* 4. SOCIAL PROOF */}
      <Container maxWidth="lg" sx={{ py: 15, textAlign: "center" }}>
        <Typography variant="overline" sx={{ color: colors.textDim, letterSpacing: 3 }}>TRUSTED BY MENTORS FROM</Typography>
        <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={6} sx={{ py: 6, opacity: 0.3, filter: "grayscale(1)" }}>
          {["SRM IST", "SRM TRP", "SRM Medical", "SRM ktr", "SRM Arts"].map(brand => <Typography key={brand} variant="h4" fontWeight={900}>{brand}</Typography>)}
        </Stack>

      </Container>

      {/* 4. SOCIAL PROOF: CIRCULAR MENTOR & STUDENT SHOWCASE */}
      <Box sx={{ py: 15, overflow: 'hidden', bgcolor: colors.bg }}>

        {/* ROW 1: MENTORS (Left to Right) */}
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={900}
            className="reveal"
            sx={{ mb: 5, textAlign: 'left', letterSpacing: '-0.02em' }}
          >
            Global Network of <span style={{ color: colors.accent }}>Leading Experts</span>
          </Typography>
        </Container>

        <Box sx={{ display: 'flex', mb: 10 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 4,
              animation: 'marqueeLeftToRight 40s linear infinite',
              '&:hover': { animationPlayState: 'paused' }
            }}
          >
            {[...Array(10)].map((_, i) => (
              <Stack key={i} alignItems="center" spacing={2} sx={{ minWidth: 160 }}>
                <Box sx={{
                  p: 0.5,
                  borderRadius: '50%',
                  border: `2px solid ${colors.accent}`,
                  background: `linear-gradient(45deg, ${colors.accent}, transparent)`
                }}>
                  <Avatar
                    src={`https://i.pravatar.cc/150?u=mentor${i}`}
                    sx={{ width: 120, height: 120, filter: 'grayscale(0.5) contrast(1.1)' }}
                  />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" fontWeight={800}>Expert Mentor</Typography>
                  <Typography variant="caption" sx={{ color: colors.textDim }}>Sr. Engineer @ Meta</Typography>
                </Box>
              </Stack>
            ))}
          </Box>
        </Box>

        {/* ROW 2: STUDENTS (Right to Left) */}
        <Container maxWidth="lg" sx={{ mb: 4, textAlign: 'right' }}>
          <Typography
            variant="h4"
            fontWeight={900}
            className="reveal"
            sx={{ mb: 5, letterSpacing: '-0.02em' }}
          >
            Future <span style={{ color: colors.accent }}>Innovators</span>
          </Typography>
        </Container>

        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              display: 'flex',
              gap: 4,
              animation: 'marqueeRightToLeft 40s linear infinite',
              '&:hover': { animationPlayState: 'paused' }
            }}
          >
            {[...Array(10)].map((_, i) => (
              <Stack key={i} alignItems="center" spacing={2} sx={{ minWidth: 160 }}>
                <Box sx={{
                  p: 0.5,
                  borderRadius: '50%',
                  border: `1px solid rgba(255,255,255,0.2)`,
                  background: `rgba(255,255,255,0.05)`
                }}>
                  <Avatar
                    src={`https://i.pravatar.cc/150?u=student${i}`}
                    sx={{ width: 100, height: 100 }}
                  />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" fontWeight={700}>Active Student</Typography>
                  <Typography variant="caption" sx={{ color: colors.textDim }}>MIT University</Typography>
                </Box>
              </Stack>
            ))}
          </Box>
        </Box>

        {/* Global Styles for Animations */}
        <style>
          {`
      @keyframes marqueeLeftToRight {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(0); }
      }
      @keyframes marqueeRightToLeft {
        0% { transform: translateX(0); }
        100% { transform: translateX(-100%); }
      }
    `}
        </style>
      </Box>

      {/* 4. STUDENT ACHIEVEMENTS: INFINITE CAROUSEL */}
      <Box sx={{ py: 15, bgcolor: colors.bg, overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Stack spacing={2} sx={{ textAlign: 'center' }}>
            <Typography variant="overline" color={colors.accent} sx={{ fontWeight: 800, letterSpacing: 3 }}>
              SUCCESS STORIES
            </Typography>
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: '-0.02em' }}>
              From Learning to <span style={{ color: colors.accent }}>Leading</span>
            </Typography>
            <Typography sx={{ color: colors.textDim, maxWidth: '600px', mx: 'auto' }}>
              Our students don't just finish courses; they launch careers at world-class tech companies.
            </Typography>
          </Stack>
        </Container>

        {/* Carousel Wrapper */}
        <Box sx={{ display: 'flex', position: 'relative', width: '100%' }}>
          {/* Infinite Animation Container */}
          <Box
            sx={{
              display: 'flex',
              gap: 4,
              animation: 'carouselScroll 40s linear infinite',
              width: 'max-content',
              '&:hover': { animationPlayState: 'paused' } // Pause on hover for readability
            }}
          >
            {[...Array(8)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  ...glassStyle,
                  width: { xs: 300, md: 400 }, // Uniform card size
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  flexShrink: 0
                }}
              >
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Avatar
                      src={`https://i.pravatar.cc/150?u=student_carousel_${i}`}
                      sx={{ width: 60, height: 60, border: `2px solid ${colors.accent}` }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={800}>
                        {i % 2 === 0 ? "Jameson K." : "Elena M."}
                      </Typography>
                      <Typography variant="caption" color={colors.accent} fontWeight={700}>
                        {i % 2 === 0 ? "DEVELOPER @ STRIPE" : "AI LEAD @ OPENAI"}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body2" sx={{ color: colors.textDim, lineHeight: 1.7, fontStyle: 'italic' }}>
                    "The Mentor Mentee platform bridged the gap between my university theory and actual production-level coding. I secured my role within months."
                  </Typography>
                </Box>
                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.05)' }} />
                <Typography variant="caption" fontWeight={700} sx={{ color: colors.accent }}>
                  SUCCESS STORY — 2026
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* CSS for Seamless Animation */}
        <style>
          {`
      @keyframes carouselScroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}
        </style>
      </Box>


    </Box>
  );
};

export default Home;