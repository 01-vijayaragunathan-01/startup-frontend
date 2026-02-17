import React, { useEffect, useState } from "react";
import {
  Container, Typography, TextField, Button, Box,
  Chip, Avatar, Paper, Stack, Divider, Grid,
  IconButton, Tooltip, CircularProgress,
} from "@mui/material";
import CloudUploadIcon  from "@mui/icons-material/CloudUpload";
import EditIcon         from "@mui/icons-material/Edit";
import CheckIcon        from "@mui/icons-material/Check";
import CloseIcon        from "@mui/icons-material/Close";
import AddIcon          from "@mui/icons-material/Add";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "https://startup-backend-1-cj33.onrender.com";

// ─── Inline-editable field ─────────────────────────────────────────────────────
const EditableField = ({ label, value, multiline = false, rows = 1, onSave, colors }) => {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(value);

  // keep draft in sync if parent value changes (on initial load)
  useEffect(() => { setDraft(value); }, [value]);

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="caption" sx={{ color: colors.textDim, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase" }}>
          {label}
        </Typography>
        {!editing && (
          <Tooltip title={`Edit ${label}`}>
            <IconButton size="small" onClick={() => setEditing(true)}
              sx={{ color: colors.textDim, "&:hover": { color: colors.accent } }}>
              <EditIcon sx={{ fontSize: "0.85rem" }} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {editing ? (
        <Box>
          <TextField
            fullWidth autoFocus
            multiline={multiline} rows={rows}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                borderRadius: "12px",
                bgcolor: "rgba(255,255,255,0.04)",
                "& fieldset":           { borderColor: colors.accent },
                "&:hover fieldset":     { borderColor: colors.accent },
                "&.Mui-focused fieldset": { borderColor: colors.accent },
              },
              "& .MuiInputLabel-root": { color: colors.textDim },
            }}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button size="small" variant="contained" startIcon={<CheckIcon />}
              onClick={handleSave}
              sx={{ bgcolor: colors.accent, borderRadius: "8px", fontWeight: 700, fontSize: "0.72rem",
                    "&:hover": { bgcolor: "#5a00cc" } }}>
              SAVE
            </Button>
            <Button size="small" variant="outlined" startIcon={<CloseIcon />}
              onClick={handleCancel}
              sx={{ color: colors.textDim, borderColor: "rgba(255,255,255,0.15)", borderRadius: "8px",
                    fontSize: "0.72rem", "&:hover": { borderColor: colors.accent, color: "#fff" } }}>
              CANCEL
            </Button>
          </Stack>
        </Box>
      ) : (
        <Typography
          onClick={() => setEditing(true)}
          sx={{
            color:        value ? "#fff" : colors.textDim,
            fontStyle:    value ? "normal" : "italic",
            fontSize:     "0.95rem",
            cursor:       "pointer",
            px:           1.5, py: 1,
            borderRadius: "10px",
            border:       "1px solid transparent",
            transition:   "0.2s",
            "&:hover":    { border: `1px solid rgba(112,0,255,0.3)`, bgcolor: "rgba(112,0,255,0.05)" },
          }}
        >
          {value || `Click to add ${label.toLowerCase()}…`}
        </Typography>
      )}
    </Box>
  );
};

// ─── MyProfile ────────────────────────────────────────────────────────────────
const MyProfile = () => {
  const [name,       setName]       = useState("");
  const [about,      setAbout]      = useState("");
  const [expertise,  setExpertise]  = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [avatar,     setAvatar]     = useState("");
  const [banner,     setBanner]     = useState("");
  const [saving,     setSaving]     = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const token = localStorage.getItem("token");

  const colors = {
    bg:          "#030014",
    accent:      "#7000ff",
    accentGlow:  "rgba(112,0,255,0.18)",
    accentSoft:  "rgba(112,0,255,0.10)",
    glass:       "rgba(255,255,255,0.03)",
    glassBorder: "rgba(255,255,255,0.08)",
    textDim:     "rgba(255,255,255,0.55)",
  };

  const authHeaders = { Authorization: `Bearer ${token}` };

  // ── Fetch profile ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/profile/me`, { headers: authHeaders });
        setName(data.name       || "");
        setAbout(data.about     || "");
        setExpertise(data.expertise || []);
        setAvatar(data.avatar   || "");
        setBanner(data.banner   || "");
      } catch {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, [token]);

  // ── Upload image to backend ──────────────────────────────────────────────────
  const handleImageUpload = async (e, setter, setUploading) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${BASE_URL}/api/upload/image`, formData, {
        headers: { "Content-Type": "multipart/form-data", ...authHeaders },
      });
      setter(res.data.url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ── Skills ───────────────────────────────────────────────────────────────────
  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !expertise.includes(trimmed)) {
      setExpertise([...expertise, trimmed]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill) => setExpertise(expertise.filter((s) => s !== skill));

  // ── Save all ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      await axios.put(
        `${BASE_URL}/api/profile/update`,
        { name, about, expertise, avatar, banner },
        { headers: authHeaders }
      );
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const uploadButtonStyle = (loading) => ({
    color:        loading ? colors.textDim : "white",
    borderColor:  "rgba(255,255,255,0.15)",
    borderRadius: "12px",
    py:           1.5,
    fontWeight:   700,
    fontSize:     "0.78rem",
    letterSpacing: 0.8,
    "&:hover":    { borderColor: colors.accent, bgcolor: colors.accentSoft },
  });

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.bg, py: 12, color: "#fff" }}>
      <Container maxWidth="md">

        {/* ── PROFILE PREVIEW CARD ──────────────────────────────────────────── */}
        <Paper sx={{
          background:     colors.glass,
          backdropFilter: "blur(20px)",
          borderRadius:   "32px",
          border:         `1px solid ${colors.glassBorder}`,
          overflow:       "hidden",
          mb:             5,
          transition:     "border-color 0.3s",
          "&:hover":      { borderColor: "rgba(112,0,255,0.35)" },
        }}>
          {/* Banner */}
          <Box sx={{ position: "relative", height: 200, bgcolor: "rgba(255,255,255,0.04)",
            background: banner
              ? `url(${banner}) center/cover`
              : "linear-gradient(135deg, #0d0025 0%, #1a0050 50%, #0d0025 100%)",
          }}>
            {/* Banner upload pencil */}
            <Tooltip title="Change banner">
              <IconButton component="label"
                sx={{
                  position: "absolute", top: 12, right: 12,
                  bgcolor:  "rgba(0,0,0,0.5)", color: "#fff",
                  "&:hover": { bgcolor: colors.accent },
                }}>
                <EditIcon sx={{ fontSize: "1rem" }} />
                <input type="file" hidden accept="image/*"
                  onChange={(e) => handleImageUpload(e, setBanner, setUploadingBanner)} />
              </IconButton>
            </Tooltip>

            {/* Avatar + pencil */}
            <Box sx={{ position: "absolute", bottom: -60, left: "50%", transform: "translateX(-50%)" }}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar src={avatar}
                  sx={{
                    width: 120, height: 120,
                    border:    `4px solid ${colors.bg}`,
                    bgcolor:   colors.accent,
                    boxShadow: `0 0 24px rgba(112,0,255,0.35)`,
                    fontSize:  "2.5rem", fontWeight: 900,
                  }}>
                  {name?.[0]?.toUpperCase()}
                </Avatar>
                {uploadingAvatar ? (
                  <Box sx={{ position: "absolute", bottom: 4, right: 4 }}>
                    <CircularProgress size={20} sx={{ color: colors.accent }} />
                  </Box>
                ) : (
                  <Tooltip title="Change avatar">
                    <IconButton component="label" size="small"
                      sx={{
                        position: "absolute", bottom: 4, right: 4,
                        bgcolor:  colors.accent, color: "#fff", width: 28, height: 28,
                        "&:hover": { bgcolor: "#5a00cc" },
                      }}>
                      <EditIcon sx={{ fontSize: "0.75rem" }} />
                      <input type="file" hidden accept="image/*"
                        onChange={(e) => handleImageUpload(e, setAvatar, setUploadingAvatar)} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 4, pt: 10, textAlign: "center" }}>
            <Typography variant="h4" fontWeight={900} sx={{ mb: 0.5 }}>
              {name || "Your Name"}
            </Typography>
            <Typography variant="body1" sx={{ color: colors.textDim, mb: 3, maxWidth: 600, mx: "auto", lineHeight: 1.7 }}>
              {about || "No description provided yet."}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
              {expertise.map((skill, idx) => (
                <Chip key={idx} label={skill} onDelete={() => handleRemoveSkill(skill)}
                  sx={{
                    bgcolor: colors.accentSoft, color: colors.accent,
                    border:  `1px solid rgba(112,0,255,0.4)`,
                    borderRadius: "8px", mb: 1,
                    "& .MuiChip-deleteIcon": { color: colors.accent, fontSize: "0.9rem" },
                  }} />
              ))}
            </Stack>
          </Box>
        </Paper>

        {/* ── EDIT FORM CARD ────────────────────────────────────────────────── */}
        <Paper sx={{
          p:              { xs: 3, md: 5 },
          borderRadius:   "28px",
          bgcolor:        colors.glass,
          border:         `1px solid ${colors.glassBorder}`,
          backdropFilter: "blur(12px)",
        }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={800}>
              Profile Information
            </Typography>
            <Typography variant="caption" sx={{ color: colors.textDim, fontSize: "0.7rem" }}>
              Click any field or the ✏️ icon to edit
            </Typography>
          </Stack>

          {/* Inline-editable name */}
          <EditableField
            label="Full Name"
            value={name}
            onSave={(v) => setName(v)}
            colors={colors}
          />

          {/* Inline-editable bio */}
          <EditableField
            label="About Me"
            value={about}
            multiline rows={4}
            onSave={(v) => setAbout(v)}
            colors={colors}
          />

          <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", my: 3 }} />

          {/* Skills */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="caption" sx={{ color: colors.textDim, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase", display: "block", mb: 1.5 }}>
              Expertise &amp; Skills
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <TextField
                fullWidth placeholder="e.g. React, Python, ML…"
                size="small"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white", borderRadius: "10px",
                    bgcolor: "rgba(255,255,255,0.03)",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                    "&:hover fieldset": { borderColor: colors.accent },
                    "&.Mui-focused fieldset": { borderColor: colors.accent },
                  },
                }}
              />
              <IconButton onClick={handleAddSkill}
                sx={{ bgcolor: colors.accent, color: "#fff", borderRadius: "10px",
                      "&:hover": { bgcolor: "#5a00cc" }, width: 40, height: 40 }}>
                <AddIcon />
              </IconButton>
            </Stack>
            {expertise.length > 0 && (
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
                {expertise.map((skill, idx) => (
                  <Chip key={idx} label={skill} onDelete={() => handleRemoveSkill(skill)}
                    size="small"
                    sx={{
                      bgcolor: colors.accentSoft, color: colors.accent,
                      border:  `1px solid rgba(112,0,255,0.35)`,
                      borderRadius: "8px", fontWeight: 700,
                      "& .MuiChip-deleteIcon": { color: colors.accent },
                    }} />
                ))}
              </Stack>
            )}
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", my: 3 }} />

          {/* Image uploads */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: colors.textDim, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase", display: "block", mb: 1.5 }}>
                Profile Photo
              </Typography>
              <Button component="label" fullWidth variant="outlined"
                startIcon={uploadingAvatar ? <CircularProgress size={14} color="inherit" /> : <CloudUploadIcon />}
                disabled={uploadingAvatar}
                sx={uploadButtonStyle(uploadingAvatar)}>
                {uploadingAvatar ? "Uploading…" : "Upload Avatar"}
                <input type="file" hidden accept="image/*"
                  onChange={(e) => handleImageUpload(e, setAvatar, setUploadingAvatar)} />
              </Button>
              {avatar && (
                <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar src={avatar} sx={{ width: 32, height: 32 }} />
                  <Typography variant="caption" sx={{ color: colors.accent, fontSize: "0.7rem" }}>Avatar set</Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: colors.textDim, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase", display: "block", mb: 1.5 }}>
                Banner Photo
              </Typography>
              <Button component="label" fullWidth variant="outlined"
                startIcon={uploadingBanner ? <CircularProgress size={14} color="inherit" /> : <CloudUploadIcon />}
                disabled={uploadingBanner}
                sx={uploadButtonStyle(uploadingBanner)}>
                {uploadingBanner ? "Uploading…" : "Upload Banner"}
                <input type="file" hidden accept="image/*"
                  onChange={(e) => handleImageUpload(e, setBanner, setUploadingBanner)} />
              </Button>
              {banner && (
                <Box sx={{ mt: 1.5, borderRadius: "8px", overflow: "hidden", height: 40 }}>
                  <img src={banner} alt="banner preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
              )}
            </Grid>
          </Grid>

          {/* Save button */}
          <Button type="submit" variant="contained" fullWidth onClick={handleSubmit}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              py:           1.8,
              bgcolor:      colors.accent,
              borderRadius: "14px",
              fontWeight:   800,
              fontSize:     "0.9rem",
              letterSpacing: 1.5,
              boxShadow:    `0 10px 28px rgba(112,0,255,0.3)`,
              "&:hover":    { bgcolor: "#5a00cc" },
            }}>
            {saving ? "SAVING…" : "SAVE PROFILE CHANGES"}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default MyProfile;