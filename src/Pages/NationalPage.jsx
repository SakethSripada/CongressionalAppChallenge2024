import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button 
} from '@mui/material';

const NationalPage = () => {
  return (
    <Box 
      sx={{ 
        position: 'relative', 
        width: '100%', 
        height: '100vh', // Full viewport height
        overflow: 'hidden', // Prevents overflow
      }}
    >
      {/* Background Image with Blur */}
      <Box 
        component="img"
        src="/nationalpagebg.jpg" // Background image
        alt="Background"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover', // Cover the entire area
          filter: 'blur(3px)', // Apply blur effect to the background
          zIndex: 0 // Behind everything
        }} 
      />

      {/* Overlay for better text visibility */}
      <Box 
        sx={{
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent overlay
          zIndex: 1
        }} 
      />

      {/* Main content container */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          paddingTop: '80px', 
          paddingBottom: '50px', 
          height: '100%', // Ensure full height
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', marginBottom: '30px' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#1976d2' }}>
            National Elections
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore the latest national election results, opinion polls, and political analysis.
          </Typography>
        </Box>

        {/* National Election Results */}
        <Box sx={{ marginBottom: '50px' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
            National Election Results
          </Typography>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                  <TableCell><strong>State</strong></TableCell>
                  <TableCell><strong>Candidate</strong></TableCell>
                  <TableCell align="right"><strong>Votes</strong></TableCell>
                  <TableCell align="right"><strong>Percentage</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>California</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell align="right">5,500,000</TableCell>
                  <TableCell align="right">65%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Texas</TableCell>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell align="right">4,200,000</TableCell>
                  <TableCell align="right">55%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Public Opinion Polls Section */}
        <Box sx={{ marginBottom: '50px' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
            Public Opinion Polls
          </Typography>
          <Typography variant="body1">
            Track the latest public opinion polls to see how candidates are performing nationally.
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            View Detailed Polls
          </Button>
        </Box>

        {/* Political Analysis Section */}
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
            Political Analysis
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ padding: '20px', boxShadow: 3, backgroundColor: '#f9f9f9' }}>
                <CardContent>
                  <Typography variant="h5" sx={{ color: '#1976d2' }}>Analysis: The Road to the White House</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Political experts weigh in on the strategies used by each candidate and their path to victory.
                  </Typography>
                  <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ padding: '20px', boxShadow: 3, backgroundColor: '#f9f9f9' }}>
                <CardContent>
                  <Typography variant="h5" sx={{ color: '#1976d2' }}>What the Polls Are Saying</Typography>
                  <Typography variant="body2" color="text.secondary">
                    A breakdown of how the polls are trending leading up to the national election.
                  </Typography>
                  <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default NationalPage;
