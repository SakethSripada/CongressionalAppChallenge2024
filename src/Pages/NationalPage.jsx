import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Link,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Drawer,
  Avatar,
} from '@mui/material';
import axios from 'axios';
import { AddressContext } from '../Context/AddressContext';
import InfoIcon from '@mui/icons-material/Info';

const formatStateName = (state) => state.toLowerCase().replace(/\s+/g, '-');

const NationalPage = () => {
  const { address } = useContext(AddressContext);
  const [nationalReps, setNationalReps] = useState([]);
  const [voterInfo, setVoterInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const civicAPIKey = process.env.REACT_APP_CIVIC_API_KEY;
  const [selectedBio, setSelectedBio] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedName, setSelectedName] = useState('');

  useEffect(() => {
    if (address) {
      fetchNationalReps();
      fetchVoterInfo();
    }
  }, [address]);

  const fetchNationalReps = async () => {
    try {
      const response = await axios.get(`https://www.googleapis.com/civicinfo/v2/representatives`, {
        params: { address, key: civicAPIKey },
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
              website: official.urls ? official.urls[0] : 'N/A',
            });
          });
        }
      });

      setNationalReps(national);
    } catch (error) {
      setErrorMessage('Error fetching national representatives. Please try again later.');
    }
  };

  const fetchVoterInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://www.googleapis.com/civicinfo/v2/voterinfo', {
        params: { address, electionId: 9000, key: civicAPIKey },
      });

      setVoterInfo(response.data);
    } catch (error) {
      setErrorMessage(`Error fetching voter information: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidateBio = async (name, role) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/candidate_bio`, {
        params: { name, role }
      });
      setSelectedBio(response.data.bio);
      setSelectedImage(response.data.image_url);
      setSelectedName(name);
      setDrawerOpen(true);
    } catch (error) {
      console.error('Error fetching candidate bio:', error);
      setSelectedBio('Biography not available.');
      setSelectedImage('');
      setSelectedName(name);
      setDrawerOpen(true);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', minHeight: '100vh', py: 8, overflow: 'hidden' }}>
      <video
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',  
          height: '100%', 
          objectFit: 'cover', 
          zIndex: -1,
          filter: 'blur(2px)',
          opacity: '0.5'
        }}
      >
        <source src="/videos/national_background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Container maxWidth="lg" sx={{ py: 8, pt: 10, position: 'relative' }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          align="center"
          sx={{ fontWeight: 900, color: '#333', fontFamily: "'Playfair Display', serif", fontSize: { xs: '3rem', md: '4.5rem' } }}
        >
          National Elections
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ color: 'rgba(0, 0, 0, 0.8)', fontFamily: "'Roboto', sans-serif", fontWeight: 300 }}
        >
          Explore the latest national election results, opinion polls, and political analysis.
        </Typography>

        {/* National Representatives Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold', mb: 4 }}>
            Your National Representatives
          </Typography>
          <Grid container spacing={4}>
            {nationalReps.length > 0 ? (
              nationalReps.map((rep, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      borderRadius: '10px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)' },
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      cursor: 'pointer',
                    }}
                    elevation={0}
                    onClick={() => fetchCandidateBio(rep.name, 'Representative')}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
                        {rep.name}
                      </Typography>
                      <Chip
                        label={rep.party}
                        color="secondary"
                        size="small"
                        sx={{ mb: 2, fontFamily: "'Roboto', sans-serif" }}
                      />
                      <Typography color="text.secondary" gutterBottom sx={{ fontFamily: "'Roboto', sans-serif" }}>
                        {rep.office}
                      </Typography>
                      <Typography variant="body2" paragraph sx={{ fontFamily: "'Roboto', sans-serif" }}>
                        Phone: {rep.phone}
                      </Typography>
                      <Link
                        href={rep.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: 'primary.main', textDecoration: 'underline', fontFamily: "'Roboto', sans-serif" }}
                      >
                        Official Website
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ fontFamily: "'Roboto', sans-serif" }}>
                  No national representatives found for the provided address.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* National Election Table and Voter Information */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', mb: 4 }}>
            Election Candidates and Voter Information
          </Typography>
          <Grid container spacing={4}>
            {/* Left Column: Presidential Candidates */}
            <Grid item xs={12} md={7}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: 'secondary.main' }}>
                Presidential and Vice-Presidential Candidates
              </Typography>
              <TableContainer component={Paper} elevation={3} sx={{ mb: 4 }}>
                <Table sx={{ minWidth: 650 }} aria-label="presidential elections table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'primary.light' }}>
                      <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Position</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Candidate</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Party</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>More Info</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { position: 'President', name: 'Donald Trump', party: 'Republican', link: 'https://ballotpedia.org/Donald_Trump' },
                      { position: 'Vice President', name: 'J.D. Vance', party: 'Republican', link: 'https://ballotpedia.org/J.D._Vance' },
                      { position: 'President', name: 'Kamala Harris', party: 'Democrat', link: 'https://ballotpedia.org/Kamala_Harris' },
                      { position: 'Vice President', name: 'Tim Walz', party: 'Democrat', link: 'https://ballotpedia.org/Tim_Walz' },
                    ].map((candidate, index) => (
                      <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                        <TableCell>{candidate.position}</TableCell>
                        <TableCell>{candidate.name}</TableCell>
                        <TableCell>{candidate.party}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            href={candidate.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<InfoIcon />}
                          >
                            More Info
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Right Column: Voter Information */}
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 3,
                    color: 'primary.main',
                    borderBottom: '2px solid',
                    borderColor: 'primary.main',
                    pb: 2,
                    fontWeight: 'bold',
                  }}
                >
                  Voter Information
                </Typography>
                {loading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 100,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : voterInfo ? (
                  <List>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            Election Name
                          </Typography>
                        }
                        secondary={
                          <Typography component="span" variant="body1" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            {voterInfo.election?.name || 'N/A'}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            Election Day
                          </Typography>
                        }
                        secondary={
                          <Typography component="span" variant="body1" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            {voterInfo.election?.electionDay || 'N/A'}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider sx={{ my: 2 }} />
                    {voterInfo.pollingLocations?.length > 0 ? (
                      voterInfo.pollingLocations.map((location, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  Location: {location.address?.locationName || 'N/A'}
                                </Typography>
                              }
                              secondary={
                                <Typography component="span" variant="body1" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                  Address: {location.address?.line1}, {location.address?.city}, {location.address?.state} {location.address?.zip}
                                </Typography>
                              }
                            />
                          </ListItem>
                          {index < voterInfo.pollingLocations.length - 1 && <Divider sx={{ my: 2 }} />}
                        </React.Fragment>
                      ))
                    ) : (
                      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        No polling locations available.
                      </Typography>
                    )}
                    <Divider sx={{ my: 2 }} />
                    {voterInfo.state?.map((stateInfo, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Election Administration for {stateInfo.name}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  <strong>Administration Body:</strong> {stateInfo.electionAdministrationBody?.name || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  <strong>Office Hours:</strong> {stateInfo.electionAdministrationBody?.hoursOfOperation || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  <strong>Physical Address:</strong> {stateInfo.electionAdministrationBody?.physicalAddress?.line1}, {stateInfo.electionAdministrationBody?.physicalAddress?.city}, {stateInfo.electionAdministrationBody?.physicalAddress?.state} {stateInfo.electionAdministrationBody?.physicalAddress?.zip}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  <strong>Useful Links:</strong>
                                </Typography>
                                <Box component="ul" sx={{ paddingLeft: 2, mt: 1 }}>
                                  {[
                                    { label: 'Election Info', url: stateInfo.electionAdministrationBody?.electionInfoUrl },
                                    { label: 'Registration Info', url: stateInfo.electionAdministrationBody?.electionRegistrationUrl },
                                    { label: 'Registration Confirmation', url: stateInfo.electionAdministrationBody?.electionRegistrationConfirmationUrl },
                                    { label: 'Absentee Voting Info', url: stateInfo.electionAdministrationBody?.absenteeVotingInfoUrl },
                                    { label: 'Voting Location Finder', url: stateInfo.electionAdministrationBody?.votingLocationFinderUrl },
                                    { label: 'Ballot Info', url: stateInfo.electionAdministrationBody?.ballotInfoUrl },
                                  ].map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                      <Link href={link.url} target="_blank" rel="noopener noreferrer" color="primary.main">
                                        {link.label}
                                      </Link>
                                    </li>
                                  ))}
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < voterInfo.state.length - 1 && <Divider sx={{ my: 2 }} />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                    {errorMessage || 'No voter information available for the given address.'}
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Polling Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold', mb: 4 }}>
            Public Opinion Polls
          </Typography>
          <Box sx={{ mt: 2 }}>
            <iframe
              src="https://projects.fivethirtyeight.com/polls/president-general/2024/national/"
              width="100%"
              height="500"
              style={{ border: 'none' }}
              title="National Polls"
            />
          </Box>
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
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 400 } } }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>{selectedName}</Typography>
          {selectedImage && (
            <Avatar
              src={selectedImage}
              alt={selectedName}
              sx={{ width: 200, height: 200, mb: 2, mx: 'auto' }}
            />
          )}
          <Typography variant="body1">{selectedBio}</Typography>
        </Box>
      </Drawer>
    </Box>
  );
};

export default NationalPage;
