import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails, CircularProgress, Grid, Paper, Table, TableHead, TableRow, TableCell, Link, TableBody, TableContainer, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { AddressContext } from '../Context/AddressContext';
import { styled } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.18)',
}));

const RepRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const RepColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(0, 1),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(3),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: 0,
    width: '50px',
    height: '4px',
    backgroundColor: theme.palette.secondary.main,
  },
}));

const StatePage = () => {
  const { address } = useContext(AddressContext);
  const [stateReps, setStateReps] = useState([]);
  const [electionData, setElectionData] = useState({ house: [], senate: [] });
  const [voterInfo, setVoterInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [municipalCandidates, setMunicipalCandidates] = useState([]);

  const civicAPIKey = process.env.REACT_APP_CIVIC_API_KEY;

  useEffect(() => {
    if (address) {
      const fetchStateReps = async () => {
        try {
          setLoading(true);
          console.log('Fetching state representatives for address:', address);

          const response = await axios.get(`https://www.googleapis.com/civicinfo/v2/representatives`, {
            params: { address, key: civicAPIKey }
          });

          console.log('State representatives response:', response.data);

          const offices = response.data.offices;
          const officials = response.data.officials;
          const state = [];

          offices.forEach((office) => {
            if (office.levels && office.levels.includes('administrativeArea1')) {
              office.officialIndices.forEach((index) => {
                const official = officials[index];
                if (official) {
                  state.push({
                    office: office.name,
                    name: official.name,
                    party: official.party || 'N/A',
                    phone: official.phones ? official.phones[0] : 'N/A',
                    website: official.urls ? official.urls[0] : 'N/A',
                  });
                }
              });
            }
          });

          console.log('Extracted state representatives:', state);
          setStateReps(state);
          setErrorMessage('');

          const { stateName, district } = extractStateAndDistrict(response.data);
          console.log('Extracted state and district:', stateName, district);
          fetchElectionData(stateName, district);
        } catch (error) {
          console.error('Error fetching state representatives:', error);
          setErrorMessage('Error fetching state representatives. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchStateReps();
    }
  }, [address, civicAPIKey]);

  const extractStateAndDistrict = (data) => {
    const divisions = data.divisions;
    let stateName = null;
    let district = null;

    Object.keys(divisions).forEach((divisionId) => {
      if (divisionId.includes('state:') && divisionId.includes('cd:')) {
        const stateDivision = divisions[divisionId].name;
        stateName = stateDivision.slice(0, stateDivision.indexOf("'"));
        const districtMatch = stateDivision.match(/\d+\w{2}/);
        district = districtMatch ? districtMatch[0] : null;
        console.log('State Name:', stateName);
        console.log('District:', district);
      }
    });

    return { stateName, district };
  };

  const fetchElectionData = async (stateName, district) => {
    try {
      console.log('Fetching election data for:', stateName, 'District:', district);
      if (!stateName || !district) {
        console.error('Invalid state or district:', stateName, district);
        setErrorMessage('State or district is not defined.');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/elections', {
        params: { state: stateName, district: district }
      });

      console.log('Election data response:', response.data);

      const { houseCandidates, senateCandidates, voterInfo } = response.data;

      const cleanedHouseCandidates = houseCandidates.map(candidate => ({
        ...candidate,
        party: candidate.party.slice(-2, -1),
        link: candidate.link.replace('https://ballotpedia.org', '')
      }));

      const cleanedSenateCandidates = senateCandidates.map(candidate => ({
        ...candidate,
        party: candidate.party.slice(-2, -1),
        link: candidate.link.replace('https://ballotpedia.org', '')
      }));

      setElectionData({
        house: cleanedHouseCandidates,
        senate: cleanedSenateCandidates,
      });
      setVoterInfo(voterInfo);

      console.log('Cleaned House Candidates:', cleanedHouseCandidates);
      console.log('Cleaned Senate Candidates:', cleanedSenateCandidates);
      console.log('Voter Information:', voterInfo);
    } catch (error) {
      console.error('Error fetching election data:', error);
      setErrorMessage('Failed to fetch election data. Please check your input.');
    }
  };

  const mapPartyToFullName = (partyAbbreviation) => {
    switch (partyAbbreviation) {
      case 'R':
        return 'Republican';
      case 'D':
        return 'Democrat';
      default:
        return partyAbbreviation;
    }
  };

  const formatCandidate = (name, party) => {
    const fullPartyName = mapPartyToFullName(party);
    return `${name} (${fullPartyName})`;
  };

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
          //filter: 'blur(2px)',
          opacity: '0.9'
        }}
      >
        <source src="/videos/state_background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Container maxWidth="lg" sx={{ py: 8, pt: 10, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', marginBottom: '30px' }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 900, color: '#333', fontFamily: "'Playfair Display', serif", fontSize: { xs: '3rem', md: '4.5rem' }, textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
            State Elections
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{ color: 'rgba(0,0,0,0.7)', fontFamily: "'Roboto', sans-serif", fontWeight: 300 }}>
            Explore the latest information and resources for state elections.
          </Typography>
        </Box>

        <StyledPaper>
          <SectionTitle variant="h4">
            <PersonIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
            Your State Representatives
          </SectionTitle>
          {loading ? (
            <CircularProgress />
          ) : stateReps.length > 0 ? (
            stateReps.map((rep, index) => (
              <RepRow key={index}>
                <RepColumn>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>{rep.name}</Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>{rep.party}</Typography>
                </RepColumn>
                <RepColumn>
                  <Typography variant="body1" sx={{ color: '#444' }}>{rep.office}</Typography>
                </RepColumn>
                <RepColumn>
                  <Typography variant="body2" sx={{ color: '#666' }}>Phone: {rep.phone}</Typography>
                  {rep.website && (
                    <Typography variant="body2">
                      <a href={rep.website} target="_blank" rel="noopener noreferrer" style={{ color: '#1a73e8', textDecoration: 'none' }}>Official Website</a>
                    </Typography>
                  )}
                </RepColumn>
              </RepRow>
            ))
          ) : (
            <Typography variant="body1" sx={{ color: '#666' }}>
              No state representatives found for the provided address.
            </Typography>
          )}
        </StyledPaper>


          <Grid item xs={12} md={6}>
            <StyledPaper>
              <SectionTitle variant="h4">
                <NewspaperIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                State Election News
              </SectionTitle>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[
                  { title: 'Election Law Changes', date: 'August 1, 2023' },
                  { title: 'Gubernatorial Debate', date: 'September 15, 2023' },
                ].map((item, index) => (
                  <Box key={index}>
                    <Typography variant="h6" sx={{ fontWeight: 500, color: '#333', marginBottom: 1 }}>{item.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>{item.date}</Typography>
                    <Typography variant="body1" sx={{ color: '#444', marginTop: 1 }}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </Typography>
                  </Box>
                ))}
              </Box>
            </StyledPaper>
          </Grid>
        



          <StyledPaper sx={{ mt: 4, p: 4 }}>
  <SectionTitle 
    variant="h4" 
    sx={{ 
      mb: 4, 
      color: 'primary.main', 
      borderBottom: '2px solid', 
      borderColor: 'primary.main', 
      pb: 2 
    }}
  >
    Election Candidates
  </SectionTitle>

  {/* Two-Column Layout for Election Tables and Voter Info */}
  <Grid container spacing={4}>
    {/* Left Column: House and Senate Elections */}
    <Grid item xs={12} md={7}>
      {/* House Elections */}
      {electionData.house.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: 'secondary.main' }}>
            House Elections
          </Typography>
          <TableContainer component={Paper} elevation={3} sx={{ mb: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="house elections table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Candidate</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Party</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>More Info</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {electionData.house.map((candidate, index) => (
                  <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                    <TableCell component="th" scope="row" sx={{ width: '50%' }}>{candidate.name}</TableCell>
                    <TableCell sx={{ width: '20%' }}>{mapPartyToFullName(candidate.party)}</TableCell>
                    <TableCell sx={{ width: '30%' }}>
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
        </Box>
      )}

      {/* Senate Elections */}
      {electionData.senate.length > 0 && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: 'secondary.main' }}>
            Senate Elections
          </Typography>
          <TableContainer component={Paper} elevation={3} sx={{ mb: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="senate elections table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Candidate</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Party</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>More Info</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {electionData.senate.map((candidate, index) => (
                  <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                    <TableCell component="th" scope="row" sx={{ width: '50%' }}>{candidate.name}</TableCell>
                    <TableCell sx={{ width: '20%' }}>{mapPartyToFullName(candidate.party)}</TableCell>
                    <TableCell sx={{ width: '30%' }}>
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
        </Box>
      )}
    </Grid>

    {/* Right Column: Voter Information */}
    <Grid item xs={12} md={5}>
      <StyledPaper sx={{ p: 4 }}>
        <SectionTitle variant="h4" sx={{ mb: 3, color: 'primary.main', borderBottom: '2px solid', borderColor: 'primary.main', pb: 2 }}>
          Voter Information
        </SectionTitle>
        {voterInfo.length > 0 ? (
          <List>
            {voterInfo.map((info, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography component="span" variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                        {Object.keys(info)[0]}
                      </Typography>
                    }
                    secondary={
                      <Typography component="span" variant="body1" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        {Object.values(info)[0]}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < voterInfo.length - 1 && <Divider component="li" sx={{ my: 0.4 }} />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
            <Typography variant="subtitle1" color="text.secondary">
              No voter information available.
            </Typography>
          </Box>
        )}
      </StyledPaper>
    </Grid>
  </Grid>
</StyledPaper>

      </Container>
    </Box>
  );
};

export default StatePage;