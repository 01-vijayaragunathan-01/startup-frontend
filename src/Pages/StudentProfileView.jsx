import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Paper, Grid, Avatar,
  Chip, Divider, Stack, Button, CircularProgress, IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "https://startup-backend-1-cj33.onrender.com";

const StudentProfileView = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isMentor = currentUser?.role === "mentor";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const colors = {
    bg:     "#030014",
    accent: "#7000ff",
    glass:  "rgba(255, 255, 255, 0.02)",
    border: "rgba(255, 255, 255, 0.08)",
    textDim: "rgba(255,255,255,0.6)",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // If studentId exists in URL → fetch that student (mentor view)
        // Otherwise → fetch own record (student view)
        const url = studentId
          ? `${BASE_URL}/api/student-history/${studentId}`
          : `${BASE_URL}/api/student-history`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data.data);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [studentId, token]);

  if (loading) {
    return (
      <Box sx={{ bgcolor: colors.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: colors.accent }} />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ bgcolor: colors.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h5" sx={{ color: colors.textDim }}>
          No dossier found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: "100vh", py: 10, color: "#fff" }}>
      <Container maxWidth="lg">

        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}
            sx={{ color: colors.textDim, fontWeight: 700 }}>
            BACK
          </Button>

          {/* Edit button — only shown to the student who owns the record */}
          {!isMentor && (
            <Button startIcon={<EditIcon />}
              onClick={() => navigate("/student-history")}
              sx={{ bgcolor: colors.accent, color: "#fff", borderRadius: 2, px: 3, fontWeight: 800 }}>
              EDIT RECORD
            </Button>
          )}
        </Stack>

        {/* Main Dossier Card */}
        <Paper sx={{
          p: { xs: 3, md: 5 },
          bgcolor: colors.glass,
          border: `1px solid ${colors.border}`,
          borderRadius: "24px",
          backdropFilter: "blur(16px)",
        }}>

          {/* ── Header Row: Photo + Name ──────────────────────────────────── */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
              <Avatar
                src={data.studentPhoto}
                variant="rounded"
                sx={{
                  width: 150, height: 180,
                  mx: "auto", mb: 2,
                  bgcolor: "rgba(255,255,255,0.05)",
                  border: `2px solid ${colors.border}`,
                }}
              />
              <Typography variant="h5" fontWeight={900} sx={{ mb: 0.5 }}>
                {data.fullName || "Unnamed"}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 800, letterSpacing: 2 }}>
                {data.regNo || "NO REG"}
              </Typography>
            </Grid>

            {/* Identity & Stats */}
            <Grid item xs={12} md={9}>
              <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 900, letterSpacing: 2 }}>
                PERSONAL IDENTITY
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6} md={4}>
                  <Typography variant="caption" sx={{ color: colors.textDim, fontSize: "0.65rem" }}>Blood Group</Typography>
                  <Typography fontWeight={700}>{data.bloodGroup || "—"}</Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="caption" sx={{ color: colors.textDim, fontSize: "0.65rem" }}>DOB</Typography>
                  <Typography fontWeight={700}>
                    {data.dob ? new Date(data.dob).toLocaleDateString() : "—"}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="caption" sx={{ color: colors.textDim, fontSize: "0.65rem" }}>Department</Typography>
                  <Typography fontWeight={700}>{data.department || "—"}</Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="caption" sx={{ color: colors.textDim, fontSize: "0.65rem" }}>Admission No</Typography>
                  <Typography fontWeight={700}>{data.admissionNo || "—"}</Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="caption" sx={{ color: colors.textDim, fontSize: "0.65rem" }}>Aadhaar</Typography>
                  <Typography fontWeight={700}>{data.aadhaarNo || "—"}</Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="caption" sx={{ color: colors.textDim, fontSize: "0.65rem" }}>License</Typography>
                  <Typography fontWeight={700}>{data.licenseNo || "—"}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: colors.textDim, fontSize: "0.65rem" }}>Address</Typography>
                  <Typography fontWeight={600} sx={{ fontSize: "0.85rem" }}>
                    {data.permanentAddress || "Not provided"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.06)" }} />

          {/* ── Guardian Dossier ──────────────────────────────────────────── */}
          <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 900, letterSpacing: 2, display: "block", mb: 3 }}>
            GUARDIAN DOSSIER
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar src={data.guardians?.fatherPhoto} variant="rounded" sx={{ width: 60, height: 75 }} />
                <Box>
                  <Typography fontWeight={800} fontSize="0.95rem">{data.guardians?.fatherName || "—"}</Typography>
                  <Typography variant="caption" sx={{ color: colors.textDim }}>{data.guardians?.fatherOccupation || "Occupation N/A"}</Typography>
                </Box>
              </Stack>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: colors.textDim, fontSize: "0.6rem" }}>Aadhaar</Typography>
                  <Typography fontSize="0.75rem">{data.guardians?.fatherAadhaar || "—"}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: colors.textDim, fontSize: "0.6rem" }}>Annual Income</Typography>
                  <Typography fontSize="0.75rem">{data.guardians?.fatherAnnualIncome || "—"}</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar src={data.guardians?.motherPhoto} variant="rounded" sx={{ width: 60, height: 75 }} />
                <Box>
                  <Typography fontWeight={800} fontSize="0.95rem">{data.guardians?.motherName || "—"}</Typography>
                  <Typography variant="caption" sx={{ color: colors.textDim }}>{data.guardians?.motherOccupation || "Occupation N/A"}</Typography>
                </Box>
              </Stack>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: colors.textDim, fontSize: "0.6rem" }}>Aadhaar</Typography>
                  <Typography fontSize="0.75rem">{data.guardians?.motherAadhaar || "—"}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: colors.textDim, fontSize: "0.6rem" }}>Annual Income</Typography>
                  <Typography fontSize="0.75rem">{data.guardians?.motherAnnualIncome || "—"}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.06)" }} />

          {/* ── Academic Standings ────────────────────────────────────────── */}
          <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 900, letterSpacing: 2, display: "block", mb: 2 }}>
            ACADEMIC STANDINGS
          </Typography>
          {data.semesters?.length > 0 ? (
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              {data.semesters.map((s) => (
                <Chip
                  key={s.semesterNumber}
                  label={`SEM ${s.semesterNumber}: ${s.gpa || "N/A"}`}
                  sx={{
                    color: "#fff",
                    borderColor: colors.accent,
                    bgcolor: "rgba(112,0,255,0.1)",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    mb: 1,
                  }}
                  variant="outlined"
                />
              ))}
            </Stack>
          ) : (
            <Typography sx={{ color: colors.textDim, fontStyle: "italic" }}>
              No semester data recorded.
            </Typography>
          )}

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.06)" }} />

          {/* ── Schooling ─────────────────────────────────────────────────── */}
          <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 900, letterSpacing: 2, display: "block", mb: 2 }}>
            SCHOOLING RECORDS
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" sx={{ color: colors.textDim, fontSize: "0.65rem" }}>High School (10th)</Typography>
              <Typography fontWeight={700}>{data.schooling?.highSchoolName || "—"}</Typography>
              <Typography variant="caption" sx={{ color: colors.accent }}>
                {data.schooling?.highSchoolPercentage ? `${data.schooling.highSchoolPercentage}%` : "—"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" sx={{ color: colors.textDim, fontSize: "0.65rem" }}>Higher Secondary (12th)</Typography>
              <Typography fontWeight={700}>{data.schooling?.higherSecondaryName || "—"}</Typography>
              <Typography variant="caption" sx={{ color: colors.accent }}>
                {data.schooling?.higherSecondaryPercentage ? `${data.schooling.higherSecondaryPercentage}%` : "—"}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.06)" }} />

          {/* ── Skills & Achievements ─────────────────────────────────────── */}
          <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 900, letterSpacing: 2, display: "block", mb: 2 }}>
            PROFESSIONAL ASSETS
          </Typography>
          {data.skills?.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {data.skills.map((skill, idx) => (
                <Chip
                  key={idx}
                  label={skill}
                  size="small"
                  sx={{
                    bgcolor: "rgba(112,0,255,0.1)",
                    color: colors.accent,
                    border: `1px solid rgba(112,0,255,0.4)`,
                    fontWeight: 700,
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography sx={{ color: colors.textDim, fontStyle: "italic", mb: 2 }}>
              No skills listed.
            </Typography>
          )}

          {data.newAchievement && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ color: colors.textDim, fontSize: "0.65rem" }}>Achievement</Typography>
              <Typography fontWeight={600}>{data.newAchievement}</Typography>
            </Box>
          )}

          {data.certificationLink && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ color: colors.textDim, fontSize: "0.65rem" }}>Certification</Typography>
              <Typography
                component="a"
                href={data.certificationLink}
                target="_blank"
                sx={{ color: colors.accent, textDecoration: "none", fontWeight: 700, "&:hover": { textDecoration: "underline" } }}
              >
                {data.certificationLink}
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default StudentProfileView;