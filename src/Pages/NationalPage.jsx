import React from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@mui/material';

const NationalPage = () => {
  return (
    <Container maxWidth="lg" sx={{ paddingTop: '50px', paddingBottom: '50px' }}>
      
      <Box sx={{ textAlign: 'center', marginBottom: '30px' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          National Elections
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Explore the latest national election results, opinion polls, and political analysis.
        </Typography>
      </Box>

      <Box sx={{ marginBottom: '50px' }}>
        <Typography variant="h4" gutterBottom>
          National Election Results
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>State</TableCell>
                <TableCell>Candidate</TableCell>
                <TableCell>Votes</TableCell>
                <TableCell>Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>California</TableCell>
                <TableCell>John Doe</TableCell>
                <TableCell>5,500,000</TableCell>
                <TableCell>65%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Texas</TableCell>
                <TableCell>Jane Smith</TableCell>
                <TableCell>4,200,000</TableCell>
                <TableCell>55%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ marginBottom: '50px' }}>
        <Typography variant="h4" gutterBottom>
          Public Opinion Polls
        </Typography>
        <Typography variant="body1">
          Track the latest public opinion polls to see how candidates are performing nationally.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h4" gutterBottom>
          Political Analysis
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ padding: '20px' }}>
              <Typography variant="h5">Analysis: The Road to the White House</Typography>
              <Typography variant="body2" color="textSecondary">
                Political experts weigh in on the strategies used by each candidate and their path to victory.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ padding: '20px' }}>
              <Typography variant="h5">What the Polls Are Saying</Typography>
              <Typography variant="body2" color="textSecondary">
                A breakdown of how the polls are trending leading up to the national election.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

    </Container>
  );
};

export default NationalPage;
