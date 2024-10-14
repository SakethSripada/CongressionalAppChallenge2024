import React, { useContext, useEffect, useState } from 'react';
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
import axios from 'axios';
import { AddressContext } from '../Context/AddressContext';  // Import the AddressContext

const NationalPage = () => {
  const { address } = useContext(AddressContext);  // Access the address from context
  const [nationalReps, setNationalReps] = useState([]);

  const civicAPIKey = 'AIzaSyBL3WFFp76lGFGKI-flp-ilGzlY56PzCfc';  // Your provided API key

  useEffect(() => {
    if (address) {
      const fetchNationalReps = async () => {
        try {
          const response = await axios.get(`https://www.googleapis.com/civicinfo/v2/representatives`, {
            params: { address, key: civicAPIKey }
          });

          const offices = response.data.offices;
          const officials = response.data.officials;
          const national = [];

          offices.forEach((office) => {
            if (office.levels && office.levels.includes('country')) {  // National level
              office.officialIndices.forEach((index) => {
                const official = officials[index];
                national.push({
                  office: office.name,
                  name: official.name,
                  party: official.party || 'N/A',
                  phone: official.phones ? official.phones[0] : 'N/A',
                  website: official.urls ? official.urls[0] : 'N/A'
                });
              });
            }
          });

          setNationalReps(national);
        } catch (error) {
          console.error('Error fetching national representatives:', error);
        }
      };

      fetchNationalReps();
    }
  }, [address]);

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        width: '100%', 
        height: '100vh', 
        overflow: 'hidden',
      }}
    >
      {/* Background Image with Blur */}
      <Box 
        component="img"
        src="/nationalpagebg.jpg"
        alt="Background"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(3px)',
          zIndex: 0
        }} 
      />

      {/* Overlay */}
      <Box 
        sx={{
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          zIndex: 1
        }} 
      />

      {/* Main Content */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          paddingTop: '80px', 
          paddingBottom: '50px', 
          height: '100%',
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', marginBottom: '30px' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#1976d2' }}>
            National Elections
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore the latest national election results, opinion polls, and political analysis.
          </Typography>
        </Box>

        {/* National Representatives */}
        <Box sx={{ marginBottom: '50px' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
            Your National Representatives
          </Typography>
          {nationalReps.length > 0 ? (
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                    <TableCell><strong>Office</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell align="right"><strong>Party</strong></TableCell>
                    <TableCell align="right"><strong>Phone</strong></TableCell>
                    <TableCell align="right"><strong>Website</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nationalReps.map((rep, index) => (
                    <TableRow key={index}>
                      <TableCell>{rep.office}</TableCell>
                      <TableCell>{rep.name}</TableCell>
                      <TableCell align="right">{rep.party}</TableCell>
                      <TableCell align="right">{rep.phone}</TableCell>
                      <TableCell align="right">
                        {rep.website ? (
                          <a href={rep.website} target="_blank" rel="noopener noreferrer">
                            {rep.website}
                          </a>
                        ) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No national representatives found for the provided address.
            </Typography>
          )}
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
