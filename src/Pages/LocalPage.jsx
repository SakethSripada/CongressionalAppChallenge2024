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
  Paper,
  TableContainer,
  Button,
} from '@mui/material';
import { AddressContext } from '../Context/AddressContext';  
import axios from 'axios';
import InfoIcon from '@mui/icons-material/Info';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


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
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        py: 8,
        overflow: 'hidden',
      }}
    >
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
          filter: 'blur(4px)',
          opacity: '0.8'
        }}
      >
        <source src="/videos/local_background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Container maxWidth="lg" sx={{ py: 8, pt: 10, position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 900,
            color: '#fff',
            fontFamily: "'Playfair Display', serif",
            fontSize: { xs: '3rem', md: '4.5rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
          }}
        >
          Local Elections
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          paragraph
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 300,
          }}
        >
          Find information about your local representatives and polling stations.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 'medium',
              mb: 4,
              fontFamily: "'Playfair Display', serif",
              color: '#fff',
            }}
          >
            Your Local Representatives
          </Typography>
          <Grid container spacing={4}>
            {localReps.length > 0 ? (
              localReps.map((rep, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      borderRadius: '10px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                      },
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }}
                    elevation={0}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: '#333' }}
                      >
                        {rep.name}
                      </Typography>
                      <Chip
                        label={rep.party}
                        color="secondary"
                        size="small"
                        sx={{ mb: 2, fontFamily: "'Roboto', sans-serif" }}
                      />
                      <Typography
                        color="text.secondary"
                        gutterBottom
                        sx={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {rep.office}
                      </Typography>
                      <Typography
                        variant="body2"
                        paragraph
                        sx={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        Phone: {rep.phone}
                      </Typography>
                      <Link
                        href={rep.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'underline',
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Official Website
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{ fontFamily: "'Roboto', sans-serif", color: '#fff' }}
                >
                  No local representatives found for the provided address.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        <Divider sx={{ my: 5 }} />

        <Box sx={{ mt: 8 }}>
  <Typography
    variant="h4"
    gutterBottom
    sx={{
      fontWeight: 'medium',
      mb: 4,
      fontFamily: "'Playfair Display', serif",
      color: '#fff',
    }}
  >
    Municipal Elections
  </Typography>

  {Object.keys(candidatesByElection).length > 0 ? (
    Object.entries(candidatesByElection).map(([election, candidates]) => (
      <Box key={election} sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'medium',
            mb: 2,
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            textTransform: 'uppercase',
            borderBottom: '2px solid #fff',
            paddingBottom: '5px',
          }}
        >
          {election}
        </Typography>
        <Grid container spacing={4}>
          {candidates.map((candidate, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: '10px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                  },
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }}
                elevation={0}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: '#333' }}
                  >
                    {candidate.name}
                  </Typography>
                  <Chip
                    label={candidate.party}
                    color={candidate.party === 'Democratic' ? 'primary' : 'secondary'}
                    size="small"
                    sx={{ mb: 2, fontFamily: "'Roboto', sans-serif" }}
                  />
                  <Link
                    href={candidate.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'underline',
                      fontFamily: "'Roboto', sans-serif",
                      display: 'block',
                      mt: 2,
                      fontWeight: 'bold',
                    }}
                  >
                    More Information
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    ))
  ) : (
    <Grid item xs={12}>
      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{ fontFamily: "'Roboto', sans-serif", color: '#fff' }}
      >
        No municipal candidates found for the provided address.
      </Typography>
    </Grid>
  )}
</Box>
<Divider sx={{ my: 5 }} />
<Box sx={{ marginTop: '50px' }}>
  <Typography variant="h4" gutterBottom sx={{ color: '#fff', fontFamily: "'Playfair Display', serif" }}>
    Demographic Information
  </Typography>
  {demographics.length > 0 ? (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '400px' }}>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Playfair Display', serif" }}>Population</Typography>
          <ResponsiveContainer width="100%" height="90%" >
            <BarChart
              data={demographics.filter(item => item.label === 'Population').map(item => ({
                name: item.label,
                [county]: parseInt(item.value.split(', ')[0].replace(/,/g, '')),
                [fullStateName]: parseInt(item.value.split(', ')[1].replace(/,/g, ''))
              }))}
              margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={county} fill="#140a35" />
              <Bar dataKey={fullStateName} fill="#f8b231" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '400px' }}>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Playfair Display', serif" }}>Land Area (sq mi)</Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={demographics.filter(item => item.label === 'Land area (sq mi)').map(item => ({
                name: item.label,
                [county]: parseFloat(item.value.split(', ')[0]),
                [fullStateName]: parseFloat(item.value.split(', ')[1]) * 1000
              }))}
              margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={county} fill="#140a35" />
              <Bar dataKey={fullStateName} fill="#f8b231" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2, height: '500px' }}>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Playfair Display', serif" }}>Racial and Ethnic Composition (%)</Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={demographics.filter(item => ['White', 'Black/African American', 'Asian', 'Native American', 'Pacific Islander', 'Two or more', 'Hispanic/Latino'].includes(item.label)).map(item => ({
                name: item.label,
                [county]: parseFloat(item.value.split(', ')[0]),
                [fullStateName]: parseFloat(item.value.split(', ')[1])
              }))}
              layout="vertical"
              margin={{ top: 20, right: 20, bottom: 50, left: 70 }}
            >
              <XAxis type="number" unit="%" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey={county} fill="#140a35" />
              <Bar dataKey={fullStateName} fill="#f8b231" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '400px' }}>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Playfair Display', serif" }}>Education (%)</Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={demographics.filter(item => ['High school graduation rate', 'College graduation rate'].includes(item.label)).map(item => ({
                name: item.label,
                [county]: parseFloat(item.value.split(', ')[0]),
                [fullStateName]: parseFloat(item.value.split(', ')[1])
              }))}
              margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
            >
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey={county} fill="#140a35" />
              <Bar dataKey={fullStateName} fill="#f8b231" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '400px' }}>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Playfair Display', serif" }}>Median Household Income ($)</Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={demographics.filter(item => item.label === 'Median household income').map(item => ({
                name: item.label,
                [county]: parseInt(item.value.split(', ')[0].replace(/[^0-9]/g, '')),
                [fullStateName]: parseInt(item.value.split(', ')[1].replace(/[^0-9]/g, ''))
              }))}
              margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey={county} fill="#140a35" />
              <Bar dataKey={fullStateName} fill="#f8b231" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '400px' }}>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Playfair Display', serif" }}>Persons Below Poverty Level (%)</Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={demographics.filter(item => item.label === 'Persons below poverty level').map(item => ({
                name: item.label,
                [county]: parseFloat(item.value.split(', ')[0]),
                [fullStateName]: parseFloat(item.value.split(', ')[1])
              }))}
              margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
            >
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey={county} fill="#140a35" />
              <Bar dataKey={fullStateName} fill="#f8b231" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>


    </Grid>
  ) : (
    <Typography variant="body1" color="textSecondary" sx={{ fontFamily: "'Roboto', sans-serif" }}>
      No demographic information available.
    </Typography>
  )}
</Box>


      </Container>
    </Box>
  );
};

export default LocalPage;
