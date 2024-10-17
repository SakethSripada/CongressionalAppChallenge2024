import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Divider, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
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
        setLoading(true); // Set loading to true before fetching data
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

          // Extract county and state for municipal candidates
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
          setLoading(false); // Set loading to false after fetching data
        }
      };

      fetchLocalReps();
    }
  }, [address, civicAPIKey]);

  const extractStateAndCounty = (data) => {
    const divisions = data.divisions;
    let county = null;
    let stateAbbreviation = null;
  
    // Check for county and state information
    Object.keys(divisions).forEach((divisionId) => {
      if (divisionId.includes('county:')) {
        county = divisions[divisionId].name.split(' ').slice(0, 2).join(' '); // Get first two words for county
      } else if (divisionId.includes('state:')) {
        stateAbbreviation = divisionId.split(':')[2]; // Extract the abbreviation (e.g., 'tx')
      }
    });
  
    // Get the state abbreviation from normalizedInput
    const normalizedStateAbbreviation = data.normalizedInput.state; // Extract state abbreviation directly
  
    // Map the abbreviation to the full state name
    const fullStateName = stateAbbreviationMap[normalizedStateAbbreviation.toUpperCase()] || 'Unknown State';
  
    // Set the county and full state name in the state
    setCounty(county);
    setFullStateName(fullStateName);
  
    console.log('Extracted County:', county);
    console.log('Extracted State:', fullStateName);
  
    return { county, state: fullStateName };
  };  

  const fetchMunicipalCandidates = async (county, state) => {
    try {
      const countyTrimmed = county.split(' ').slice(0, 2).join(' '); // Trim to first two words
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

  // Group municipal candidates by election title
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
    <Container maxWidth="md" sx={{ paddingTop: '50px', paddingBottom: '50px' }}>
      <Box sx={{ textAlign: 'center', marginBottom: '30px' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Local Elections
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Find information about your local representatives and polling stations.
        </Typography>
      </Box>

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ textAlign: 'center', marginBottom: '50px' }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Typography variant="body1" color="error">
          {errorMessage}
        </Typography>
      )}

      {/* Local Representatives Section */}
      <Box>
        <Typography variant="h4" gutterBottom>
          Your Local Representatives
        </Typography>
        <List>
          {localReps.length > 0 ? (
            localReps.map((rep, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${rep.name} (${rep.party})`}
                    secondary={`Office: ${rep.office} | Phone: ${rep.phone}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No local representatives found for the provided address.
            </Typography>
          )}
        </List>
      </Box>

      {/* Municipal Candidates Section */}
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
                  {candidate.name} ({candidate.party}) - <a href={candidate.link} target="_blank" rel="noopener noreferrer">More Info</a>
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

      {/* Demographics Section */}
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
  );
};

export default LocalPage;