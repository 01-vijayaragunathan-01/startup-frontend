import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Avatar,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ProfileForm = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    about: user.about || "",
    expertise: user.expertise?.join(", ") || "",
    avatar: user.avatar || "",
    banner: user.banner || "",
  });

  const handleImageUpload = async (e, key) => {
    const file = e.target.files[0];
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", "your_upload_preset"); // Replace with yours

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
        form
      );
      setFormData((prev) => ({ ...prev, [key]: res.data.secure_url }));
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/profile/update`,
        { ...formData, expertise: formData.expertise.split(",") },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Profile updated");
      onUpdate(res.data);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Edit Profile
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <TextField
        fullWidth
        margin="normal"
        label="About"
        multiline
        rows={3}
        value={formData.about}
        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Expertise (comma separated)"
        value={formData.expertise}
        onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
      />

      <Box mt={2}>
        <Typography variant="body2">Profile Picture</Typography>
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "avatar")} />
        {formData.avatar && <Avatar src={formData.avatar} sx={{ mt: 1, width: 80, height: 80 }} />}
      </Box>

      <Box mt={2}>
        <Typography variant="body2">Banner Image</Typography>
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "banner")} />
        {formData.banner && <img src={formData.banner} alt="Banner" width="100%" style={{ marginTop: 10 }} />}
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleSubmit}
      >
        Update Profile
      </Button>
    </Box>
  );
};

export default ProfileForm;
