import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Container, Typography, TextField, Button, Paper, Divider, Stack,
  Table, TableBody, TableCell, TableContainer, TableRow, Chip, IconButton,
  CircularProgress, Tooltip, Avatar, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert,
} from "@mui/material";
import SaveIcon            from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon   from "@mui/icons-material/DeleteOutline";
import RefreshIcon         from "@mui/icons-material/Refresh";
import DownloadIcon        from "@mui/icons-material/Download";
import WarningIcon         from "@mui/icons-material/Warning";
import LockIcon            from "@mui/icons-material/Lock";
import axios from "axios";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";

const BASE_URL = "https://startup-backend-1-cj33.onrender.com";

const C = {
  bg: "#f0f4ff", white: "#ffffff", accent: "#1565c0", accentLight: "#1e88e5",
  accentBg: "rgba(21,101,192,0.07)", border: "rgba(21,101,192,0.14)",
  textDim: "#546e7a", dark: "#1a237e", danger: "#c62828", dangerBg: "rgba(198,40,40,0.06)",
};

const card = {
  background: C.white, border: `1px solid ${C.border}`, borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(21,101,192,0.07)",
};

const inputSx = (readOnly) => ({
  mb: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    bgcolor: readOnly ? "#f8faff" : "#ffffff",
    "& fieldset": { borderColor: C.border },
    ...(!readOnly && {
      "&:hover fieldset": { borderColor: C.accent },
      "&.Mui-focused fieldset": { borderColor: C.accent },
    }),
  },
  "& .MuiInputLabel-root": { color: C.textDim, fontSize: "0.85rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: C.accent },
});

const defaultSemester = (id) => ({ id, semesterNumber: id, gpa: "", subjects: [{ code: "", name: "", marks: "" }] });

// ── PDF generation ──────────────────────────────────────────────────────────
const generatePDF = (data, studentName) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210; let y = 18;

  const addSection = (title) => {
    if (y > 260) { doc.addPage(); y = 18; }
    doc.setFillColor(21, 101, 192);
    doc.rect(10, y, W - 20, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8); doc.setFont(undefined, "bold");
    doc.text(title, 14, y + 5);
    y += 10; doc.setTextColor(30, 30, 30); doc.setFont(undefined, "normal"); doc.setFontSize(8);
  };

  const addRow = (label, value) => {
    if (y > 270) { doc.addPage(); y = 18; }
    doc.setFont(undefined, "bold"); doc.text(label + ":", 14, y); 
    doc.setFont(undefined, "normal"); doc.text(String(value || "—"), 65, y);
    y += 6;
  };

  // Title
  doc.setFontSize(18); doc.setFont(undefined, "bold"); doc.setTextColor(21, 101, 192);
  doc.text("SRM University — Student History Record", W / 2, y, { align: "center" });
  y += 5;
  doc.setFontSize(9); doc.setTextColor(100, 100, 100); doc.setFont(undefined, "normal");
  doc.text(`Generated on ${new Date().toLocaleDateString("en-IN")}`, W / 2, y + 3, { align: "center" });
  y += 12; doc.setDrawColor(21, 101, 192); doc.line(10, y, W - 10, y); y += 8;

  addSection("01 — IDENTITY & LEGAL");
  addRow("Full Name",     data.fullName);
  addRow("Reg No",        data.regNo);
  addRow("Admission No",  data.admissionNo);
  addRow("Blood Group",   data.bloodGroup);
  addRow("Phone",         data.phoneNumber);
  addRow("DOB",           data.dob ? new Date(data.dob).toLocaleDateString("en-IN") : "");
  addRow("Department",    data.department);
  addRow("Aadhaar No",    data.aadhaarNo);
  addRow("License No",    data.licenseNo);
  addRow("Address",       data.permanentAddress);

  addSection("02 — GUARDIANS");
  addRow("Father's Name",        data.guardians?.fatherName);
  addRow("Father's Occupation",  data.guardians?.fatherOccupation);
  addRow("Father's Income",      data.guardians?.fatherAnnualIncome);
  addRow("Father's Aadhaar",     data.guardians?.fatherAadhaar);
  addRow("Mother's Name",        data.guardians?.motherName);
  addRow("Mother's Occupation",  data.guardians?.motherOccupation);
  addRow("Mother's Income",      data.guardians?.motherAnnualIncome);
  addRow("Mother's Aadhaar",     data.guardians?.motherAadhaar);

  addSection("03 — SCHOOLING");
  addRow("10th School",      data.schooling?.highSchoolName);
  addRow("10th Percentage",  data.schooling?.highSchoolPercentage);
  addRow("12th School",      data.schooling?.higherSecondaryName);
  addRow("12th Percentage",  data.schooling?.higherSecondaryPercentage);

  addSection("04 — SKILLS & ACHIEVEMENTS");
  addRow("Skills",          (data.skills || []).join(", "));
  addRow("Achievement",     data.newAchievement);
  addRow("Certification",   data.certificationLink);

  addSection("05 — ACADEMIC LEDGER");
  (data.semesters || []).forEach((sem) => {
    if (y > 260) { doc.addPage(); y = 18; }
    doc.setFont(undefined, "bold"); doc.setFontSize(8);
    doc.text(`Semester ${sem.semesterNumber} — GPA: ${sem.gpa || "N/A"}`, 14, y); y += 5;
    doc.setFont(undefined, "normal");
    (sem.subjects || []).forEach((sub) => {
      if (y > 270) { doc.addPage(); y = 18; }
      doc.text(`  ${sub.code || "—"}  |  ${sub.name || "—"}  |  Marks: ${sub.marks || "—"}`, 16, y); y += 5;
    });
    y += 2;
  });

  doc.save(`${studentName || "student"}_history.pdf`);
};

// ── StudentHistory Component ────────────────────────────────────────────────
const StudentHistory = () => {
  const navigate        = useNavigate();
  const { studentId }   = useParams();   // Present when mentor views a student
  const token           = localStorage.getItem("token");
  const currentUser     = JSON.parse(localStorage.getItem("user") || "{}");
  const isMentor        = currentUser?.role === "mentor";
  const isReadOnly      = isMentor && !!studentId; // Mentor viewing specific student
  const authHeaders     = { Authorization: `Bearer ${token}` };

  const emptyIdentity = { fullName: "", regNo: "", phoneNumber: "", dob: "", department: "", permanentAddress: "", bloodGroup: "", aadhaarNo: "", admissionNo: "", licenseNo: "", studentPhoto: "" };
  const emptyGuardians = { fatherName: "", fatherOccupation: "", motherName: "", motherOccupation: "", fatherPhoto: "", motherPhoto: "", fatherAadhaar: "", motherAadhaar: "", fatherLicense: "", motherLicense: "", fatherAnnualIncome: "", motherAnnualIncome: "" };
  const emptySchooling = { highSchoolName: "", highSchoolPercentage: "", higherSecondaryName: "", higherSecondaryPercentage: "" };

  const [identity,          setIdentity]          = useState(emptyIdentity);
  const [guardians,         setGuardians]         = useState(emptyGuardians);
  const [schooling,         setSchooling]         = useState(emptySchooling);
  const [skills,            setSkills]            = useState([]);
  const [newSkill,          setNewSkill]          = useState("");
  const [newAchievement,    setNewAchievement]    = useState("");
  const [certificationLink, setCertificationLink] = useState("");
  const [semesters,         setSemesters]         = useState([defaultSemester(1)]);
  const [isNew,             setIsNew]             = useState(null);
  const [loading,           setLoading]           = useState(true);
  const [saving,            setSaving]            = useState(false);
  const [deleteDialog,      setDeleteDialog]      = useState(false);
  const [recordData,        setRecordData]        = useState(null); // Raw data for PDF

  const hydrateForm = (data) => {
    setRecordData(data);
    setIdentity({
      fullName: data.fullName || "", regNo: data.regNo || "", phoneNumber: data.phoneNumber || "",
      dob: data.dob ? data.dob.slice(0, 10) : "", department: data.department || "",
      permanentAddress: data.permanentAddress || "", bloodGroup: data.bloodGroup || "",
      aadhaarNo: data.aadhaarNo || "", admissionNo: data.admissionNo || "",
      licenseNo: data.licenseNo || "", studentPhoto: data.studentPhoto || "",
    });
    setGuardians({
      fatherName: data.guardians?.fatherName || "", fatherOccupation: data.guardians?.fatherOccupation || "",
      motherName: data.guardians?.motherName || "", motherOccupation: data.guardians?.motherOccupation || "",
      fatherPhoto: data.guardians?.fatherPhoto || "", motherPhoto: data.guardians?.motherPhoto || "",
      fatherAadhaar: data.guardians?.fatherAadhaar || "", motherAadhaar: data.guardians?.motherAadhaar || "",
      fatherLicense: data.guardians?.fatherLicense || "", motherLicense: data.guardians?.motherLicense || "",
      fatherAnnualIncome: data.guardians?.fatherAnnualIncome || "", motherAnnualIncome: data.guardians?.motherAnnualIncome || "",
    });
    setSchooling({
      highSchoolName: data.schooling?.highSchoolName || "", highSchoolPercentage: data.schooling?.highSchoolPercentage || "",
      higherSecondaryName: data.schooling?.higherSecondaryName || "", higherSecondaryPercentage: data.schooling?.higherSecondaryPercentage || "",
    });
    setSkills(data.skills || []);
    setNewAchievement(data.newAchievement || "");
    setCertificationLink(data.certificationLink || "");
    if (data.semesters?.length) {
      setSemesters(data.semesters.map((s) => ({ id: s.semesterNumber, semesterNumber: s.semesterNumber, gpa: s.gpa || "", subjects: s.subjects?.length ? s.subjects : [{ code: "", name: "", marks: "" }] })));
    }
  };

  const handleImageUpload = (e, section, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (section === "identity") setIdentity((p) => ({ ...p, [field]: reader.result }));
      else setGuardians((p) => ({ ...p, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const loadRecord = useCallback(async () => {
    setLoading(true);
    try {
      const url = isReadOnly
        ? `${BASE_URL}/api/student-history/${studentId}`
        : `${BASE_URL}/api/student-history`;
      const { data } = await axios.get(url, { headers: authHeaders });
      hydrateForm(data.data);
      setIsNew(false);
    } catch (err) {
      if (err.response?.status === 404) setIsNew(true);
      else if (err.response?.status === 403) {
        toast.error("Access denied — you are not connected with this student.");
        navigate("/dashboard");
      } else {
        toast.error(err.response?.data?.message || "Failed to load history.");
        setIsNew(true);
      }
    } finally { setLoading(false); }
  }, [studentId, isReadOnly]);

  useEffect(() => { loadRecord(); }, [loadRecord]);

  const buildPayload = () => ({
    ...identity, guardians, schooling, skills, newAchievement, certificationLink,
    semesters: semesters.map((s) => ({ semesterNumber: s.semesterNumber || s.id, gpa: s.gpa, subjects: s.subjects })),
  });

  const handleSync = async () => {
    setSaving(true);
    try {
      const payload = buildPayload();
      let responseData;
      if (isNew) {
        const res = await axios.post(`${BASE_URL}/api/student-history`, payload, { headers: authHeaders });
        responseData = res.data.data; setIsNew(false); toast.success("History record created!");
      } else {
        const res = await axios.put(`${BASE_URL}/api/student-history`, payload, { headers: authHeaders });
        responseData = res.data.data; toast.success("Record updated successfully!");
      }
      if (responseData) hydrateForm(responseData);
    } catch (err) {
      if (err.response?.status === 409) { setIsNew(false); setSaving(false); handleSync(); return; }
      toast.error(err.response?.data?.message || "Failed to save.");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/student-history`, { headers: authHeaders });
      toast.success("Record deleted.");
      setDeleteDialog(false);
      setIsNew(true);
      setIdentity(emptyIdentity); setGuardians(emptyGuardians); setSchooling(emptySchooling);
      setSkills([]); setNewAchievement(""); setCertificationLink(""); setSemesters([defaultSemester(1)]);
    } catch (err) { toast.error(err.response?.data?.message || "Delete failed."); }
  };

  const addSkill    = () => { const t = newSkill.trim(); if (t && !skills.includes(t)) { setSkills([...skills, t]); setNewSkill(""); } };
  const removeSkill = (s) => setSkills(skills.filter((sk) => sk !== s));
  const addSemester = () => { if (semesters.length < 8) setSemesters([...semesters, defaultSemester(semesters.length + 1)]); };
  const addSubject  = (si) => { const u = [...semesters]; u[si].subjects.push({ code: "", name: "", marks: "" }); setSemesters(u); };
  const updateSubject = (si, subi, field, val) => { const u = [...semesters]; u[si].subjects[subi][field] = val; setSemesters(u); };
  const removeSubject = (si, subi) => { const u = [...semesters]; u[si].subjects.splice(subi, 1); setSemesters(u); };
  const updateGpa   = (si, val) => { const u = [...semesters]; u[si].gpa = val; setSemesters(u); };

  const handleDownloadPDF = () => generatePDF(recordData || buildPayload(), identity.fullName || currentUser.name);

  if (loading) return (
    <Box sx={{ bgcolor: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress sx={{ color: C.accent }} />
    </Box>
  );

  // Mentor with no studentId → redirect them to dashboard
  if (isMentor && !studentId) {
    return (
      <Box sx={{ bgcolor: C.bg, minHeight: "100vh", py: 12 }}>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography variant="h5" fontWeight={800} color={C.dark} mb={2}>Select a Student</Typography>
          <Typography sx={{ color: C.textDim, mb: 4 }}>
            Go to your Dashboard and click a connected student to view their history.
          </Typography>
          <Button variant="contained" onClick={() => navigate("/dashboard")}
            sx={{ bgcolor: C.accent, borderRadius: 2, textTransform: "none", fontWeight: 700 }}>
            Back to Dashboard
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: C.bg, minHeight: "100vh", py: 10 }}>
      <Container maxWidth="xl">

        {/* TOP BAR */}
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} sx={{ mb: 4 }} gap={2}>
          <Box>
            <Typography variant="h4" fontWeight={900} color={C.dark} letterSpacing="-0.02em">
              Student History
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
              <Typography variant="caption" sx={{ color: C.accent, fontWeight: 800, letterSpacing: 2 }}>
                SRM UNIVERSITY TRICHY
              </Typography>
              {isReadOnly && (
                <Chip icon={<LockIcon sx={{ fontSize: "0.75rem" }} />} label="MENTOR VIEW — READ ONLY"
                  size="small" sx={{ bgcolor: "rgba(198,40,40,0.1)", color: C.danger, fontWeight: 800, fontSize: "0.62rem" }} />
              )}
            </Stack>
          </Box>

          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            <Tooltip title="Reload from server">
              <IconButton onClick={loadRecord} sx={{ color: C.accent, border: `1px solid ${C.border}`, borderRadius: "10px" }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            {/* PDF Download — always visible */}
            {!isNew && (
              <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadPDF}
                sx={{ borderColor: C.border, color: C.accent, borderRadius: "12px", fontWeight: 700, textTransform: "none", "&:hover": { borderColor: C.accent, bgcolor: C.accentBg } }}>
                Download PDF
              </Button>
            )}

            {/* Save/Update — only for students */}
            {!isReadOnly && (
              <Button variant="contained"
                startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon />}
                onClick={handleSync} disabled={saving}
                sx={{ bgcolor: C.accent, px: 4, borderRadius: "12px", fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: C.accentLight } }}>
                {saving ? "Saving…" : isNew ? "Create Record" : "Save Changes"}
              </Button>
            )}

            {/* Delete — only for students with an existing record */}
            {!isReadOnly && !isNew && (
              <Button variant="outlined" startIcon={<DeleteOutlineIcon />} onClick={() => setDeleteDialog(true)}
                sx={{ borderColor: C.danger, color: C.danger, borderRadius: "12px", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: C.dangerBg } }}>
                Delete
              </Button>
            )}
          </Stack>
        </Stack>

        {isNew && !isReadOnly && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: "12px" }}>
            No record found. Fill in the form below and click <strong>Create Record</strong> to save.
          </Alert>
        )}

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {/* Left Column */}
          <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 64%" }, display: "flex", flexDirection: "column", gap: 3 }}>

            {/* 01 IDENTITY */}
            <Paper sx={{ ...card, p: 3 }}>
              <Typography variant="overline" color={C.accent} fontWeight={900} letterSpacing={2}>01 — Identity & Legal</Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={3}>
                  <Stack alignItems="center" spacing={1}>
                    <Avatar src={identity.studentPhoto} variant="rounded"
                      sx={{ width: 90, height: 110, bgcolor: C.accentBg, border: `1px solid ${C.border}` }} />
                    {!isReadOnly && (
                      <Button variant="text" component="label" size="small"
                        sx={{ fontSize: "0.62rem", color: C.accent, textTransform: "none" }}>
                        Upload Photo
                        <input hidden accept="image/*" type="file" onChange={(e) => handleImageUpload(e, "identity", "studentPhoto")} />
                      </Button>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={9}>
                  <Grid container spacing={2}>
                    {[
                      { label: "Full Legal Name", key: "fullName", xs: 12, md: 6 },
                      { label: "Blood Group",     key: "bloodGroup", xs: 6, md: 3 },
                      { label: "Admission No",    key: "admissionNo", xs: 6, md: 3 },
                      { label: "Reg No",          key: "regNo", xs: 12, md: 6 },
                      { label: "Phone Number",    key: "phoneNumber", xs: 12, md: 6 },
                    ].map((f) => (
                      <Grid item xs={f.xs} md={f.md} key={f.key}>
                        <TextField fullWidth label={f.label} value={identity[f.key]}
                          inputProps={{ readOnly: isReadOnly }}
                          onChange={(e) => !isReadOnly && setIdentity({ ...identity, [f.key]: e.target.value })}
                          sx={inputSx(isReadOnly)} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Aadhaar No" value={identity.aadhaarNo} inputProps={{ readOnly: isReadOnly }}
                    onChange={(e) => !isReadOnly && setIdentity({ ...identity, aadhaarNo: e.target.value })} sx={inputSx(isReadOnly)} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="License No" value={identity.licenseNo} inputProps={{ readOnly: isReadOnly }}
                    onChange={(e) => !isReadOnly && setIdentity({ ...identity, licenseNo: e.target.value })} sx={inputSx(isReadOnly)} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="DOB" type="date" InputLabelProps={{ shrink: true }}
                    value={identity.dob} inputProps={{ readOnly: isReadOnly }}
                    onChange={(e) => !isReadOnly && setIdentity({ ...identity, dob: e.target.value })} sx={inputSx(isReadOnly)} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={2} label="Permanent Address" value={identity.permanentAddress}
                    inputProps={{ readOnly: isReadOnly }}
                    onChange={(e) => !isReadOnly && setIdentity({ ...identity, permanentAddress: e.target.value })} sx={inputSx(isReadOnly)} />
                </Grid>
              </Grid>
            </Paper>

            {/* 02 GUARDIANS */}
            <Paper sx={{ ...card, p: 3 }}>
              <Typography variant="overline" color={C.accent} fontWeight={900} letterSpacing={2}>02 — Guardian Dossier</Typography>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {[
                  { prefix: "father", title: "Father", photoKey: "fatherPhoto", fields: [
                    { label: "Father's Name", key: "fatherName" }, { label: "Occupation", key: "fatherOccupation" },
                    { label: "Father's Aadhaar", key: "fatherAadhaar" }, { label: "Father's License", key: "fatherLicense" },
                    { label: "Annual Income", key: "fatherAnnualIncome" },
                  ]},
                  { prefix: "mother", title: "Mother", photoKey: "motherPhoto", fields: [
                    { label: "Mother's Name", key: "motherName" }, { label: "Occupation", key: "motherOccupation" },
                    { label: "Mother's Aadhaar", key: "motherAadhaar" }, { label: "Mother's License", key: "motherLicense" },
                    { label: "Annual Income", key: "motherAnnualIncome" },
                  ]},
                ].map(({ title, photoKey, fields }) => (
                  <Grid item xs={12} md={6} key={title}>
                    <Typography variant="subtitle2" fontWeight={700} color={C.dark} mb={2}>{title}</Typography>
                    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <Avatar src={guardians[photoKey]} variant="rounded" sx={{ width: 65, height: 80, bgcolor: C.accentBg, border: `1px solid ${C.border}` }} />
                        {!isReadOnly && (
                          <Button variant="text" component="label" size="small" sx={{ fontSize: "0.55rem", p: 0, color: C.accent }}>
                            Upload<input hidden accept="image/*" type="file" onChange={(e) => handleImageUpload(e, "guardians", photoKey)} />
                          </Button>
                        )}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        {fields.map((f) => (
                          <TextField key={f.key} fullWidth label={f.label} value={guardians[f.key]}
                            inputProps={{ readOnly: isReadOnly }}
                            onChange={(e) => !isReadOnly && setGuardians({ ...guardians, [f.key]: e.target.value })}
                            sx={inputSx(isReadOnly)} />
                        ))}
                      </Box>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* 03 + 04 */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {/* Schooling */}
              <Paper sx={{ ...card, flex: "1 1 45%", p: 3 }}>
                <Typography variant="overline" color={C.accent} fontWeight={900} letterSpacing={2}>03 — Schooling</Typography>
                <Stack spacing={0} sx={{ mt: 1 }}>
                  {[
                    { label: "High School (10th)", key: "highSchoolName" },
                    { label: "10th Percentage", key: "highSchoolPercentage" },
                    { label: "Higher Secondary (12th)", key: "higherSecondaryName" },
                    { label: "12th Percentage", key: "higherSecondaryPercentage" },
                  ].map((f) => (
                    <TextField key={f.key} fullWidth label={f.label} value={schooling[f.key]}
                      inputProps={{ readOnly: isReadOnly }}
                      onChange={(e) => !isReadOnly && setSchooling({ ...schooling, [f.key]: e.target.value })}
                      sx={inputSx(isReadOnly)} />
                  ))}
                </Stack>
              </Paper>

              {/* Skills */}
              <Paper sx={{ ...card, flex: "1 1 45%", p: 3 }}>
                <Typography variant="overline" color={C.accent} fontWeight={900} letterSpacing={2}>04 — Professional Assets</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, my: 1.5 }}>
                  {skills.map((skill) => (
                    <Chip key={skill} label={skill} size="small"
                      onDelete={isReadOnly ? undefined : () => removeSkill(skill)}
                      sx={{ bgcolor: C.accentBg, color: C.accent, border: `1px solid ${C.border}`, borderRadius: "6px",
                        "& .MuiChip-deleteIcon": { color: C.accent } }} />
                  ))}
                  {skills.length === 0 && <Typography variant="caption" color={C.textDim} fontStyle="italic">No skills added</Typography>}
                </Box>
                {!isReadOnly && (
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <TextField fullWidth label="Add Skill" value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSkill()}
                      sx={{ ...inputSx(false), mb: 0 }} />
                    <Button variant="outlined" onClick={addSkill}
                      sx={{ borderColor: C.accent, color: C.accent, borderRadius: "10px", minWidth: 48, mb: 2, textTransform: "none" }}>+</Button>
                  </Stack>
                )}
                <TextField fullWidth label="Achievement" value={newAchievement} inputProps={{ readOnly: isReadOnly }}
                  onChange={(e) => !isReadOnly && setNewAchievement(e.target.value)} sx={inputSx(isReadOnly)} />
                <TextField fullWidth label="Certification Link" value={certificationLink} inputProps={{ readOnly: isReadOnly }}
                  onChange={(e) => !isReadOnly && setCertificationLink(e.target.value)} sx={inputSx(isReadOnly)} />
              </Paper>
            </Box>
          </Box>

          {/* Right Column — Academic Ledger */}
          <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 33%" } }}>
            <Paper sx={{ ...card, p: 3, height: "100%", overflowY: "auto", maxHeight: "160vh" }}>
              <Typography variant="overline" color={C.accent} fontWeight={900} letterSpacing={2}>
                05 — Academic Ledger (Sem 1–8)
              </Typography>

              <Stack spacing={3} sx={{ mt: 2 }}>
                {semesters.map((sem, si) => (
                  <Box key={sem.id} sx={{ border: `1px solid ${C.border}`, borderRadius: "12px", p: 2, bgcolor: C.accentBg }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                      <Typography variant="caption" fontWeight={900} color={C.accent}>
                        Semester {sem.id}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="caption" color={C.textDim} fontWeight={600}>GPA:</Typography>
                        <TextField placeholder="GPA" size="small" value={sem.gpa}
                          inputProps={{ readOnly: isReadOnly }}
                          onChange={(e) => !isReadOnly && updateGpa(si, e.target.value)}
                          sx={{ width: "70px", "& .MuiInputBase-input": { p: 0.5, textAlign: "center", fontSize: "0.75rem", color: C.dark, fontWeight: 700 },
                            "& .MuiOutlinedInput-root": { borderRadius: "8px", "& fieldset": { borderColor: C.border } } }} />
                      </Stack>
                    </Stack>

                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          {sem.subjects.map((sub, subi) => (
                            <TableRow key={subi}>
                              <TableCell sx={{ border: "none", p: 0.4 }}>
                                <TextField variant="standard" placeholder="Code" value={sub.code}
                                  inputProps={{ readOnly: isReadOnly }}
                                  onChange={(e) => !isReadOnly && updateSubject(si, subi, "code", e.target.value)}
                                  InputProps={{ disableUnderline: true, style: { color: C.textDim, fontSize: "0.65rem" } }} />
                              </TableCell>
                              <TableCell sx={{ border: "none", p: 0.4 }}>
                                <TextField variant="standard" placeholder="Subject Name" value={sub.name}
                                  inputProps={{ readOnly: isReadOnly }}
                                  onChange={(e) => !isReadOnly && updateSubject(si, subi, "name", e.target.value)}
                                  InputProps={{ disableUnderline: true, style: { color: C.dark, fontSize: "0.65rem" } }} />
                              </TableCell>
                              <TableCell sx={{ border: "none", p: 0.4 }} align="right">
                                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
                                  <TextField variant="standard" placeholder="Marks" value={sub.marks}
                                    inputProps={{ readOnly: isReadOnly }}
                                    onChange={(e) => !isReadOnly && updateSubject(si, subi, "marks", e.target.value)}
                                    InputProps={{ disableUnderline: true, style: { color: C.accent, fontWeight: 900, fontSize: "0.65rem" } }}
                                    sx={{ width: 48 }} />
                                  {!isReadOnly && sem.subjects.length > 1 && (
                                    <IconButton size="small" onClick={() => removeSubject(si, subi)}
                                      sx={{ color: C.danger, p: 0.25 }}>
                                      <DeleteOutlineIcon sx={{ fontSize: "0.8rem" }} />
                                    </IconButton>
                                  )}
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {!isReadOnly && (
                      <Button size="small" startIcon={<AddCircleOutlineIcon sx={{ fontSize: "0.8rem" }} />}
                        onClick={() => addSubject(si)}
                        sx={{ color: C.textDim, fontSize: "0.65rem", mt: 1, textTransform: "none" }}>
                        Add Subject
                      </Button>
                    )}
                  </Box>
                ))}

                {!isReadOnly && semesters.length < 8 && (
                  <Button fullWidth variant="outlined" onClick={addSemester}
                    sx={{ borderStyle: "dashed", borderColor: C.accent, color: C.accent, borderRadius: "12px", textTransform: "none", fontWeight: 700 }}>
                    + Add Semester {semesters.length + 1}
                  </Button>
                )}
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: C.danger }}>
          <WarningIcon /> Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>This will permanently delete your entire student history record. This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3, gap: 1 }}>
          <Button onClick={() => setDeleteDialog(false)} variant="outlined"
            sx={{ borderColor: C.border, color: C.textDim, borderRadius: "10px", textTransform: "none" }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained"
            sx={{ bgcolor: C.danger, borderRadius: "10px", textTransform: "none", fontWeight: 700,
              "&:hover": { bgcolor: "#b71c1c" } }}>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentHistory;