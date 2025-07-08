import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  Avatar,
} from "@mui/material";
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

  // Fetch current user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/profile/me", {
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
      const res = await axios.post("http://localhost:5000/api/upload/image", formData, {
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
        "http://localhost:5000/api/profile/update",
        { name, about, expertise, avatar, banner },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box
        sx={{
          bgcolor: "#fff",
          boxShadow: 3,
          borderRadius: 3,
          overflow: "hidden",
          mb: 4,
        }}
      >
        {banner && (
          <img
            src={banner}
            alt="Banner"
            style={{ width: "100%", height: "200px", objectFit: "cover" }}
          />
        )}
        <Box sx={{ textAlign: "center", mt: -6 }}>
          <Avatar
            src={avatar}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid white",
              mx: "auto",
            }}
          />
        </Box>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            {name}
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary">
            {about}
          </Typography>
          <Box mt={2} textAlign="center">
            {expertise.map((skill, idx) => (
              <Chip
                key={idx}
                label={skill}
                onDelete={() => handleRemoveSkill(skill)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Editable form */}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label="About"
          margin="normal"
          multiline
          rows={4}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />

        {/* Skill input */}
        <Box mb={2}>
          <Typography variant="subtitle1">Expertise</Typography>
          <Box display="flex" gap={1} mt={1}>
            <TextField
              label="Add Skill"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddSkill}>
              Add
            </Button>
          </Box>
        </Box>

        {/* Avatar Upload */}
        <Box mb={2}>
          <Typography variant="subtitle1">Avatar</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, setAvatar)}
          />
        </Box>

        {/* Banner Upload */}
        <Box mb={2}>
          <Typography variant="subtitle1">Banner</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, setBanner)}
          />
        </Box>

        <Button type="submit" variant="contained" fullWidth>
          Save Changes
        </Button>
      </form>
    </Container>
  );
};

export default MyProfile;
