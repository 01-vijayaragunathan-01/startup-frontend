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
      <Box sx={{ position: "relative", pt: { xs: 15, md: 25 }, pb: { xs: 10, md: 25 } }}>
        {/* Floating Images with GSAP Refs */}
        <Box
          ref={floatImg1}
          component="img"
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600"
          sx={{
            position: "absolute", left: "5%", top: "20%", width: { xs: 140, md: 300 },
            borderRadius: "140px 140px 0 140px", zIndex: 1, opacity: 0.6,
          }}
        />
        <Box
          ref={floatImg2}
          component="img"
          src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=600"
          sx={{
            position: "absolute", right: "6%", top: "15%", width: { xs: 120, md: 260 },
            borderRadius: "50%", zIndex: 1, opacity: 0.4,
          }}
        />
        <Box
          ref={floatImg3}
          component="img"
          src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600"
          sx={{
            position: "absolute", right: "10%", bottom: "10%", width: { xs: 130, md: 280 },
            borderRadius: "0 140px 140px 140px", zIndex: 1, opacity: 0.5,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            {/* <Box className="reveal" sx={{
              px: 3, py: 1, borderRadius: "100px", border: "1px solid rgba(112,0,255,0.4)",
              bgcolor: "rgba(112,0,255,0.1)", color: "#b983ff", fontSize: "0.75rem", fontWeight: 800, letterSpacing: 1.5
            }}>
              CONNECTING MINDS • SHAPING FUTURES
            </Box> */}
            <Typography className="reveal" variant={isSmall ? "h3" : "h1"} fontWeight="500" sx={{ letterSpacing: "-0.05em", lineHeight: 0.95 }}>
              Bridge the Gap<br/> 
              <Box component="span" sx={{ background: `linear-gradient(to right, #fff, ${colors.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                 Between Potential and Mastery
              </Box>
            </Typography>
            <Typography className="reveal" variant="h6" sx={{ color: colors.textDim, maxWidth: "650px", lineHeight: 1.6 }}>
              A high-precision matchmaking platform where ambitious students meet world-class mentors to engineer the future.
            </Typography>
            <Stack className="reveal" direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Button variant="contained" onClick={handleGetStarted} sx={{ bgcolor: colors.accent, px: 6, py: 2, borderRadius: "14px", fontWeight: 800 }}>
                Find Your Mentor
              </Button>
              <Button variant="outlined" sx={{ borderColor: "rgba(255,255,255,0.2)", color: "white", px: 5, borderRadius: "14px" }}>
                Explore Programs
              </Button>
            </Stack>
            <Stack className="reveal" direction="row" alignItems="center" spacing={2} sx={{ pt: 4 }}>
              <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 40, height: 40, border: `3px solid ${colors.bg}` } }}>
                <Avatar src="https://i.pravatar.cc/150?u=1" /><Avatar src="https://i.pravatar.cc/150?u=2" />
              </AvatarGroup>
              <Typography variant="caption" sx={{ color: colors.textDim }}>JOINED BY <span style={{ color: "white", fontWeight: 700 }}>12,000+</span> STUDENTS</Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* 2. INTERACTIVE SANDBOX SECTION */}
      <Container maxWidth="lg" sx={{ py: 15 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6} data-aos="fade-right">
            <Typography variant="h3" fontWeight={900} sx={{ mb: 3 }}>The Virtual <br /> Pair-Programming Suite</Typography>
            <Typography sx={{ color: colors.textDim, mb: 4 }}>Experience real-time interaction with CTOs. Drag code blocks and get instant line-by-line logic optimization.</Typography>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2}><ElectricBoltIcon sx={{ color: colors.accent }} /><Typography fontWeight={700}>Real-time Collaboration</Typography></Stack>
              <Stack direction="row" spacing={2}><GroupsIcon sx={{ color: colors.accent }} /><Typography fontWeight={700}>Live Whiteboarding</Typography></Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} data-aos="zoom-in">
            <Box sx={{ ...glassStyle, p: 0, overflow: "hidden", height: 400, display: "flex", flexDirection: "column" }}>
              <Box sx={{ px: 3, py: 1.5, bgcolor: "rgba(255,255,255,0.05)", display: "flex", gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ff5f56" }} />
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ffbd2e" }} />
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#27c93f" }} />
              </Box>
              <Box sx={{ p: 4, flexGrow: 1, fontFamily: "monospace", color: "#b983ff" }}>
                <Typography variant="body2" sx={{ color: colors.textDim }}>// Mentor: Suggesting O(log n) solution</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>def optimize_search(data):</Typography>
                <Box sx={{ mt: 2, p: 2, border: "1px dashed #7000ff", borderRadius: 2 }}>Drag Fix Here</Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      {/* 3. PROBLEM & SOLUTION SECTION */}
      <Box sx={{ py: 15, bgcolor: "rgba(255,255,255,0.01)" }}>
        <Container maxWidth="lg">
          <Typography
            align="center"
            variant="h3"
            fontWeight={900}
            sx={{ mb: 10, letterSpacing: '-0.02em' }}
          >
            Tailored For Your <span style={{ color: colors.accent }}>Growth</span>
          </Typography>

          <Grid container spacing={4} sx={{ display: 'flex', alignItems: 'stretch' }}>
            {[
              {
                role: "For Students",
                prob: "No-Experience Paradox",
                desc: "Break the cycle of needing experience to get experience through production-level guidance and real-world project builds.",
                img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop"
              },
              {
                role: "For Mentors",
                prob: "Leadership Growth",
                desc: "Refine your management style and give back to the community by guiding ambitious developers through complex technical challenges.",
                img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800"
              }
            ].map((item, i) => (
              <Grid
                item
                xs={12}
                md={6}
                key={i}
                sx={{ display: 'flex' }} // Ensures the Grid item itself acts as a flex container
                data-aos={i === 0 ? "fade-right" : "fade-left"}
              >
                <Box sx={{
                  ...glassStyle,
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%', // Ensures card takes full grid width
                  height: '100%', // Ensures both cards have the same height
                  justifyContent: 'space-between'
                }}>
                  <Box>
                    <Box
                      component="img"
                      src={item.img}
                      sx={{
                        width: "100%",
                        height: 250,
                        borderRadius: 4,
                        objectFit: "cover",
                        mb: 3,
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    />
                    <Typography variant="overline" color={colors.accent} fontWeight={800} sx={{ letterSpacing: 1.5 }}>
                      {item.role}
                    </Typography>
                    <Typography variant="h5" fontWeight={800} gutterBottom sx={{ mt: 1 }}>
                      {item.prob}
                    </Typography>
                    <Typography sx={{ color: colors.textDim, lineHeight: 1.7 }}>
                      {item.desc}
                    </Typography>
                  </Box>

                  <Button
                    variant="text"
                    sx={{
                      mt: 4,
                      width: 'fit-content',
                      color: '#fff',
                      p: 0,
                      fontWeight: 700,
                      textTransform: 'none',
                      "&:hover": { color: colors.accent, bgcolor: 'transparent' }
                    }}
                  >
                    Learn More —&gt;
                  </Button>
                </Box>
              </Grid>
            ))}
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

      {/* 6. INTERACTIVE CTA / LEAD MAGNET */}
      <Container maxWidth="md" sx={{ py: 15 }}>
        <Box
          data-aos="zoom-in"
          sx={{
            ...glassStyle,
            p: { xs: 5, md: 10 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: `radial-gradient(circle at top right, rgba(112,0,255,0.15), transparent), ${colors.glass}`
          }}
        >
          {/* Decorative Background Element */}
          <Box sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            background: colors.accent,
            filter: 'blur(100px)',
            opacity: 0.1,
            zIndex: 0
          }} />

          <Stack spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: '-0.02em' }}>
              Ready to Engineer <br />
              <span style={{ color: colors.accent }}>Excellence?</span>
            </Typography>

            <Typography sx={{ color: colors.textDim, maxWidth: '500px', fontSize: '1.1rem' }}>
              Join 15,000+ members already scaling their careers. Start your journey with a single connection.
            </Typography>

            {/* Primary Conversion Form */}
            <Box sx={{ width: '100%', maxWidth: 500 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  placeholder="university@edu or professional email"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      borderRadius: '14px',
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: colors.accent },
                      '&.Mui-focused fieldset': { borderColor: colors.accent }
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleGetStarted}
                  sx={{
                    bgcolor: colors.accent,
                    px: 4,
                    py: { xs: 2, sm: 0 },
                    borderRadius: '14px',
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    boxShadow: `0 10px 30px rgba(112,0,255,0.3)`,
                    '&:hover': { bgcolor: '#5a00cc', transform: 'translateY(-2px)' }
                  }}
                >
                  Request Demo
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ width: '100%', my: 2, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.1)' } }}>
              <Typography variant="caption" sx={{ color: colors.textDim, fontWeight: 700, letterSpacing: 1 }}>
                OR ACCELERATE WITH
              </Typography>
            </Divider>

            {/* Alternative Engagement (Low Friction) */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<VerifiedUserIcon />}
                sx={{
                  color: 'white',
                  py: 1.5,
                  borderRadius: '12px',
                  borderColor: 'rgba(255,255,255,0.2)',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }
                }}
              >
                Sign up with Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GroupsIcon />}
                sx={{
                  color: 'white',
                  py: 1.5,
                  borderRadius: '12px',
                  borderColor: 'rgba(255,255,255,0.2)',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }
                }}
              >
                Join via Slack
              </Button>
            </Stack>

            <Typography variant="caption" sx={{ color: colors.textDim, mt: 2 }}>
              No credit card required. 14-day premium trial included.
            </Typography>
          </Stack>
        </Box>
      </Container>

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