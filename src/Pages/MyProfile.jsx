import React, { useEffect, useState } from "react";
import {
  Container, Typography, TextField, Button, Box,
  Chip, Avatar, Paper, Stack, Divider, Grid,
  IconButton, Tooltip, CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon        from "@mui/icons-material/Edit";
import CheckIcon       from "@mui/icons-material/Check";
import CloseIcon       from "@mui/icons-material/Close";
import AddIcon         from "@mui/icons-material/Add";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "https://startup-backend-1-cj33.onrender.com";

const C = {
  bg: "#f0f4ff", white: "#ffffff", accent: "#1565c0", accentLight: "#1e88e5",
  accentBg: "rgba(21,101,192,0.07)", border: "rgba(21,101,192,0.14)",
  textDim: "#546e7a", dark: "#1a237e",
};

const EditableField = ({ label, value, multiline = false, rows = 1, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(value);
  useEffect(() => setDraft(value), [value]);

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="caption" sx={{ color: C.textDim, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase" }}>
          {label}
        </Typography>
        {!editing && (
          <Tooltip title={`Edit ${label}`}>
            <IconButton size="small" onClick={() => setEditing(true)} sx={{ color: C.textDim, "&:hover": { color: C.accent } }}>
              <EditIcon sx={{ fontSize: "0.85rem" }} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {editing ? (
        <Box>
          <TextField fullWidth autoFocus multiline={multiline} rows={rows} value={draft}
            onChange={(e) => setDraft(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px", bgcolor: "#f8faff",
                "& fieldset": { borderColor: C.border },
                "&:hover fieldset": { borderColor: C.accent },
                "&.Mui-focused fieldset": { borderColor: C.accent },
              },
            }}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button size="small" variant="contained" startIcon={<CheckIcon />}
              onClick={() => { onSave(draft); setEditing(false); }}
              sx={{ bgcolor: C.accent, borderRadius: "8px", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: C.accentLight } }}>
              Save
            </Button>
            <Button size="small" variant="outlined" startIcon={<CloseIcon />}
              onClick={() => { setDraft(value); setEditing(false); }}
              sx={{ color: C.textDim, borderColor: C.border, borderRadius: "8px", textTransform: "none", "&:hover": { borderColor: C.accent } }}>
              Cancel
            </Button>
          </Stack>
        </Box>
      ) : (
        <Typography onClick={() => setEditing(true)}
          sx={{
            color: value ? C.dark : C.textDim, fontStyle: value ? "normal" : "italic",
            fontSize: "0.95rem", cursor: "pointer", px: 1.5, py: 1, borderRadius: "10px",
            border: "1px solid transparent", transition: "0.2s",
            "&:hover": { border: `1px solid ${C.border}`, bgcolor: C.accentBg },
          }}>
          {value || `Click to add ${label.toLowerCase()}…`}
        </Typography>
      )}
    </Box>
  );
};

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
  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/profile/me`, { headers: authHeaders });
        setName(data.name || "");
        setAbout(data.about || "");
        setExpertise(data.expertise || []);
        setAvatar(data.avatar || "");
        setBanner(data.banner || "");
      } catch { toast.error("Failed to load profile"); }
    };
    fetchProfile();
  }, [token]);

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
    } catch { toast.error("Image upload failed"); }
    finally { setUploading(false); }
  };

  const handleAddSkill = () => {
    const t = skillInput.trim();
    if (t && !expertise.includes(t)) { setExpertise([...expertise, t]); setSkillInput(""); }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await axios.put(`${BASE_URL}/api/profile/update`, { name, about, expertise, avatar, banner }, { headers: authHeaders });
      toast.success("Profile updated!");
    } catch { toast.error("Failed to update profile"); }
    finally { setSaving(false); }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: C.bg, py: 12 }}>
      <Container maxWidth="md">

        {/* Profile Preview Card */}
        <Paper sx={{ borderRadius: "28px", border: `1px solid ${C.border}`, overflow: "hidden", mb: 5, boxShadow: "0 8px 32px rgba(21,101,192,0.08)" }}>
          <Box sx={{
            position: "relative", height: 200,
            background: banner ? `url(${banner}) center/cover` : `linear-gradient(135deg, ${C.accent} 0%, ${C.accentLight} 100%)`,
          }}>
            <Tooltip title="Change banner">
              <IconButton component="label" sx={{ position: "absolute", top: 12, right: 12, bgcolor: "rgba(0,0,0,0.3)", color: "#fff", "&:hover": { bgcolor: C.accent } }}>
                <EditIcon sx={{ fontSize: "1rem" }} />
                <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, setBanner, setUploadingBanner)} />
              </IconButton>
            </Tooltip>

            <Box sx={{ position: "absolute", bottom: -60, left: "50%", transform: "translateX(-50%)" }}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar src={avatar} sx={{ width: 120, height: 120, border: `4px solid ${C.white}`, bgcolor: C.accent, boxShadow: "0 4px 20px rgba(21,101,192,0.3)", fontSize: "2.5rem", fontWeight: 900 }}>
                  {name?.[0]?.toUpperCase()}
                </Avatar>
                <Tooltip title="Change avatar">
                  <IconButton component="label" size="small"
                    sx={{ position: "absolute", bottom: 4, right: 4, bgcolor: C.accent, color: "#fff", width: 28, height: 28, "&:hover": { bgcolor: C.accentLight } }}>
                    <EditIcon sx={{ fontSize: "0.75rem" }} />
                    <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, setAvatar, setUploadingAvatar)} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 4, pt: 10, textAlign: "center" }}>
            <Typography variant="h4" fontWeight={900} color={C.dark}>{name || "Your Name"}</Typography>
            <Typography variant="body1" sx={{ color: C.textDim, mb: 3, maxWidth: 600, mx: "auto", lineHeight: 1.7 }}>
              {about || "No description provided yet."}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
              {expertise.map((skill, idx) => (
                <Chip key={idx} label={skill} onDelete={() => setExpertise(expertise.filter((s) => s !== skill))}
                  sx={{ bgcolor: C.accentBg, color: C.accent, border: `1px solid ${C.border}`, borderRadius: "8px", mb: 1,
                    "& .MuiChip-deleteIcon": { color: C.accent } }} />
              ))}
            </Stack>
          </Box>
        </Paper>

        {/* Edit Form */}
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", border: `1px solid ${C.border}`, bgcolor: C.white, boxShadow: "0 4px 24px rgba(21,101,192,0.07)" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={800} color={C.dark}>Profile Information</Typography>
            <Typography variant="caption" sx={{ color: C.textDim }}>Click any field or ✏️ to edit</Typography>
          </Stack>

          <EditableField label="Full Name" value={name} onSave={(v) => setName(v)} />
          <EditableField label="About Me" value={about} multiline rows={4} onSave={(v) => setAbout(v)} />

          <Divider sx={{ borderColor: C.border, my: 3 }} />

          {/* Skills */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="caption" sx={{ color: C.textDim, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase", display: "block", mb: 1.5 }}>
              Expertise & Skills
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <TextField fullWidth placeholder="e.g. React, Python, ML…" size="small"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px", bgcolor: "#f8faff",
                    "& fieldset": { borderColor: C.border },
                    "&:hover fieldset": { borderColor: C.accent },
                    "&.Mui-focused fieldset": { borderColor: C.accent },
                  },
                }}
              />
              <IconButton onClick={handleAddSkill} sx={{ bgcolor: C.accent, color: "#fff", borderRadius: "10px", "&:hover": { bgcolor: C.accentLight }, width: 40, height: 40 }}>
                <AddIcon />
              </IconButton>
            </Stack>
            {expertise.length > 0 && (
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
                {expertise.map((skill, idx) => (
                  <Chip key={idx} label={skill} size="small" onDelete={() => setExpertise(expertise.filter((s) => s !== skill))}
                    sx={{ bgcolor: C.accentBg, color: C.accent, border: `1px solid ${C.border}`, borderRadius: "8px", fontWeight: 700,
                      "& .MuiChip-deleteIcon": { color: C.accent } }} />
                ))}
              </Stack>
            )}
          </Box>

          <Divider sx={{ borderColor: C.border, my: 3 }} />

          {/* Image Uploads */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { label: "Profile Photo", uploading: uploadingAvatar, setter: setAvatar, setUploading: setUploadingAvatar },
              { label: "Banner Photo",  uploading: uploadingBanner, setter: setBanner, setUploading: setUploadingBanner },
            ].map((item) => (
              <Grid item xs={12} sm={6} key={item.label}>
                <Typography variant="caption" sx={{ color: C.textDim, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase", display: "block", mb: 1.5 }}>
                  {item.label}
                </Typography>
                <Button component="label" fullWidth variant="outlined" disabled={item.uploading}
                  startIcon={item.uploading ? <CircularProgress size={14} color="inherit" /> : <CloudUploadIcon />}
                  sx={{ color: C.accent, borderColor: C.border, borderRadius: "12px", py: 1.5, fontWeight: 700, textTransform: "none", "&:hover": { borderColor: C.accent, bgcolor: C.accentBg } }}>
                  {item.uploading ? "Uploading…" : `Upload ${item.label}`}
                  <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, item.setter, item.setUploading)} />
                </Button>
              </Grid>
            ))}
          </Grid>

          <Button type="submit" variant="contained" fullWidth onClick={handleSubmit} disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              py: 1.8, bgcolor: C.accent, borderRadius: "14px", fontWeight: 800, fontSize: "0.95rem",
              textTransform: "none", boxShadow: "0 8px 24px rgba(21,101,192,0.3)",
              "&:hover": { bgcolor: C.accentLight, transform: "translateY(-2px)", boxShadow: "0 12px 32px rgba(21,101,192,0.4)" },
              transition: "all 0.3s ease",
            }}>
            {saving ? "Saving…" : "Save Profile Changes"}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default MyProfile;