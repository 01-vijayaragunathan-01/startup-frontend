import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Input,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddResource = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    image: "",
    type: "blog",
  });

  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    let imageUrl = form.image;

    try {
      // Upload to Cloudinary if file is selected
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "mentor_resources"); 
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dmakodto1/image/upload",
          formData
        );
        imageUrl = res.data.secure_url;
      }

      const payload = {
        ...form,
        image: imageUrl,
      };

      await axios.post("http://localhost:5000/api/resources", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Resource added successfully!");
      setForm({ title: "", description: "", link: "", image: "", type: "blog" });
      setFile(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to add resource.");
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        ➕ Add New Resource
      </Typography>

      <TextField
        fullWidth
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Link"
        name="link"
        value={form.link}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      {/* Optional Image URL input */}
      <TextField
        fullWidth
        label="Image URL (optional)"
        name="image"
        value={form.image}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      {/* File Upload input */}
      <Input
        type="file"
        onChange={handleFileChange}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        select
        label="Type"
        name="type"
        value={form.type}
        onChange={handleChange}
        sx={{ mb: 3 }}
      >
        <MenuItem value="blog">Blog</MenuItem>
        <MenuItem value="tool">Tool</MenuItem>
        <MenuItem value="video">Video</MenuItem>
        <MenuItem value="news">News</MenuItem>
        <MenuItem value="report">Report</MenuItem>
      </TextField>

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
};

export default AddResource;
