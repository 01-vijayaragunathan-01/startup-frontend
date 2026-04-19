import React, { useEffect, useRef, useState } from "react";
import {
  Box, Typography, Container, Grid, Paper, Stack, Button, Chip,
  Avatar, IconButton, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, LinearProgress, Tooltip, Divider,
  MenuItem, Select, FormControl, InputLabel,
} from "@mui/material";
import AddIcon           from "@mui/icons-material/Add";
import EditIcon          from "@mui/icons-material/Edit";
import DeleteIcon        from "@mui/icons-material/Delete";
import PlayCircleIcon    from "@mui/icons-material/PlayCircle";
import PictureAsPdfIcon  from "@mui/icons-material/PictureAsPdf";
import DownloadIcon      from "@mui/icons-material/Download";
import UploadFileIcon    from "@mui/icons-material/UploadFile";
import SchoolIcon        from "@mui/icons-material/School";
import CloseIcon         from "@mui/icons-material/Close";
import InboxIcon         from "@mui/icons-material/Inbox";
import LockIcon          from "@mui/icons-material/Lock";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "https://startup-backend-1-cj33.onrender.com";

const C = {
  bg:        "#f0f4ff",
  white:     "#ffffff",
  accent:    "#1565c0",
  accentAlt: "#1e88e5",
  accentBg:  "rgba(21,101,192,0.07)",
  border:    "rgba(21,101,192,0.14)",
  textDim:   "#546e7a",
  dark:      "#1a237e",
  danger:    "#c62828",
  dangerBg:  "rgba(198,40,40,0.07)",
  pdf:       "#e65100",
  pdfBg:     "rgba(230,81,0,0.08)",
};

const card = {
  background:   C.white, border: `1px solid ${C.border}`,
  borderRadius: "20px",  boxShadow: "0 4px 24px rgba(21,101,192,0.07)",
  overflow:     "hidden", transition: "all 0.25s",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const Empty = ({ text, sub }) => (
  <Stack alignItems="center" spacing={2} sx={{ py: 10 }}>
    <InboxIcon sx={{ fontSize: 56, color: C.border }} />
    <Typography variant="h6" fontWeight={700} color={C.textDim}>{text}</Typography>
    {sub && <Typography variant="body2" color={C.textDim} textAlign="center" maxWidth={380}>{sub}</Typography>}
  </Stack>
);

// ── Course Card ───────────────────────────────────────────────────────────────
const CourseCard = ({ course, isMentor, onEdit, onDelete }) => {
  const isPdf = course.type === "pdf";
  return (
    <Paper sx={{ ...card, "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 40px rgba(21,101,192,0.14)" } }}>
      {/* Color header bar */}
      <Box sx={{
        height: 6,
        background: isPdf
          ? `linear-gradient(90deg, ${C.pdf}, #ff8f00)`
          : `linear-gradient(90deg, ${C.accent}, ${C.accentAlt})`,
      }} />

      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {/* Icon */}
          <Box sx={{
            width: 52, height: 52, borderRadius: "14px", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            bgcolor: isPdf ? C.pdfBg : C.accentBg,
          }}>
            {isPdf
              ? <PictureAsPdfIcon sx={{ color: C.pdf, fontSize: 28 }} />
              : <PlayCircleIcon   sx={{ color: C.accent, fontSize: 28 }} />}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Chip label={isPdf ? "PDF" : "VIDEO"} size="small"
              sx={{
                bgcolor: isPdf ? C.pdfBg : C.accentBg,
                color:   isPdf ? C.pdf  : C.accent,
                fontWeight: 800, fontSize: "0.6rem", letterSpacing: 1,
                borderRadius: "6px", height: 20, mb: 0.8,
              }} />
            <Typography variant="h6" fontWeight={800} color={C.dark}
              sx={{ lineHeight: 1.2, fontSize: "1rem", mb: 0.5 }} noWrap>
              {course.title}
            </Typography>
            {course.description && (
              <Typography variant="body2" color={C.textDim} sx={{ lineHeight: 1.6, fontSize: "0.78rem",
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {course.description}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Meta */}
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2, mb: 2 }}>
          {course.fileSize && (
            <Chip label={course.fileSize} size="small"
              sx={{ bgcolor: C.accentBg, color: C.textDim, fontSize: "0.65rem", borderRadius: "6px" }} />
          )}
          {course.mentor?.name && !isMentor && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Avatar src={course.mentor.avatar} sx={{ width: 18, height: 18, fontSize: "0.6rem", bgcolor: C.accent }}>
                {course.mentor.name?.[0]}
              </Avatar>
              <Typography variant="caption" color={C.textDim} fontWeight={600}>{course.mentor.name}</Typography>
            </Stack>
          )}
          <Typography variant="caption" color={C.textDim}>
            {new Date(course.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </Typography>
        </Stack>

        <Divider sx={{ borderColor: C.border, mb: 2 }} />

        {/* Actions */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {isPdf ? (
          <>
              {/* View PDF — get signed URL then open in new tab */}
              <Button flex={1} variant="outlined" size="small"
                startIcon={<PictureAsPdfIcon />}
                onClick={async () => {
                  const tid = toast.loading("Opening PDF…");
                  try {
                    const token = localStorage.getItem("token");
                    const r = await fetch(
                      `${BASE_URL}/api/courses/${course._id}/pdf-url?disposition=inline`,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const data = await r.json();
                    if (!r.ok || !data.url) throw new Error(data.message || "Failed");
                    toast.dismiss(tid);
                    window.open(data.url, "_blank");
                  } catch (e) {
                    toast.dismiss(tid);
                    toast.error("Could not open PDF: " + e.message);
                  }
                }}
                sx={{ borderColor: C.pdf, color: C.pdf, borderRadius: "9px", textTransform: "none",
                  fontWeight: 700, fontSize: "0.72rem", flex: 1,
                  "&:hover": { bgcolor: C.pdfBg } }}>
                View PDF
              </Button>
              {/* Download PDF — same but with disposition=attachment */}
              <Button flex={1} variant="contained" size="small"
                startIcon={<DownloadIcon />}
                onClick={async () => {
                  const tid = toast.loading("Preparing download…");
                  try {
                    const token = localStorage.getItem("token");
                    const r = await fetch(
                      `${BASE_URL}/api/courses/${course._id}/pdf-url?disposition=attachment`,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const data = await r.json();
                    if (!r.ok || !data.url) throw new Error(data.message || "Failed");
                    toast.dismiss(tid);
                    window.open(data.url, "_blank");
                  } catch (e) {
                    toast.dismiss(tid);
                    toast.error("Could not download PDF: " + e.message);
                  }
                }}
                sx={{ bgcolor: C.pdf, borderRadius: "9px", textTransform: "none", fontWeight: 700,
                  fontSize: "0.72rem", flex: 1, "&:hover": { bgcolor: "#bf360c" } }}>
                Download
              </Button>
            </>
          ) : (
            <Button fullWidth variant="contained" size="small" startIcon={<PlayCircleIcon />}
              onClick={() => window.open(course.fileUrl, "_blank")}
              sx={{ bgcolor: C.accent, borderRadius: "9px", textTransform: "none", fontWeight: 700,
                fontSize: "0.78rem", "&:hover": { bgcolor: C.accentAlt } }}>
              Watch Video
            </Button>
          )}

          {isMentor && (
            <>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => onEdit(course)}
                  sx={{ border: `1px solid ${C.border}`, borderRadius: "9px", color: C.accent,
                    "&:hover": { bgcolor: C.accentBg } }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => onDelete(course)}
                  sx={{ border: "1px solid rgba(198,40,40,0.2)", borderRadius: "9px", color: C.danger,
                    "&:hover": { bgcolor: C.dangerBg } }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const Courses = () => {
  const user        = JSON.parse(localStorage.getItem("user") || "{}");
  const token       = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };
  const isMentor    = user?.role === "mentor";

  const [courses,   setCourses]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [addOpen,   setAddOpen]   = useState(false);
  const [editObj,   setEditObj]   = useState(null);  // course being edited
  const [delObj,    setDelObj]    = useState(null);   // course to delete
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [form,      setForm]      = useState({ title: "", description: "", type: "video" });
  const fileRef = useRef(null);

  // ── Fetch courses ─────────────────────────────────────────────────────────
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const url = isMentor ? `${BASE_URL}/api/courses/my` : `${BASE_URL}/api/courses/student`;
      const res = await axios.get(url, { headers: authHeaders });
      setCourses(res.data.data || []);
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []); // eslint-disable-line

  // ── Add course ────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file)         return toast.error("Please select a file");
    if (!form.title.trim()) return toast.error("Title is required");

    const fd = new FormData();
    fd.append("file",        file);
    fd.append("title",       form.title.trim());
    fd.append("description", form.description);
    fd.append("type",        form.type);

    setUploading(true); setProgress(0);
    try {
      const res = await axios.post(`${BASE_URL}/api/courses`, fd, {
        headers: { "Content-Type": "multipart/form-data", ...authHeaders },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });
      setCourses((p) => [res.data.data, ...p]);
      toast.success("Course uploaded!");
      setAddOpen(false);
      setForm({ title: "", description: "", type: "video" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false); setProgress(0);
    }
  };

  // ── Edit course ───────────────────────────────────────────────────────────
  const handleEdit = async () => {
    if (!editObj) return;
    try {
      const res = await axios.put(
        `${BASE_URL}/api/courses/${editObj._id}`,
        { title: form.title, description: form.description },
        { headers: authHeaders }
      );
      setCourses((p) => p.map((c) => (c._id === editObj._id ? res.data.data : c)));
      toast.success("Course updated");
      setEditObj(null);
    } catch { toast.error("Update failed"); }
  };

  // ── Delete course ─────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!delObj) return;
    try {
      await axios.delete(`${BASE_URL}/api/courses/${delObj._id}`, { headers: authHeaders });
      setCourses((p) => p.filter((c) => c._id !== delObj._id));
      toast.success("Course deleted");
      setDelObj(null);
    } catch { toast.error("Delete failed"); }
  };

  const openEdit = (course) => {
    setEditObj(course);
    setForm({ title: course.title, description: course.description, type: course.type });
  };

  const videos = courses.filter((c) => c.type === "video");
  const pdfs   = courses.filter((c) => c.type === "pdf");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: C.bg, py: 12 }}>
      <Container maxWidth="xl">

        {/* ── HEADER ──────────────────────────────────────────────────── */}
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} sx={{ mb: 6 }}>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
              <SchoolIcon sx={{ color: C.accent, fontSize: 32 }} />
              <Typography variant="h4" fontWeight={900} color={C.dark} letterSpacing="-0.02em">
                {isMentor ? "My Courses" : "My Learning"}
              </Typography>
            </Stack>
            <Typography variant="body2" color={C.textDim}>
              {isMentor
                ? "Upload videos and PDFs for your connected students."
                : "Courses shared by your connected mentors."}
            </Typography>
          </Box>

          {isMentor && (
            <Button variant="contained" startIcon={<AddIcon />}
              onClick={() => { setAddOpen(true); setForm({ title: "", description: "", type: "video" }); }}
              sx={{ bgcolor: C.accent, borderRadius: "14px", fontWeight: 800, px: 4, py: 1.5,
                textTransform: "none", boxShadow: "0 4px 20px rgba(21,101,192,0.3)",
                "&:hover": { bgcolor: C.accentAlt, transform: "translateY(-2px)" }, transition: "all 0.2s",
                mt: { xs: 2, sm: 0 } }}>
              Upload Course
            </Button>
          )}
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
            <CircularProgress sx={{ color: C.accent }} />
          </Box>
        ) : courses.length === 0 ? (
          <Paper sx={{ ...card }}>
            {isMentor
              ? <Empty text="No courses yet" sub="Upload a video or PDF to share with your connected students." />
              : <Box sx={{ p: 4 }}>
                  <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
                    <LockIcon sx={{ fontSize: 56, color: C.border }} />
                    <Typography variant="h6" fontWeight={700} color={C.textDim}>No Courses Available</Typography>
                    <Typography variant="body2" color={C.textDim} textAlign="center" maxWidth={400}>
                      Courses from your connected mentors will appear here. Connect with a mentor first.
                    </Typography>
                  </Stack>
                </Box>
            }
          </Paper>
        ) : (
          <>
            {/* ── VIDEOS SECTION ──────────────────────────────────────── */}
            {videos.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <Box sx={{ width: 4, height: 28, borderRadius: 2, bgcolor: C.accent }} />
                  <Typography variant="h6" fontWeight={900} color={C.dark}>
                    Video Courses
                  </Typography>
                  <Chip label={videos.length} size="small"
                    sx={{ bgcolor: C.accentBg, color: C.accent, fontWeight: 800 }} />
                </Stack>
                <Grid container spacing={3}>
                  {videos.map((course) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
                      <CourseCard course={course} isMentor={isMentor}
                        onEdit={openEdit} onDelete={setDelObj} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* ── PDF SECTION ─────────────────────────────────────────── */}
            {pdfs.length > 0 && (
              <Box>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <Box sx={{ width: 4, height: 28, borderRadius: 2, bgcolor: C.pdf }} />
                  <Typography variant="h6" fontWeight={900} color={C.dark}>
                    Study Materials (PDF)
                  </Typography>
                  <Chip label={pdfs.length} size="small"
                    sx={{ bgcolor: C.pdfBg, color: C.pdf, fontWeight: 800 }} />
                </Stack>
                <Grid container spacing={3}>
                  {pdfs.map((course) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
                      <CourseCard course={course} isMentor={isMentor}
                        onEdit={openEdit} onDelete={setDelObj} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </>
        )}
      </Container>

      {/* ── ADD DIALOG ─────────────────────────────────────────────────────── */}
      <Dialog open={addOpen} onClose={() => !uploading && setAddOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: C.dark, pb: 0 }}>
          Upload Course
          <IconButton onClick={() => setAddOpen(false)} disabled={uploading}
            sx={{ position: "absolute", right: 12, top: 12, color: C.textDim }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select label="Type" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                sx={{ borderRadius: "10px" }}>
                <MenuItem value="video">🎬 Video</MenuItem>
                <MenuItem value="pdf">📄 PDF / Study Material</MenuItem>
              </Select>
            </FormControl>

            <TextField label="Title" fullWidth size="small" value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />

            <TextField label="Description (optional)" fullWidth size="small" multiline rows={3}
              value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />

            {/* File picker */}
            <Box>
              <Button component="label" variant="outlined" fullWidth startIcon={<UploadFileIcon />}
                sx={{ borderRadius: "10px", borderColor: C.border, color: C.accent, textTransform: "none",
                  fontWeight: 700, py: 1.5, "&:hover": { borderColor: C.accent, bgcolor: C.accentBg } }}>
                {fileRef.current?.files?.[0]?.name || `Choose ${form.type === "video" ? "Video" : "PDF"} File`}
                <input hidden type="file" ref={fileRef}
                  accept={form.type === "video" ? "video/*" : "application/pdf"} />
              </Button>
              <Typography variant="caption" color={C.textDim} sx={{ mt: 0.5, display: "block" }}>
                {form.type === "video" ? "MP4, MOV, AVI — up to 200 MB" : "PDF — up to 50 MB"}
              </Typography>
            </Box>

            {/* Upload progress */}
            {uploading && (
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" color={C.accent} fontWeight={700}>Uploading…</Typography>
                  <Typography variant="caption" color={C.accent} fontWeight={700}>{progress}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={progress}
                  sx={{ borderRadius: 4, height: 6, bgcolor: C.accentBg, "& .MuiLinearProgress-bar": { bgcolor: C.accent } }} />
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setAddOpen(false)} disabled={uploading}
            sx={{ color: C.textDim, textTransform: "none", fontWeight: 700 }}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={uploading}
            startIcon={uploading ? <CircularProgress size={14} color="inherit" /> : <UploadFileIcon />}
            sx={{ bgcolor: C.accent, borderRadius: "10px", textTransform: "none", fontWeight: 800, px: 3,
              "&:hover": { bgcolor: C.accentAlt } }}>
            {uploading ? `Uploading ${progress}%` : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── EDIT DIALOG ────────────────────────────────────────────────────── */}
      <Dialog open={Boolean(editObj)} onClose={() => setEditObj(null)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: C.dark }}>Edit Course</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField label="Title" fullWidth size="small" value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <TextField label="Description" fullWidth size="small" multiline rows={3}
              value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setEditObj(null)} sx={{ color: C.textDim, textTransform: "none" }}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained"
            sx={{ bgcolor: C.accent, borderRadius: "10px", textTransform: "none", fontWeight: 800, px: 3,
              "&:hover": { bgcolor: C.accentAlt } }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── DELETE CONFIRM ─────────────────────────────────────────────────── */}
      <Dialog open={Boolean(delObj)} onClose={() => setDelObj(null)}
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: C.danger }}>Delete Course?</DialogTitle>
        <DialogContent>
          <Typography color={C.textDim}>
            Are you sure you want to delete <strong>"{delObj?.title}"</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDelObj(null)} sx={{ textTransform: "none", color: C.textDim }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error"
            sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 800, px: 3 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Courses;
