import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import MentorCard from "./MentorCard";

const fetchMentors = async () => {
  const res = await axios.get("http://localhost:5000/api/mentors");
  return res.data;
};

const MentorList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["mentors"],
    queryFn: fetchMentors,
  });

  if (isLoading) return <CircularProgress sx={{ mt: 4, mx: "auto", display: "block" }} />;
  if (isError) return <Typography>Error loading mentors</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Meet Our Mentors
      </Typography>
      <Grid container spacing={4}>
        {data.map((mentor) => (
          <Grid item xs={12} sm={6} md={4} key={mentor._id}>
            <MentorCard mentor={mentor} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MentorList;
