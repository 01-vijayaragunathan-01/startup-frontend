import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Container, Typography, TextField, Button, Paper,
  Divider, Stack, Table, TableBody, TableCell,
  TableContainer, TableRow, Chip, IconButton, Snackbar, Alert,
  CircularProgress, Tooltip
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

// ─── API helper ───────────────────────────────────────────────────────────────
// Reads the JWT that your auth flow stores in localStorage
const API_BASE = "/api/student-history";

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token"); // adjust key if yours differs
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ─── Defaults ─────────────────────────────────────────────────────────────────
const defaultSemester = (id) => ({
  id,
  semesterNumber: id,
  gpa: "",
  subjects: [{ code: "", name: "", marks: "" }],
});

// ─── Component ────────────────────────────────────────────────────────────────
const StudentHistory = () => {
  // Detect role from the stored user object (set during login)
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isMentor = currentUser?.role === "mentor";

  // Form state
  const [identity, setIdentity] = useState({
    fullName: "",
    regNo: "",
    phoneNumber: "",
    dob: "",
    department: "",
    permanentAddress: "",
  });

  const [guardians, setGuardians] = useState({
    fatherName: "",
    fatherOccupation: "",
    motherName: "",
    motherOccupation: "",
  });

  const [schooling, setSchooling] = useState({
    highSchoolName: "",
    highSchoolPercentage: "",
    higherSecondaryName: "",
    higherSecondaryPercentage: "",
  });

  const [skills, setSkills] = useState(["React.js", "Node.js", "MERN"]);
  const [newSkill, setNewSkill] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [certificationLink, setCertificationLink] = useState("");

  const [semesters, setSemesters] = useState([defaultSemester(1)]);

  // UI state
  const [isNew, setIsNew]         = useState(true);   // false once record exists
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState({ open: false, message: "", severity: "success" });

  // ─── Load existing record on mount ─────────────────────────────────────────
  const loadRecord = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await authFetch(API_BASE);
      hydrateForm(data);
      setIsNew(false);
    } catch (err) {
      // 404 means no record yet – stay in "create" mode
      if (!err.message.includes("No history record")) {
        showToast(err.message, "error");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRecord(); }, [loadRecord]);

  // ─── Hydrate all form fields from API response ──────────────────────────────
  const hydrateForm = (data) => {
    setIdentity({
      fullName:         data.fullName         || "",
      regNo:            data.regNo            || "",
      phoneNumber:      data.phoneNumber      || "",
      dob:              data.dob ? data.dob.slice(0, 10) : "",
      department:       data.department       || "",
      permanentAddress: data.permanentAddress || "",
    });
    setGuardians(data.guardians || {
      fatherName: "", fatherOccupation: "", motherName: "", motherOccupation: ""
    });
    setSchooling(data.schooling || {
      highSchoolName: "", highSchoolPercentage: "",
      higherSecondaryName: "", higherSecondaryPercentage: ""
    });
    setSkills(data.skills || []);
    setNewAchievement(data.newAchievement || "");
    setCertificationLink(data.certificationLink || "");

    if (data.semesters?.length) {
      setSemesters(
        data.semesters.map((s) => ({
          id:             s.semesterNumber,
          semesterNumber: s.semesterNumber,
          gpa:            s.gpa || "",
          subjects:       s.subjects?.length
            ? s.subjects
            : [{ code: "", name: "", marks: "" }],
        }))
      );
    }
  };

  // ─── Collect all form data into API shape ───────────────────────────────────
  const buildPayload = () => ({
    ...identity,
    guardians,
    schooling,
    skills,
    newAchievement,
    certificationLink,
    semesters: semesters.map((s) => ({
      semesterNumber: s.semesterNumber || s.id,
      gpa:            s.gpa,
      subjects:       s.subjects,
    })),
  });

  // ─── Save (create or update) ────────────────────────────────────────────────
  const handleSync = async () => {
    setSaving(true);
    try {
      const payload = buildPayload();
      const method  = isNew ? "POST" : "PUT";

      const { data } = await authFetch(API_BASE, {
        method,
        body: JSON.stringify(payload),
      });

      hydrateForm(data);
      setIsNew(false);
      showToast("Ledger synced successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // ─── Semester helpers ───────────────────────────────────────────────────────
  const addSemester = () => {
    if (semesters.length < 8) {
      const nextId = semesters.length + 1;
      setSemesters([...semesters, defaultSemester(nextId)]);
    }
  };

  const addSubject = (semIndex) => {
    const updated = [...semesters];
    updated[semIndex].subjects.push({ code: "", name: "", marks: "" });
    setSemesters(updated);
  };

  const updateSubject = (semIndex, subIndex, field, value) => {
    const updated = [...semesters];
    updated[semIndex].subjects[subIndex][field] = value;
    setSemesters(updated);
  };

  const updateGpa = (semIndex, value) => {
    const updated = [...semesters];
    updated[semIndex].gpa = value;
    setSemesters(updated);
  };

  const removeSubject = (semIndex, subIndex) => {
    const updated = [...semesters];
    updated[semIndex].subjects.splice(subIndex, 1);
    setSemesters(updated);
  };

  // ─── Skill helpers ──────────────────────────────────────────────────────────
  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  // ─── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  // ─── Styles ─────────────────────────────────────────────────────────────────
  const colors = {
    bg:     "#030014",
    accent: "#7000ff",
    glass:  "rgba(255, 255, 255, 0.02)",
    border: "rgba(255, 255, 255, 0.08)",
  };

  const inputStyles = {
    mb: 2,
    "& .MuiInputBase-root": {
      color: "#ffffff",
      backgroundColor: "rgba(255,255,255,0.01)",
      fontSize: "0.8rem",
      borderRadius: "4px",
    },
    "& .MuiInputLabel-root":              { color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.border },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.accent },
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: colors.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: colors.accent }} />
      </Box>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: "100vh", py: 10, color: "#fff" }}>
      <Container maxWidth="xl">

        {/* TOP SYSTEM BAR */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={900} letterSpacing="-0.02em">
              Student History
            </Typography>
            <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 800, letterSpacing: 2 }}>
              SRM UNIVERSITY TRICHY {isMentor && "· MENTOR VIEW"}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Tooltip title="Reload from server">
              <IconButton onClick={loadRecord} sx={{ color: "rgba(255,255,255,0.4)" }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon />}
              onClick={handleSync}
              disabled={saving}
              sx={{ bgcolor: colors.accent, px: 4, borderRadius: 0, fontWeight: 900 }}
            >
              {saving ? "SYNCING…" : "SYNC_LEDGER"}
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>

          {/* ── LEFT SIDE ─────────────────────────────────────────────────── */}
          <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 65%" }, display: "flex", flexDirection: "column", gap: 3 }}>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>

              {/* 01 // IDENTITY */}
              <Paper sx={{ flex: "1 1 45%", p: 3, bgcolor: colors.glass, border: `1px solid ${colors.border}`, borderRadius: 0 }}>
                <Typography variant="overline" color={colors.accent} fontWeight={900}>01 // IDENTITY</Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth label="Full Legal Name"
                    value={identity.fullName}
                    onChange={(e) => setIdentity({ ...identity, fullName: e.target.value })}
                    sx={inputStyles}
                  />
                  <Stack direction="row" spacing={2}>
                    <TextField
                      fullWidth label="Reg No"
                      value={identity.regNo}
                      onChange={(e) => setIdentity({ ...identity, regNo: e.target.value })}
                      sx={inputStyles}
                    />
                    <TextField
                      fullWidth label="Phone Number" placeholder="+91 XXX-XXX-XXXX"
                      value={identity.phoneNumber}
                      onChange={(e) => setIdentity({ ...identity, phoneNumber: e.target.value })}
                      sx={inputStyles}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      fullWidth label="DOB" type="date"
                      InputLabelProps={{ shrink: true }}
                      value={identity.dob}
                      onChange={(e) => setIdentity({ ...identity, dob: e.target.value })}
                      sx={inputStyles}
                    />
                    <TextField
                      fullWidth label="Department"
                      value={identity.department}
                      onChange={(e) => setIdentity({ ...identity, department: e.target.value })}
                      sx={inputStyles}
                    />
                  </Stack>
                  <TextField
                    fullWidth multiline rows={2} label="Permanent Address"
                    value={identity.permanentAddress}
                    onChange={(e) => setIdentity({ ...identity, permanentAddress: e.target.value })}
                    sx={inputStyles}
                  />
                </Stack>
              </Paper>

              {/* 02 // GUARDIANS */}
              <Paper sx={{ flex: "1 1 45%", p: 3, bgcolor: colors.glass, border: `1px solid ${colors.border}`, borderRadius: 0 }}>
                <Typography variant="overline" color={colors.accent} fontWeight={900}>02 // GUARDIANS</Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth label="Father's Name"
                    value={guardians.fatherName}
                    onChange={(e) => setGuardians({ ...guardians, fatherName: e.target.value })}
                    sx={inputStyles}
                  />
                  <TextField
                    fullWidth label="Father's Occupation"
                    value={guardians.fatherOccupation}
                    onChange={(e) => setGuardians({ ...guardians, fatherOccupation: e.target.value })}
                    sx={inputStyles}
                  />
                  <Divider sx={{ my: 1, borderColor: colors.border }} />
                  <TextField
                    fullWidth label="Mother's Name"
                    value={guardians.motherName}
                    onChange={(e) => setGuardians({ ...guardians, motherName: e.target.value })}
                    sx={inputStyles}
                  />
                  <TextField
                    fullWidth label="Mother's Occupation"
                    value={guardians.motherOccupation}
                    onChange={(e) => setGuardians({ ...guardians, motherOccupation: e.target.value })}
                    sx={inputStyles}
                  />
                </Stack>
              </Paper>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>

              {/* 03 // SCHOOLING */}
              <Paper sx={{ flex: "1 1 45%", p: 3, bgcolor: colors.glass, border: `1px solid ${colors.border}`, borderRadius: 0 }}>
                <Typography variant="overline" color={colors.accent} fontWeight={900}>03 // SCHOOLING</Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth label="High School (10th)" placeholder="School Name"
                    value={schooling.highSchoolName}
                    onChange={(e) => setSchooling({ ...schooling, highSchoolName: e.target.value })}
                    sx={inputStyles}
                  />
                  <TextField
                    fullWidth label="10th Percentage"
                    value={schooling.highSchoolPercentage}
                    onChange={(e) => setSchooling({ ...schooling, highSchoolPercentage: e.target.value })}
                    sx={inputStyles}
                  />
                  <TextField
                    fullWidth label="Higher Secondary (12th)" placeholder="School Name"
                    value={schooling.higherSecondaryName}
                    onChange={(e) => setSchooling({ ...schooling, higherSecondaryName: e.target.value })}
                    sx={inputStyles}
                  />
                  <TextField
                    fullWidth label="12th Percentage"
                    value={schooling.higherSecondaryPercentage}
                    onChange={(e) => setSchooling({ ...schooling, higherSecondaryPercentage: e.target.value })}
                    sx={inputStyles}
                  />
                </Stack>
              </Paper>

              {/* 04 // PROFESSIONAL ASSETS */}
              <Paper sx={{ flex: "1 1 45%", p: 3, bgcolor: colors.glass, border: `1px solid ${colors.border}`, borderRadius: 0 }}>
                <Typography variant="overline" color={colors.accent} fontWeight={900}>04 // PROFESSIONAL_ASSETS</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 1.5 }}>
                  {skills.map((skill) => (
                    <Chip
                      key={skill} label={skill} size="small"
                      onDelete={() => removeSkill(skill)}
                      sx={{
                        bgcolor: "rgba(112,0,255,0.1)",
                        color: colors.accent,
                        border: `1px solid ${colors.accent}`,
                        borderRadius: 0,
                        "& .MuiChip-deleteIcon": { color: colors.accent },
                      }}
                    />
                  ))}
                </Box>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth label="Add Skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    sx={{ ...inputStyles, mb: 0 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={addSkill}
                    sx={{ borderColor: colors.accent, color: colors.accent, borderRadius: 0, minWidth: 48, mb: 2 }}
                  >
                    +
                  </Button>
                </Stack>
                <TextField
                  fullWidth label="New Achievement"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  sx={inputStyles}
                />
                <TextField
                  fullWidth label="Certification Link"
                  value={certificationLink}
                  onChange={(e) => setCertificationLink(e.target.value)}
                  sx={inputStyles}
                />
              </Paper>
            </Box>
          </Box>

          {/* ── RIGHT SIDE: Academic Ledger ───────────────────────────────── */}
          <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 32%" } }}>
            <Paper sx={{
              p: 3, bgcolor: colors.glass, border: `1px solid ${colors.border}`,
              borderRadius: 0, height: "100%", overflowY: "auto", maxHeight: "85vh"
            }}>
              <Typography variant="overline" color={colors.accent} fontWeight={900}>
                05 // ACADEMIC_LEDGER (SEM 1-8)
              </Typography>

              <Stack spacing={4} sx={{ mt: 2 }}>
                {semesters.map((sem, semIndex) => (
                  <Box
                    key={sem.id}
                    sx={{ border: `1px solid ${colors.border}`, p: 2, bgcolor: "rgba(255,255,255,0.01)" }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 900, color: colors.accent }}>
                        SEMESTER_0{sem.id}
                      </Typography>
                      <TextField
                        placeholder="GPA" size="small"
                        sx={{ width: "80px", "& .MuiInputBase-input": { p: 0.5, textAlign: "center", fontSize: "0.7rem", color: "#fff" } }}
                        value={sem.gpa}
                        onChange={(e) => updateGpa(semIndex, e.target.value)}
                      />
                    </Stack>

                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          {sem.subjects.map((sub, subIndex) => (
                            <TableRow key={subIndex}>
                              <TableCell sx={{ border: "none", p: 0.5 }}>
                                <TextField
                                  variant="standard" placeholder="Code"
                                  value={sub.code}
                                  onChange={(e) => updateSubject(semIndex, subIndex, "code", e.target.value)}
                                  InputProps={{ disableUnderline: true, style: { color: "rgba(255,255,255,0.5)", fontSize: "0.65rem" } }}
                                />
                              </TableCell>
                              <TableCell sx={{ border: "none", p: 0.5 }}>
                                <TextField
                                  variant="standard" placeholder="Subject"
                                  value={sub.name}
                                  onChange={(e) => updateSubject(semIndex, subIndex, "name", e.target.value)}
                                  InputProps={{ disableUnderline: true, style: { color: "#fff", fontSize: "0.65rem" } }}
                                />
                              </TableCell>
                              <TableCell sx={{ border: "none", p: 0.5 }} align="right">
                                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
                                  <TextField
                                    variant="standard" placeholder="Marks"
                                    value={sub.marks}
                                    onChange={(e) => updateSubject(semIndex, subIndex, "marks", e.target.value)}
                                    InputProps={{ disableUnderline: true, style: { color: colors.accent, fontWeight: 900, fontSize: "0.65rem", textAlign: "right" } }}
                                    sx={{ width: 48 }}
                                  />
                                  {sem.subjects.length > 1 && (
                                    <IconButton
                                      size="small"
                                      onClick={() => removeSubject(semIndex, subIndex)}
                                      sx={{ color: "rgba(255,0,0,0.4)", p: 0.25 }}
                                    >
                                      <DeleteOutlineIcon sx={{ fontSize: "0.75rem" }} />
                                    </IconButton>
                                  )}
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Button
                      size="small"
                      startIcon={<AddCircleOutlineIcon sx={{ fontSize: "0.8rem" }} />}
                      onClick={() => addSubject(semIndex)}
                      sx={{ color: "rgba(255,255,255,0.3)", fontSize: "0.6rem", mt: 1 }}
                    >
                      ADD_SUBJECT
                    </Button>
                  </Box>
                ))}

                {semesters.length < 8 && (
                  <Button
                    fullWidth variant="outlined" onClick={addSemester}
                    sx={{ borderStyle: "dashed", color: colors.accent, borderColor: colors.accent }}
                  >
                    + INITIALIZE SEMESTER {semesters.length + 1}
                  </Button>
                )}
              </Stack>
            </Paper>
          </Box>

        </Box>
      </Container>

      {/* Toast notifications */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={closeToast} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={closeToast} severity={toast.severity} variant="filled" sx={{ borderRadius: 0, fontWeight: 700 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentHistory;