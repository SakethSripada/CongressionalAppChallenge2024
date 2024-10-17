import React, { useContext, useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Divider
} from '@mui/material';
import axios from 'axios';
import { AddressContext } from '../Context/AddressContext';  

const NationalPage = () => {
  const { address } = useContext(AddressContext);  
  const [nationalReps, setNationalReps] = useState([]);
  const [voterInfo, setVoterInfo] = useState(null);  
  const [errorMessage, setErrorMessage] = useState('');  
  const [loading, setLoading] = useState(true);  

  const civicAPIKey = process.env.REACT_APP_CIVIC_API_KEY; 

  useEffect(() => {
    if (address) {
      const fetchNationalReps = async () => {
        try {
          const response = await axios.get(`https://www.googleapis.com/civicinfo/v2/representatives`, {
            params: { address, key: civicAPIKey }
          });

          console.log('National representatives response:', response.data); // Log the response data

          const offices = response.data.offices;
          const officials = response.data.officials;
          const national = [];

          offices.forEach((office) => {
            if (office.levels && office.levels.includes('country')) { 
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
          setErrorMessage('Error fetching national representatives. Please try again later.');
        }
      };

      fetchNationalReps();
    }
  }, [address, civicAPIKey]);

  useEffect(() => {
    if (address) {
      const fetchVoterInfo = async () => {
        try {
          setLoading(true);
          const response = await axios.get('https://www.googleapis.com/civicinfo/v2/voterinfo', {
            params: { address, electionId: 9000, key: civicAPIKey }
          });

          console.log('Voter information response:', response.data); // Log the response data
          setVoterInfo(response.data);
        } catch (error) {
          console.error('Error fetching voter information:', error);
          setErrorMessage(`Error fetching voter information: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchVoterInfo();
    }
  }, [address]);

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        width: '100%', 
        minHeight: '100vh',  
        overflowX: 'hidden', 
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
          overflowY: 'auto',  
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

        {/* Election Information */}
        <Box sx={{ marginBottom: '50px' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
            General Election Information
          </Typography>
          {loading ? (
            <Typography variant="body1" color="text.secondary">
              Loading voter information...
            </Typography>
          ) : voterInfo ? (
            <Box>
              <Typography variant="h5" gutterBottom>Election Information</Typography>
              <Paper sx={{ padding: '16px', marginBottom: '16px' }}>
                <Typography variant="body1"><strong>Election Name:</strong> {voterInfo.election?.name || 'N/A'}</Typography>
                <Typography variant="body1"><strong>Election Day:</strong> {voterInfo.election?.electionDay || 'N/A'}</Typography>
              </Paper>

              <Typography variant="h5" gutterBottom>Polling Locations</Typography>
              {voterInfo.pollingLocations?.length > 0 ? (
                voterInfo.pollingLocations.map((location, index) => (
                  <Paper key={index} sx={{ padding: '16px', marginBottom: '16px' }}>
                    <Typography variant="body1"><strong>Location Name:</strong> {location.address?.locationName || 'N/A'}</Typography>
                    <Typography variant="body1"><strong>Address:</strong> {location.address?.line1}, {location.address?.city}, {location.address?.state} {location.address?.zip}</Typography>
                    <Typography variant="body1"><strong>Polling Hours:</strong> {location.pollingHours || 'N/A'}</Typography>
                  </Paper>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No polling locations available.
                </Typography>
              )}

              <Typography variant="h5" gutterBottom>Election Administration</Typography>
              {voterInfo.state.map((stateInfo, index) => (
                <Paper key={index} sx={{ padding: '16px', marginBottom: '16px' }}>
                  <Typography variant="body1"><strong>State:</strong> {stateInfo.name}</Typography>
                  <Typography variant="body1"><strong>Election Administration Body:</strong> {stateInfo.electionAdministrationBody.name}</Typography>
                  <Typography variant="body1"><strong>Office Hours:</strong> {stateInfo.electionAdministrationBody.hoursOfOperation || 'N/A'}</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6">Physical Address</Typography>
                  <Typography variant="body2">
                    <strong>{stateInfo.electionAdministrationBody.physicalAddress?.locationName || 'N/A'}</strong><br />
                    {stateInfo.electionAdministrationBody.physicalAddress?.line1}, {stateInfo.electionAdministrationBody.physicalAddress?.city}, {stateInfo.electionAdministrationBody.physicalAddress?.state} {stateInfo.electionAdministrationBody.physicalAddress?.zip}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6">Useful Links</Typography>
                  <Typography variant="body2"><strong>Election Info:</strong> <a href={stateInfo.electionAdministrationBody.electionInfoUrl} target="_blank" rel="noopener noreferrer">{stateInfo.electionAdministrationBody.electionInfoUrl}</a></Typography>
                  <Typography variant="body2"><strong>Registration Info:</strong> <a href={stateInfo.electionAdministrationBody.electionRegistrationUrl} target="_blank" rel="noopener noreferrer">{stateInfo.electionAdministrationBody.electionRegistrationUrl}</a></Typography>
                  <Typography variant="body2"><strong>Registration Confirmation:</strong> <a href={stateInfo.electionAdministrationBody.electionRegistrationConfirmationUrl} target="_blank" rel="noopener noreferrer">{stateInfo.electionAdministrationBody.electionRegistrationConfirmationUrl}</a></Typography>
                  <Typography variant="body2"><strong>Absentee Voting Info:</strong> <a href={stateInfo.electionAdministrationBody.absenteeVotingInfoUrl} target="_blank" rel="noopener noreferrer">{stateInfo.electionAdministrationBody.absenteeVotingInfoUrl}</a></Typography>
                  <Typography variant="body2"><strong>Voting Location Finder:</strong> <a href={stateInfo.electionAdministrationBody.votingLocationFinderUrl} target="_blank" rel="noopener noreferrer">{stateInfo.electionAdministrationBody.votingLocationFinderUrl}</a></Typography>
                  <Typography variant="body2"><strong>Ballot Info:</strong> <a href={stateInfo.electionAdministrationBody.ballotInfoUrl} target="_blank" rel="noopener noreferrer">{stateInfo.electionAdministrationBody.ballotInfoUrl}</a></Typography>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="error">
              {errorMessage || 'No voter information available for the given address.'}
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
      </Container>
    </Box>
  );
};

export default NationalPage;