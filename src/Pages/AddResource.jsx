import {
  Box, TextField, Button, Typography, MenuItem, Container, Paper, Stack, Divider,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const C = {
  bg: "#f0f4ff", white: "#ffffff", accent: "#1565c0", accentLight: "#1e88e5",
  accentBg: "rgba(21,101,192,0.07)", border: "rgba(21,101,192,0.14)",
  textDim: "#546e7a", dark: "#1a237e",
};

const inputSx = {
  mb: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px", bgcolor: "#f8faff",
    "& fieldset": { borderColor: C.border },
    "&:hover fieldset": { borderColor: C.accent },
    "&.Mui-focused fieldset": { borderColor: C.accent },
  },
  "& .MuiInputLabel-root": { color: C.textDim },
  "& .MuiInputLabel-root.Mui-focused": { color: C.accent },
};

const AddResource = () => {
  const [form, setForm] = useState({ title: "", description: "", link: "", image: "", type: "blog" });
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    let imageUrl = form.image;
    try {
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", "mentor_resources");
        const res = await axios.post("https://api.cloudinary.com/v1_1/dmakodto1/image/upload", fd);
        imageUrl = res.data.secure_url;
      }
      await axios.post("https://startup-backend-1-cj33.onrender.com/api/resources",
        { ...form, image: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Resource added successfully!");
      setForm({ title: "", description: "", link: "", image: "", type: "blog" });
      setFile(null);
    } catch (err) {
      toast.error("Failed to add resource.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: C.bg, py: 12 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: "28px", border: `1px solid ${C.border}`, bgcolor: C.white, boxShadow: "0 8px 32px rgba(21,101,192,0.08)" }}>
          <Stack spacing={1} sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={900} color={C.dark}>Add Resource</Typography>
            <Typography variant="body2" color={C.textDim}>Share a helpful resource with the community.</Typography>
          </Stack>

          <Divider sx={{ borderColor: C.border, mb: 3 }} />

          <TextField fullWidth label="Title" name="title" value={form.title} onChange={handleChange} sx={inputSx} />
          <TextField fullWidth multiline rows={3} label="Description" name="description" value={form.description} onChange={handleChange} sx={inputSx} />
          <TextField fullWidth label="Link (URL)" name="link" value={form.link} onChange={handleChange} sx={inputSx} />
          <TextField fullWidth label="Image URL (optional)" name="image" value={form.image} onChange={handleChange} sx={inputSx} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: C.textDim, fontWeight: 700, display: "block", mb: 1 }}>
              Or upload an image file
            </Typography>
            <Button component="label" variant="outlined" size="small"
              sx={{ borderColor: C.border, color: C.accent, borderRadius: "10px", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: C.accent, bgcolor: C.accentBg } }}>
              {file ? file.name : "Choose File"}
              <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
            </Button>
          </Box>

          <TextField select fullWidth label="Resource Type" name="type" value={form.type} onChange={handleChange} sx={{ ...inputSx, mb: 4 }}
            SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: C.white, borderRadius: "12px", border: `1px solid ${C.border}` } } } }}>
            {["blog", "tool", "video", "news", "report"].map((t) => (
              <MenuItem key={t} value={t} sx={{ textTransform: "capitalize" }}>{t.charAt(0).toUpperCase() + t.slice(1)}</MenuItem>
            ))}
          </TextField>

          <Button variant="contained" fullWidth onClick={handleSubmit}
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              py: 1.8, bgcolor: C.accent, borderRadius: "14px", fontWeight: 800, textTransform: "none", fontSize: "1rem",
              boxShadow: "0 8px 24px rgba(21,101,192,0.3)",
              "&:hover": { bgcolor: C.accentLight, transform: "translateY(-2px)" },
              transition: "all 0.3s ease",
            }}>
            Submit Resource
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddResource;
