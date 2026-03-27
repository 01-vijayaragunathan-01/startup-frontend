import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // ADD navigate
import {
  Box, Container, Typography, TextField, Button, Paper,
  Divider, Stack, Table, TableBody, TableCell,
  TableContainer, TableRow, Chip, IconButton,
  CircularProgress, Tooltip, Avatar, Grid
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "https://startup-backend-1-cj33.onrender.com";

const defaultSemester = (id) => ({
  id,
  semesterNumber: id,
  gpa: "",
  subjects: [{ code: "", name: "", marks: "" }],
});

const StudentHistory = () => {
  const navigate = useNavigate(); // ADD
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isMentor = currentUser?.role === "mentor";

  const authHeaders = { Authorization: `Bearer ${token}` };

  const [identity, setIdentity] = useState({
    fullName: "", regNo: "", phoneNumber: "", dob: "", department: "",
    permanentAddress: "", bloodGroup: "", aadhaarNo: "",
    admissionNo: "", licenseNo: "", studentPhoto: ""
  });

  const [guardians, setGuardians] = useState({
    fatherName: "", fatherOccupation: "", motherName: "", motherOccupation: "",
    fatherPhoto: "", motherPhoto: "", fatherAadhaar: "", motherAadhaar: "",
    fatherLicense: "", motherLicense: "", fatherAnnualIncome: "", motherAnnualIncome: ""
  });

  const [schooling, setSchooling] = useState({
    highSchoolName: "", highSchoolPercentage: "",
    higherSecondaryName: "", higherSecondaryPercentage: "",
  });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [certificationLink, setCertificationLink] = useState("");
  const [semesters, setSemesters] = useState([defaultSemester(1)]);

  const [isNew, setIsNew] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const hydrateForm = (data) => {
    setIdentity({
      fullName: data.fullName || "",
      regNo: data.regNo || "",
      phoneNumber: data.phoneNumber || "",
      dob: data.dob ? data.dob.slice(0, 10) : "",
      department: data.department || "",
      permanentAddress: data.permanentAddress || "",
      bloodGroup: data.bloodGroup || "",
      aadhaarNo: data.aadhaarNo || "",
      admissionNo: data.admissionNo || "",
      licenseNo: data.licenseNo || "",
      studentPhoto: data.studentPhoto || "",
    });
    setGuardians({
      fatherName: data.guardians?.fatherName || "",
      fatherOccupation: data.guardians?.fatherOccupation || "",
      motherName: data.guardians?.motherName || "",
      motherOccupation: data.guardians?.motherOccupation || "",
      fatherPhoto: data.guardians?.fatherPhoto || "",
      motherPhoto: data.guardians?.motherPhoto || "",
      fatherAadhaar: data.guardians?.fatherAadhaar || "",
      motherAadhaar: data.guardians?.motherAadhaar || "",
      fatherLicense: data.guardians?.fatherLicense || "",
      motherLicense: data.guardians?.motherLicense || "",
      fatherAnnualIncome: data.guardians?.fatherAnnualIncome || "",
      motherAnnualIncome: data.guardians?.motherAnnualIncome || "",
    });
    setSchooling({
      highSchoolName: data.schooling?.highSchoolName || "",
      highSchoolPercentage: data.schooling?.highSchoolPercentage || "",
      higherSecondaryName: data.schooling?.higherSecondaryName || "",
      higherSecondaryPercentage: data.schooling?.higherSecondaryPercentage || "",
    });
    setSkills(data.skills || []);
    setNewAchievement(data.newAchievement || "");
    setCertificationLink(data.certificationLink || "");

    if (data.semesters?.length) {
      setSemesters(
        data.semesters.map((s) => ({
          id: s.semesterNumber,
          semesterNumber: s.semesterNumber,
          gpa: s.gpa || "",
          subjects: s.subjects?.length
            ? s.subjects
            : [{ code: "", name: "", marks: "" }],
        }))
      );
    }
  };

  const handleImageUpload = (e, section, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (section === "identity") {
          setIdentity({ ...identity, [field]: reader.result });
        } else {
          setGuardians({ ...guardians, [field]: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const loadRecord = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/student-history`,
        { headers: authHeaders }
      );
      hydrateForm(data.data);
      setIsNew(false);
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setIsNew(true);
      } else {
        toast.error(err.response?.data?.message || "Failed to load history.");
        setIsNew(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRecord(); }, [loadRecord]);

  const buildPayload = () => ({
    ...identity,
    guardians,
    schooling,
    skills,
    newAchievement,
    certificationLink,
    semesters: semesters.map((s) => ({
      semesterNumber: s.semesterNumber || s.id,
      gpa: s.gpa,
      subjects: s.subjects,
    })),
  });

  const handleSync = async () => {
    setSaving(true);
    try {
      const payload = buildPayload();
      let responseData;

      if (isNew) {
        const res = await axios.post(
          `${BASE_URL}/api/student-history`,
          payload,
          { headers: authHeaders }
        );
        responseData = res.data.data;
        setIsNew(false);
        toast.success("History record created!");
      } else {
        const res = await axios.put(
          `${BASE_URL}/api/student-history`,
          payload,
          { headers: authHeaders }
        );
        responseData = res.data.data;
        toast.success("Ledger synced successfully!");
      }

      if (responseData) hydrateForm(responseData);
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
      if (err.response?.status === 409) {
        setIsNew(false);
        toast.error("Record exists — retrying as update…");
        setSaving(false);
        handleSync();
        return;
      }
      toast.error(err.response?.data?.message || "Failed to sync ledger.");
    } finally {
      setSaving(false);
    }
  };

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

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };
  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const colors = {
    bg: "#030014",
    accent: "#7000ff",
    glass: "rgba(255, 255, 255, 0.02)",
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
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" },
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

  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: "100vh", py: 10, color: "#fff" }}>
      <Container maxWidth="xl">

        {/* TOP BAR */}
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
              {saving ? "SYNCING…" : isNew ? "CREATE RECORD" : "SYNC_LEDGER"}
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>

          {/* ── LEFT ──────────────────────────────────────────────────────── */}
          <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 65%" }, display: "flex", flexDirection: "column", gap: 3 }}>

            {/* 01 IDENTITY */}
            <Paper sx={{ p: 3, bgcolor: colors.glass, border: `1px solid ${colors.border}`, borderRadius: 0 }}>
              <Typography variant="overline" color={colors.accent} fontWeight={900}>01 // IDENTITY & LEGAL</Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>

                {/* Student Photo Section */}
                <Grid item xs={12} sm={3}>
                  <Stack alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Avatar
                      src={identity.studentPhoto}
                      variant="rounded"
                      sx={{ width: 85, height: 100, bgcolor: "rgba(255,255,255,0.05)", border: `1px solid ${colors.border}` }}
                    />
                    <Button variant="text" component="label" sx={{ fontSize: '0.6rem', color: colors.accent }}>
                      Upload Student Photo
                      <input hidden accept="image/*" type="file" onChange={(e) => handleImageUpload(e, "identity", "studentPhoto")} />
                    </Button>
                  </Stack>
                </Grid>

                {/* Identity Fields */}
                <Grid item xs={12} sm={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Full Legal Name" value={identity.fullName} onChange={(e) => setIdentity({ ...identity, fullName: e.target.value })} sx={inputStyles} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField fullWidth label="Blood Group" value={identity.bloodGroup} onChange={(e) => setIdentity({ ...identity, bloodGroup: e.target.value })} sx={inputStyles} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField fullWidth label="Admission No" value={identity.admissionNo} onChange={(e) => setIdentity({ ...identity, admissionNo: e.target.value })} sx={inputStyles} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Reg No" value={identity.regNo} onChange={(e) => setIdentity({ ...identity, regNo: e.target.value })} sx={inputStyles} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Phone Number" value={identity.phoneNumber} onChange={(e) => setIdentity({ ...identity, phoneNumber: e.target.value })} sx={inputStyles} />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Legal ID Row */}
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Aadhaar No" value={identity.aadhaarNo} onChange={(e) => setIdentity({ ...identity, aadhaarNo: e.target.value })} sx={inputStyles} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="License No" value={identity.licenseNo} onChange={(e) => setIdentity({ ...identity, licenseNo: e.target.value })} sx={inputStyles} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="DOB" type="date" InputLabelProps={{ shrink: true }} value={identity.dob} onChange={(e) => setIdentity({ ...identity, dob: e.target.value })} sx={inputStyles} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={2} label="Permanent Address" value={identity.permanentAddress} onChange={(e) => setIdentity({ ...identity, permanentAddress: e.target.value })} sx={inputStyles} />
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3, bgcolor: colors.glass, border: `1px solid ${colors.border}`, borderRadius: 0 }}>
              <Typography variant="overline" color={colors.accent} fontWeight={900}>02 // GUARDIAN DOSSIER</Typography>
              <Grid container spacing={3} sx={{ mt: 2 }}>

                {/* Father's Section */}
                <Grid item xs={12} md={6}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar src={guardians.fatherPhoto} variant="rounded" sx={{ width: 65, height: 80, mb: 1, bgcolor: "rgba(255,255,255,0.05)" }} />
                      <Button variant="text" component="label" sx={{ fontSize: '0.55rem', p: 0 }}>
                        Upload <input hidden accept="image/*" type="file" onChange={(e) => handleImageUpload(e, "guardians", "fatherPhoto")} />
                      </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <TextField fullWidth label="Father's Name" value={guardians.fatherName} onChange={(e) => setGuardians({ ...guardians, fatherName: e.target.value })} sx={inputStyles} />
                      <TextField fullWidth label="Father's Occupation" value={guardians.fatherOccupation} onChange={(e) => setGuardians({ ...guardians, fatherOccupation: e.target.value })} sx={inputStyles} />
                    </Box>
                  </Stack>
                  <TextField fullWidth label="Father's Aadhaar" value={guardians.fatherAadhaar} onChange={(e) => setGuardians({ ...guardians, fatherAadhaar: e.target.value })} sx={inputStyles} />
                  <TextField fullWidth label="Father's License" value={guardians.fatherLicense} onChange={(e) => setGuardians({ ...guardians, fatherLicense: e.target.value })} sx={inputStyles} />
                  <TextField fullWidth label="Father's Annual Income" value={guardians.fatherAnnualIncome} onChange={(e) => setGuardians({ ...guardians, fatherAnnualIncome: e.target.value })} sx={inputStyles} />
                </Grid>

                {/* Mother's Section */}
                <Grid item xs={12} md={6}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar src={guardians.motherPhoto} variant="rounded" sx={{ width: 65, height: 80, mb: 1, bgcolor: "rgba(255,255,255,0.05)" }} />
                      <Button variant="text" component="label" sx={{ fontSize: '0.55rem', p: 0 }}>
                        Upload <input hidden accept="image/*" type="file" onChange={(e) => handleImageUpload(e, "guardians", "motherPhoto")} />
                      </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <TextField fullWidth label="Mother's Name" value={guardians.motherName} onChange={(e) => setGuardians({ ...guardians, motherName: e.target.value })} sx={inputStyles} />
                      <TextField fullWidth label="Mother's Occupation" value={guardians.motherOccupation} onChange={(e) => setGuardians({ ...guardians, motherOccupation: e.target.value })} sx={inputStyles} />
                    </Box>
                  </Stack>
                  <TextField fullWidth label="Mother's Aadhaar" value={guardians.motherAadhaar} onChange={(e) => setGuardians({ ...guardians, motherAadhaar: e.target.value })} sx={inputStyles} />
                  <TextField fullWidth label="Mother's License" value={guardians.motherLicense} onChange={(e) => setGuardians({ ...guardians, motherLicense: e.target.value })} sx={inputStyles} />
                  <TextField fullWidth label="Mother's Annual Income" value={guardians.motherAnnualIncome} onChange={(e) => setGuardians({ ...guardians, motherAnnualIncome: e.target.value })} sx={inputStyles} />
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {/* 03 SCHOOLING */}
              <Paper sx={{ flex: "1 1 45%", p: 3, bgcolor: colors.glass, border: `1px solid ${colors.border}`, borderRadius: 0 }}>
                <Typography variant="overline" color={colors.accent} fontWeight={900}>03 // SCHOOLING</Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <TextField fullWidth label="High School (10th)" placeholder="School Name"
                    value={schooling.highSchoolName}
                    onChange={(e) => setSchooling({ ...schooling, highSchoolName: e.target.value })}
                    sx={inputStyles} />
                  <TextField fullWidth label="10th Percentage"
                    value={schooling.highSchoolPercentage}
                    onChange={(e) => setSchooling({ ...schooling, highSchoolPercentage: e.target.value })}
                    sx={inputStyles} />
                  <TextField fullWidth label="Higher Secondary (12th)" placeholder="School Name"
                    value={schooling.higherSecondaryName}
                    onChange={(e) => setSchooling({ ...schooling, higherSecondaryName: e.target.value })}
                    sx={inputStyles} />
                  <TextField fullWidth label="12th Percentage"
                    value={schooling.higherSecondaryPercentage}
                    onChange={(e) => setSchooling({ ...schooling, higherSecondaryPercentage: e.target.value })}
                    sx={inputStyles} />
                </Stack>
              </Paper>

              {/* 04 PROFESSIONAL ASSETS */}
              <Paper sx={{ flex: "1 1 45%", p: 3, bgcolor: colors.glass, border: `1px solid ${colors.border}`, borderRadius: 0 }}>
                <Typography variant="overline" color={colors.accent} fontWeight={900}>04 // PROFESSIONAL_ASSETS</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 1.5 }}>
                  {skills.map((skill) => (
                    <Chip key={skill} label={skill} size="small"
                      onDelete={() => removeSkill(skill)}
                      sx={{
                        bgcolor: "rgba(112,0,255,0.1)", color: colors.accent,
                        border: `1px solid ${colors.accent}`, borderRadius: 0,
                        "& .MuiChip-deleteIcon": { color: colors.accent },
                      }} />
                  ))}
                </Box>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField fullWidth label="Add Skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    sx={{ ...inputStyles, mb: 0 }} />
                  <Button variant="outlined" onClick={addSkill}
                    sx={{ borderColor: colors.accent, color: colors.accent, borderRadius: 0, minWidth: 48, mb: 2 }}>
                    +
                  </Button>
                </Stack>
                <TextField fullWidth label="New Achievement"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  sx={inputStyles} />
                <TextField fullWidth label="Certification Link"
                  value={certificationLink}
                  onChange={(e) => setCertificationLink(e.target.value)}
                  sx={inputStyles} />
              </Paper>
            </Box>
          </Box>

          {/* ── RIGHT: Academic Ledger ─────────────────────────────────────── */}
          <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 32%" } }}>
            <Paper sx={{
              p: 3, bgcolor: colors.glass, border: `1px solid ${colors.border}`,
              borderRadius: 0, height: "100%", overflowY: "auto", maxHeight: "150vh"
            }}>
              <Typography variant="overline" color={colors.accent} fontWeight={900}>
                05 // ACADEMIC_LEDGER (SEM 1-8)
              </Typography>

              <Stack spacing={4} sx={{ mt: 2 }}>
                {semesters.map((sem, semIndex) => (
                  <Box key={sem.id} sx={{ border: `1px solid ${colors.border}`, p: 2, bgcolor: "rgba(255,255,255,0.01)" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 900, color: colors.accent }}>
                        SEMESTER_0{sem.id}
                      </Typography>
                      <TextField placeholder="GPA" size="small"
                        value={sem.gpa}
                        onChange={(e) => updateGpa(semIndex, e.target.value)}
                        sx={{ width: "80px", "& .MuiInputBase-input": { p: 0.5, textAlign: "center", fontSize: "0.7rem", color: "#fff" } }} />
                    </Stack>

                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          {sem.subjects.map((sub, subIndex) => (
                            <TableRow key={subIndex}>
                              <TableCell sx={{ border: "none", p: 0.5 }}>
                                <TextField variant="standard" placeholder="Code"
                                  value={sub.code}
                                  onChange={(e) => updateSubject(semIndex, subIndex, "code", e.target.value)}
                                  InputProps={{ disableUnderline: true, style: { color: "rgba(255,255,255,0.5)", fontSize: "0.65rem" } }} />
                              </TableCell>
                              <TableCell sx={{ border: "none", p: 0.5 }}>
                                <TextField variant="standard" placeholder="Subject"
                                  value={sub.name}
                                  onChange={(e) => updateSubject(semIndex, subIndex, "name", e.target.value)}
                                  InputProps={{ disableUnderline: true, style: { color: "#fff", fontSize: "0.65rem" } }} />
                              </TableCell>
                              <TableCell sx={{ border: "none", p: 0.5 }} align="right">
                                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
                                  <TextField variant="standard" placeholder="Marks"
                                    value={sub.marks}
                                    onChange={(e) => updateSubject(semIndex, subIndex, "marks", e.target.value)}
                                    InputProps={{ disableUnderline: true, style: { color: colors.accent, fontWeight: 900, fontSize: "0.65rem" } }}
                                    sx={{ width: 48 }} />
                                  {sem.subjects.length > 1 && (
                                    <IconButton size="small"
                                      onClick={() => removeSubject(semIndex, subIndex)}
                                      sx={{ color: "rgba(255,0,0,0.4)", p: 0.25 }}>
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

                    <Button size="small"
                      startIcon={<AddCircleOutlineIcon sx={{ fontSize: "0.8rem" }} />}
                      onClick={() => addSubject(semIndex)}
                      sx={{ color: "rgba(255,255,255,0.3)", fontSize: "0.6rem", mt: 1 }}>
                      ADD_SUBJECT
                    </Button>
                  </Box>
                ))}

                {semesters.length < 8 && (
                  <Button fullWidth variant="outlined" onClick={addSemester}
                    sx={{ borderStyle: "dashed", color: colors.accent, borderColor: colors.accent }}>
                    + INITIALIZE SEMESTER {semesters.length + 1}
                  </Button>
                )}
              </Stack>
            </Paper>
          </Box>

        </Box>
      </Container>
    </Box>
  );
};

export default StudentHistory;