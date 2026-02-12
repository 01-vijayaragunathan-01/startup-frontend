import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  Avatar,
  Paper,
  Stack,
  Divider,
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import toast from "react-hot-toast";

const MyProfile = () => {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [expertise, setExpertise] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [avatar, setAvatar] = useState("");
  const [banner, setBanner] = useState("");

  const token = localStorage.getItem("token");

  // Premium Theme Colors
  const colors = {
    bg: "#030014",
    accent: "#7000ff",
    glass: "rgba(255, 255, 255, 0.03)",
    glassBorder: "rgba(255, 255, 255, 0.08)",
    textDim: "rgba(255, 255, 255, 0.6)",
  };

  // Fetch current user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("https://startup-backend-1-cj33.onrender.com/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(data.name || "");
        setAbout(data.about || "");
        setExpertise(data.expertise || []);
        setAvatar(data.avatar || "");
        setBanner(data.banner || "");
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [token]);

  const handleImageUpload = async (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://startup-backend-1-cj33.onrender.com/api/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setter(res.data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const handleAddSkill = () => {
    if (skillInput && !expertise.includes(skillInput)) {
      setExpertise([...expertise, skillInput]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setExpertise(expertise.filter((s) => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "https://startup-backend-1-cj33.onrender.com/api/profile/update",
        { name, about, expertise, avatar, banner },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      borderRadius: "14px",
      bgcolor: "rgba(255,255,255,0.03)",
      "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
      "&:hover fieldset": { borderColor: colors.accent },
      "&.Mui-focused fieldset": { borderColor: colors.accent },
    },
    "& .MuiInputLabel-root": { color: colors.textDim },
    mb: 3
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.bg, py: 12 }}>
      <Container maxWidth="md">
        {/* PROFILE PREVIEW CARD */}
        <Paper
          sx={{
            background: colors.glass,
            backdropFilter: "blur(20px)",
            borderRadius: "32px",
            border: `1px solid ${colors.glassBorder}`,
            overflow: "hidden",
            mb: 6,
          }}
        >
          <Box sx={{ position: "relative", height: 200, bgcolor: "rgba(255,255,255,0.05)" }}>
            {banner && (
              <img src={banner} alt="Banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
            <Box sx={{ position: "absolute", bottom: -60, left: "50%", transform: "translateX(-50%)" }}>
              <Avatar
                src={avatar}
                sx={{
                  width: 120,
                  height: 120,
                  border: `4px solid ${colors.bg}`,
                  boxShadow: `0 0 20px rgba(112,0,255,0.3)`,
                }}
              />
            </Box>
          </Box>

          <Box sx={{ p: 4, pt: 10, textAlign: "center" }}>
            <Typography variant="h4" fontWeight={900} sx={{ color: "white", mb: 1 }}>
              {name || "Your Name"}
            </Typography>
            <Typography variant="body1" sx={{ color: colors.textDim, mb: 3, maxWidth: 600, mx: "auto" }}>
              {about || "No description provided yet."}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
              {expertise.map((skill, idx) => (
                <Chip
                  key={idx}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  sx={{
                    bgcolor: "rgba(112,0,255,0.1)",
                    color: colors.accent,
                    border: `1px solid ${colors.accent}`,
                    mb: 1,
                    "& .MuiChip-deleteIcon": { color: colors.accent },
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Paper>

        {/* EDIT FORM CARD */}
        <Paper sx={{ p: 4, borderRadius: "24px", bgcolor: colors.glass, border: `1px solid ${colors.glassBorder}` }}>
          <Typography variant="h6" fontWeight={800} sx={{ color: "white", mb: 4 }}>
            Update Profile Information
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Full Name" value={name} onChange={(e) => setName(e.target.value)} sx={inputStyles} />
            
            <TextField fullWidth multiline rows={4} label="About Me" value={about} onChange={(e) => setAbout(e.target.value)} sx={inputStyles} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ color: colors.textDim, mb: 1 }}>Expertise & Skills</Typography>
              <Stack direction="row" spacing={2}>
                <TextField 
                  fullWidth 
                  label="Add Skill" 
                  value={skillInput} 
                  onChange={(e) => setSkillInput(e.target.value)} 
                  sx={{ ...inputStyles, mb: 0 }} 
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddSkill} 
                  sx={{ bgcolor: colors.accent, borderRadius: "12px", px: 4, height: '56px' }}
                >
                  Add
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", my: 4 }} />

            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: colors.textDim, mb: 2 }}>Profile Photo</Typography>
                <Button
                  component="label"
                  fullWidth
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.2)", borderRadius: "12px", py: 1.5 }}
                >
                  Upload Avatar
                  <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, setAvatar)} />
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: colors.textDim, mb: 2 }}>Banner Photo</Typography>
                <Button
                  component="label"
                  fullWidth
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.2)", borderRadius: "12px", py: 1.5 }}
                >
                  Upload Banner
                  <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, setBanner)} />
                </Button>
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 2,
                bgcolor: colors.accent,
                borderRadius: "14px",
                fontWeight: 800,
                fontSize: "1rem",
                boxShadow: `0 10px 20px rgba(112,0,255,0.3)`,
                "&:hover": { bgcolor: "#5a00cc" },
              }}
            >
              Save Profile Changes
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default MyProfile;