import React, { useState, useEffect } from "react";
import {
  Box, Container, Typography, TextField, Button, Paper, 
  Divider, Stack, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const StudentHistory = () => {
  const [mounted, setMounted] = useState(false);
  
  // Dynamic Academic State
  const [semesters, setSemesters] = useState([
    { id: 1, gpa: "", subjects: [{ code: "", name: "", marks: "" }] }
  ]);

  useEffect(() => { setMounted(true); }, []);

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
      borderRadius: '4px'
    },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.4)", fontSize: '0.75rem' },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.border },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.accent },
  };

  // Logic: Add a new Semester (Limit to 8)
  const addSemester = () => {
    if (semesters.length < 8) {
      setSemesters([...semesters, { 
        id: semesters.length + 1, 
        gpa: "", 
        subjects: [{ code: "", name: "", marks: "" }] 
      }]);
    }
  };

  // Logic: Add Subject to specific Semester
  const addSubject = (semIndex) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[semIndex].subjects.push({ code: "", name: "", marks: "" });
    setSemesters(updatedSemesters);
  };

  if (!mounted) return null;

  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: "100vh", py: 6, color: "#fff" }}>
      <Container maxWidth="xl">
        
        {/* TOP SYSTEM BAR */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={900} letterSpacing="-0.02em">STUDENT History</Typography>
            <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 800, letterSpacing: 2 }}>SRM UNIVERSITY TRICHY</Typography>
          </Box>
          <Button variant="contained" startIcon={<SaveIcon />} sx={{ bgcolor: colors.accent, px: 4, borderRadius: 0, fontWeight: 900 }}>SYNC_LEDGER</Button>
        </Stack>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          
          {/* LEFT SIDE: Identity, Family, Schooling, Skills */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 65%' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {/* 01 // PERSONAL IDENTITY */}
              <Paper sx={{ flex: '1 1 45%', p: 3, bgcolor: colors.glass, border: `1px solid ${colors.border}`, borderRadius: 0 }}>
                <Typography variant="overline" color={colors.accent} fontWeight={900}>01 // IDENTITY</Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <TextField fullWidth label="Full Legal Name" defaultValue="Vijayaragunathan" sx={inputStyles} />
                  <Stack direction="row" spacing={2}>
                    <TextField fullWidth label="Reg No" defaultValue="RAxxxxxx" sx={inputStyles} />
                    <TextField fullWidth label="Phone Number" placeholder="+91 XXX-XXX-XXXX" sx={inputStyles} />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField fullWidth label="DOB" type="date" InputLabelProps={{ shrink: true }} sx={inputStyles} />
                    <TextField fullWidth label="Department" defaultValue="CSE" sx={inputStyles} />
                  </Stack>
                  <TextField fullWidth multiline rows={2} label="Permanent Address" sx={inputStyles} />
                </Stack>
              </Paper>

              {/* 02 // FAMILY PROFILES */}
              <Paper sx={{ flex: '1 1 45%', p: 3, bgcolor: colors.glass, border: `1px solid ${colors.border}`, borderRadius: 0 }}>
                <Typography variant="overline" color={colors.accent} fontWeight={900}>02 // GUARDIANS</Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <TextField fullWidth label="Father's Name" sx={inputStyles} />
                  <TextField fullWidth label="Father's Occupation" sx={inputStyles} />
                  <Divider sx={{ my: 1, borderColor: colors.border }} />
                  <TextField fullWidth label="Mother's Name" sx={inputStyles} />
                  <TextField fullWidth label="Mother's Occupation" sx={inputStyles} />
                </Stack>
              </Paper>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {/* 03 // SCHOOLING DETAILS */}
              <Paper sx={{ flex: '1 1 45%', p: 3, bgcolor: colors.glass, border: `1px solid ${colors.border}`, borderRadius: 0 }}>
                <Typography variant="overline" color={colors.accent} fontWeight={900}>03 // SCHOOLING</Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <TextField fullWidth label="High School (10th)" placeholder="School Name" sx={inputStyles} />
                  <TextField fullWidth label="10th Percentage" sx={inputStyles} />
                  <TextField fullWidth label="Higher Secondary (12th)" placeholder="School Name" sx={inputStyles} />
                  <TextField fullWidth label="12th Percentage" sx={inputStyles} />
                </Stack>
              </Paper>

              {/* 04 // ASSETS */}
              <Paper sx={{ flex: '1 1 45%', p: 3, bgcolor: colors.glass, border: `1px solid ${colors.border}`, borderRadius: 0 }}>
                <Typography variant="overline" color={colors.accent} fontWeight={900}>04 // PROFESSIONAL_ASSETS</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1.5 }}>
                  {['React.js', 'Node.js', 'MERN'].map(skill => (
                    <Chip key={skill} label={skill} size="small" sx={{ bgcolor: 'rgba(112,0,255,0.1)', color: colors.accent, border: `1px solid ${colors.accent}`, borderRadius: 0 }} />
                  ))}
                </Box>
                <TextField fullWidth label="New Achievement" sx={inputStyles} />
                <TextField fullWidth label="Certification Link" sx={inputStyles} />
              </Paper>
            </Box>
          </Box>

          {/* RIGHT SIDE: Dynamic Academic Chronology (8 Semesters Support) */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 32%' } }}>
            <Paper sx={{ p: 3, bgcolor: colors.glass, border: `1px solid ${colors.border}`, borderRadius: 0, height: '100%', overflowY: 'auto', maxHeight: '85vh' }}>
              <Typography variant="overline" color={colors.accent} fontWeight={900}>05 // ACADEMIC_LEDGER (SEM 1-8)</Typography>
              
              <Stack spacing={4} sx={{ mt: 2 }}>
                {semesters.map((sem, semIndex) => (
                  <Box key={sem.id} sx={{ border: `1px solid ${colors.border}`, p: 2, bgcolor: 'rgba(255,255,255,0.01)' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 900, color: colors.accent }}>SEMESTER_0{sem.id}</Typography>
                      <TextField 
                        placeholder="GPA" 
                        size="small" 
                        sx={{ width: '80px', "& .MuiInputBase-input": { p: 0.5, textAlign: 'center', fontSize: '0.7rem' } }}
                        value={sem.gpa}
                        onChange={(e) => {
                           const newSems = [...semesters];
                           newSems[semIndex].gpa = e.target.value;
                           setSemesters(newSems);
                        }}
                      />
                    </Stack>

                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          {sem.subjects.map((sub, subIndex) => (
                            <TableRow key={subIndex}>
                              <TableCell sx={{ border: 'none', p: 0.5 }}>
                                <TextField variant="standard" placeholder="Code" InputProps={{ disableUnderline: true, style: { color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' } }} />
                              </TableCell>
                              <TableCell sx={{ border: 'none', p: 0.5 }}>
                                <TextField variant="standard" placeholder="Subject" InputProps={{ disableUnderline: true, style: { color: '#fff', fontSize: '0.65rem' } }} />
                              </TableCell>
                              <TableCell sx={{ border: 'none', p: 0.5 }} align="right">
                                <TextField variant="standard" placeholder="Marks" InputProps={{ disableUnderline: true, style: { color: colors.accent, fontWeight: 900, fontSize: '0.65rem', textAlign: 'right' } }} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Button 
                      size="small" 
                      startIcon={<AddCircleOutlineIcon sx={{ fontSize: '0.8rem' }} />} 
                      onClick={() => addSubject(semIndex)}
                      sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', mt: 1 }}
                    >
                      ADD_SUBJECT
                    </Button>
                  </Box>
                ))}

                {semesters.length < 8 && (
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    onClick={addSemester}
                    sx={{ borderStyle: 'dashed', color: colors.accent, borderColor: colors.accent }}
                  >
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