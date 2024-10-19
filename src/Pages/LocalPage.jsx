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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { AddressContext } from '../Context/AddressContext';  
import axios from 'axios';

const stateAbbreviationMap = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};

const LocalPage = () => {
  const { address } = useContext(AddressContext);  
  const [localReps, setLocalReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [municipalCandidates, setMunicipalCandidates] = useState([]);
  const [demographics, setDemographics] = useState([]);
  const [county, setCounty] = useState('');
  const [fullStateName, setFullStateName] = useState('');

  const civicAPIKey = process.env.REACT_APP_CIVIC_API_KEY;  

  useEffect(() => {
    if (address) {
      const fetchLocalReps = async () => {
        setLoading(true); 
        console.log('Fetching local representatives for address:', address);
        
        try {
          const response = await axios.get(`https://www.googleapis.com/civicinfo/v2/representatives`, {
            params: { address, key: civicAPIKey }
          });

          console.log('Local representatives response:', response.data);

          const offices = response.data.offices;
          const officials = response.data.officials;
          const local = [];

          offices.forEach((office) => {
            if (office.levels && office.levels.includes('administrativeArea2')) { 
              office.officialIndices.forEach((index) => {
                const official = officials[index];
                local.push({
                  office: office.name,
                  name: official.name,
                  party: official.party || 'N/A',
                  phone: official.phones ? official.phones[0] : 'N/A',
                  website: official.urls ? official.urls[0] : 'N/A'
                });
              });
            }
          });

          console.log('Extracted local representatives:', local);
          setLocalReps(local);
          setErrorMessage('');

          const { county, state } = extractStateAndCounty(response.data);
          console.log('Extracted County:', county);
          console.log('Extracted State:', state);

          if (county && state) {
            console.log('Fetching municipal candidates for County:', county, 'State:', state);
            await fetchMunicipalCandidates(county, state);
          } else {
            console.warn('County or State is undefined. Municipal candidates will not be fetched.');
          }
        } catch (error) {
          console.error('Error fetching local representatives:', error);
          setErrorMessage('Error fetching local representatives. Please try again later.');
        } finally {
          setLoading(false); 
        }
      };

      fetchLocalReps();
    }
  }, [address, civicAPIKey]);

  const extractStateAndCounty = (data) => {
    const divisions = data.divisions;
    let county = null;
    let stateAbbreviation = null;
  
    Object.keys(divisions).forEach((divisionId) => {
      if (divisionId.includes('county:')) {
        county = divisions[divisionId].name.split(' ').slice(0, 2).join(' ');
      } else if (divisionId.includes('state:')) {
        stateAbbreviation = divisionId.split(':')[2]; 
      }
    });
  
    const normalizedStateAbbreviation = data.normalizedInput.state; 
  
    const fullStateName = stateAbbreviationMap[normalizedStateAbbreviation.toUpperCase()] || 'Unknown State';
  
    setCounty(county);
    setFullStateName(fullStateName);
  
    console.log('Extracted County:', county);
    console.log('Extracted State:', fullStateName);
  
    return { county, state: fullStateName };
  };  

  const fetchMunicipalCandidates = async (county, state) => {
    try {
      const countyTrimmed = county.split(' ').slice(0, 2).join(' ');
      console.log('Fetching municipal candidates from backend for County:', countyTrimmed, 'State:', state);
      const url = `http://localhost:5000/api/municipal_candidates?county=${encodeURIComponent(countyTrimmed)}&state=${encodeURIComponent(state)}`;
      console.log('Requesting municipal candidates from URL:', url);
      
      const response = await axios.get(url);
      console.log('Municipal candidates fetched successfully:', response.data);
      
      // Set candidates and demographics
      setMunicipalCandidates(response.data.candidates || []);
      setDemographics(response.data.demographics || []);
    } catch (error) {
      console.error('Error fetching municipal candidates:', error);
    }
  };

  const groupCandidatesByElection = () => {
    return municipalCandidates.reduce((acc, candidate) => {
      const election = candidate.election;
      if (!acc[election]) {
        acc[election] = [];
      }
      acc[election].push(candidate);
      return acc;
    }, {});
  };

  const candidatesByElection = groupCandidatesByElection();

  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(to right, rgba(255, 102, 102, 0.5), rgba(255, 255, 255, 0.5), rgba(102, 153, 255, 0.5))',       
        minHeight: '100vh', 
        py: 8 
      }}
    >
      <Container maxWidth="lg" sx={{ py: 8, pt: 10 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ 
              fontWeight: 900, 
              color: '#333',
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '3rem', md: '4.5rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}>
          Local Elections
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{
              color: 'rgba(0,0,0,0.7)',
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 300,
            }}>
          Find information about your local representatives and polling stations.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'medium', mb: 4, fontFamily: "'Playfair Display', serif" }}>
            Your Local Representatives
          </Typography>
          <Grid container spacing={4}>
            {localReps.length > 0 ? (
              localReps.map((rep, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{
                    borderRadius: '10px', 
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)', 
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                    }
                  }} elevation={0}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
                        {rep.name}
                      </Typography>
                      <Chip label={rep.party} color="secondary" size="small" sx={{ mb: 2, fontFamily: "'Roboto', sans-serif" }} />
                      <Typography color="text.secondary" gutterBottom sx={{ fontFamily: "'Roboto', sans-serif" }}>
                        {rep.office}
                      </Typography>
                      <Typography variant="body2" paragraph sx={{ fontFamily: "'Roboto', sans-serif" }}>
                        Phone: {rep.phone}
                      </Typography>
                      <Link href={rep.website} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main', textDecoration: 'underline', fontFamily: "'Roboto', sans-serif" }}>
                        Official Website
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ fontFamily: "'Roboto', sans-serif" }}>
                  No local representatives found for the provided address.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        <Divider sx={{ my: 8 }} />

        <Box sx={{ marginTop: '50px' }}>
          <Typography variant="h4" gutterBottom>
            Municipal Candidates
          </Typography>
          {Object.keys(candidatesByElection).length > 0 ? (
            Object.entries(candidatesByElection).map(([election, candidates], index) => (
              <Box key={index} sx={{ marginBottom: '30px' }}>
                <Typography variant="h5">{election}</Typography>
                {candidates.map((candidate, idx) => (
                  <Typography key={idx}>
                    {candidate.name} ({candidate.party}) - <Link href={candidate.link} target="_blank" rel="noopener noreferrer">More Info</Link>
                  </Typography>
                ))}
              </Box>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No municipal candidates found.
            </Typography>
          )}
        </Box>

        <Box sx={{ marginTop: '50px' }}>
          <Typography variant="h4" gutterBottom>
            Demographic Information
          </Typography>
          {demographics.length > 0 ? (
            <Table component={Paper}>
              <TableHead>
                <TableRow>
                  <TableCell>Label</TableCell>
                  <TableCell>{county}</TableCell>
                  <TableCell>{fullStateName}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {demographics.map((item, index) => {
                  const [countyValue, stateValue] = item.value.split(', ');
                  return (
                    <TableRow key={index}>
                      <TableCell>{item.label}</TableCell>
                      <TableCell>{countyValue.split(' (')[0]}</TableCell>
                      <TableCell>{stateValue.split(' (')[0]}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No demographic information available.
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default LocalPage;