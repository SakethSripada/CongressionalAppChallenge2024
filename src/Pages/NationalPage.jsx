import React, { useContext, useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Divider,
  Grid,
  Link,
  CircularProgress
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

  const formatStateName = (state) => state.toLowerCase().replace(/\s+/g, '-');

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

          setVoterInfo(response.data);
        } catch (error) {
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
        background: 'linear-gradient(to right, rgba(255, 102, 102, 0.5), rgba(255, 255, 255, 0.5), rgba(102, 153, 255, 0.5))',
        minHeight: '100vh',
        py: 8,
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Container maxWidth="lg" sx={{ paddingY: 8 }}>
        
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', marginBottom: '40px' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
            National Elections
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore the latest national election results, opinion polls, and political analysis.
          </Typography>
        </Box>

        {/* Presidential and Vice-Presidential Candidates Table */}
        <Box sx={{ marginBottom: '50px' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold', borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 1 }}>
            Presidential and Vice-Presidential Candidates
          </Typography>
          <TableContainer component={Paper} elevation={3} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#140a35' }}>
                  <TableCell><strong style={{color: '#f8b231'}}>Position</strong></TableCell>
                  <TableCell><strong style={{color: '#f8b231'}}>Name</strong></TableCell>
                  <TableCell><strong style={{color: '#f8b231'}}>Profile</strong></TableCell>
                  <TableCell><strong style={{color: '#f8b231'}}>Political Party</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>President</TableCell>
                  <TableCell>Donald Trump</TableCell>
                  <TableCell>
                    <Link href="https://ballotpedia.org/Donald_Trump" target="_blank" rel="noopener noreferrer" color="#1976d2">
                      View Profile
                    </Link>
                  </TableCell>
                  <TableCell>Republican</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Vice President</TableCell>
                  <TableCell>J.D. Vance</TableCell>
                  <TableCell>
                    <Link href="https://ballotpedia.org/J.D._Vance" target="_blank" rel="noopener noreferrer" color="#1976d2">
                      View Profile
                    </Link>
                  </TableCell>
                  <TableCell>Republican</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>President</TableCell>
                  <TableCell>Kamala Harris</TableCell>
                  <TableCell>
                    <Link href="https://ballotpedia.org/Kamala_Harris" target="_blank" rel="noopener noreferrer" color="#1976d2">
                      View Profile
                    </Link>
                  </TableCell>
                  <TableCell>Democrat</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Vice President</TableCell>
                  <TableCell>Tim Walz</TableCell>
                  <TableCell>
                    <Link href="https://ballotpedia.org/Tim_Walz" target="_blank" rel="noopener noreferrer" color="#1976d2">
                      View Profile
                    </Link>
                  </TableCell>
                  <TableCell>Democrat</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* National Representatives Section */}
        <Box sx={{ marginBottom: '50px' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold', borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 1 }}>
            Your National Representatives
          </Typography>
          {nationalReps.length > 0 ? (
            <TableContainer component={Paper} elevation={3} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#140a35' }}>
                    <TableCell><strong style={{color: '#f8b231'}}>Office</strong></TableCell>
                    <TableCell><strong style={{color: '#f8b231'}}>Name</strong></TableCell>
                    <TableCell><strong style={{color: '#f8b231'}}>Party</strong></TableCell>
                    <TableCell><strong style={{color: '#f8b231'}}>Phone</strong></TableCell>
                    <TableCell align="right"><strong style={{color: '#f8b231'}}>Website</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nationalReps.map((rep, index) => (
                    <TableRow key={index}>
                      <TableCell>{rep.office}</TableCell>
                      <TableCell>{rep.name}</TableCell>
                      <TableCell>{rep.party}</TableCell>
                      <TableCell>{rep.phone}</TableCell>
                      <TableCell align="right">
                        {rep.website ? (
                          <Link href={rep.website} target="_blank" rel="noopener noreferrer" color="#1976d2">
                            {rep.website}
                          </Link>
                        ) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              No national representatives found for the provided address.
            </Typography>
          )}
        </Box>

        {/* General Election Information */}
        <Box sx={{ marginBottom: '50px' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold', borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 1 }}>
            General Election Information
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100px">
              <CircularProgress />
            </Box>
          ) : voterInfo ? (
            <Box>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Paper sx={{ padding: '16px', marginBottom: '16px', boxShadow: 3 }}>
                    <Typography variant="h5" gutterBottom>Election Information</Typography>
                    <Typography variant="body1"><strong>Election Name:</strong> {voterInfo.election?.name || 'N/A'}</Typography>
                    <Typography variant="body1"><strong>Election Day:</strong> {voterInfo.election?.electionDay || 'N/A'}</Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>Polling Locations</Typography>
                  {voterInfo.pollingLocations?.length > 0 ? (
                    voterInfo.pollingLocations.map((location, index) => (
                      <Paper key={index} sx={{ padding: '16px', marginBottom: '16px', boxShadow: 3 }}>
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
                </Grid>

                {voterInfo.state?.map((stateInfo, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper sx={{ padding: '16px', marginBottom: '16px', boxShadow: 3 }}>
                      <Typography variant="h5" gutterBottom>Election Administration for {stateInfo.name}</Typography>
                      <Typography variant="body1"><strong>Election Administration Body:</strong> {stateInfo.electionAdministrationBody?.name || 'N/A'}</Typography>
                      <Typography variant="body1"><strong>Office Hours:</strong> {stateInfo.electionAdministrationBody?.hoursOfOperation || 'N/A'}</Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6">Physical Address</Typography>
                      <Typography variant="body2">
                        <strong>{stateInfo.electionAdministrationBody?.physicalAddress?.locationName || 'N/A'}</strong><br />
                        {stateInfo.electionAdministrationBody?.physicalAddress?.line1}, {stateInfo.electionAdministrationBody?.physicalAddress?.city}, {stateInfo.electionAdministrationBody?.physicalAddress?.state} {stateInfo.electionAdministrationBody?.physicalAddress?.zip}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6">Useful Links</Typography>
                      <Box component="ul" sx={{ paddingLeft: 2 }}>
                        {[
                          { label: 'Election Info', url: stateInfo.electionAdministrationBody?.electionInfoUrl },
                          { label: 'Registration Info', url: stateInfo.electionAdministrationBody?.electionRegistrationUrl },
                          { label: 'Registration Confirmation', url: stateInfo.electionAdministrationBody?.electionRegistrationConfirmationUrl },
                          { label: 'Absentee Voting Info', url: stateInfo.electionAdministrationBody?.absenteeVotingInfoUrl },
                          { label: 'Voting Location Finder', url: stateInfo.electionAdministrationBody?.votingLocationFinderUrl },
                          { label: 'Ballot Info', url: stateInfo.electionAdministrationBody?.ballotInfoUrl },
                        ].map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <Link href={link.url} target="_blank" rel="noopener noreferrer" color="#1976d2">
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Typography variant="body1" color="error">
              {errorMessage || 'No voter information available for the given address.'}
            </Typography>
          )}
        </Box>

        {/* Polling Section */}
        <Box sx={{ marginBottom: '50px' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold', borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 1 }}>
            Public Opinion Polls
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Track the latest public opinion polls to see how candidates are performing nationally and at the state level.
          </Typography>
          
          {/* National Poll Embed */}
          <Box sx={{ mt: 2 }}>
            <iframe
              src="https://projects.fivethirtyeight.com/polls/president-general/2024/national/"
              width="100%"
              height="500"
              style={{ border: 'none' }}
              title="National Polls"
            />
          </Box>

          {/* State-Specific Poll Embed */}
          {address && voterInfo && voterInfo.state && (
            <Box sx={{ mt: 4 }}>
              <iframe
                src={`https://projects.fivethirtyeight.com/polls/president-general/2024/${formatStateName(voterInfo.state[0]?.name)}`}
                width="100%"
                height="500"
                style={{ border: 'none' }}
                title="State Polls"
              />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default NationalPage;