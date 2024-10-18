import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails, CircularProgress, Grid, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { AddressContext } from '../Context/AddressContext';
import { styled } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PersonIcon from '@mui/icons-material/Person';

// Styled components
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
        background: 'linear-gradient(to right, rgba(255, 102, 102, 0.5), rgba(255, 255, 255, 0.5), rgba(102, 153, 255, 0.5))',
        minHeight: '100vh',
        py: 8,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', marginBottom: '30px' }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 900, color: '#333', fontFamily: "'Playfair Display', serif", fontSize: { xs: '3rem', md: '4.5rem' }, textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
            State Elections
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{ color: 'rgba(0,0,0,0.7)', fontFamily: "'Roboto', sans-serif", fontWeight: 300 }}>
            Explore the latest information and resources for state elections.
          </Typography>
        </Box>

        {/* State Representatives Section */}
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

        {/* Important Dates Section */}
        <Grid container spacing={4} sx={{ marginTop: '50px' }}>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <SectionTitle variant="h4">
                <EventIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                Important Dates
              </SectionTitle>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'Voter Registration Deadline', date: 'October 10, 2023' },
                  { label: 'Early Voting Starts', date: 'October 25, 2023' },
                  { label: 'Election Day', date: 'November 8, 2023' },
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.03)' : 'transparent', borderRadius: '4px' }}>
                    <Typography variant="body1" sx={{ color: '#444' }}>{item.label}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a73e8' }}>{item.date}</Typography>
                  </Box>
                ))}
              </Box>
            </StyledPaper>
          </Grid>

          {/* State Election News */}
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
        </Grid>

        {/* Election Guides Section */}
        <StyledPaper sx={{ mt: 4 }}>
          <SectionTitle variant="h4">
            <HowToVoteIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
            State Election Guides
          </SectionTitle>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { title: 'How to Register to Vote in State Elections', content: 'To register to vote in your state, follow these steps...' },
              { title: 'Where to Vote', content: 'You can find your nearest polling station by visiting the official state election website or using our polling station locator.' },
            ].map((item, index) => (
              <Box key={index}>
                <Typography variant="h5" sx={{ fontWeight: 500, color: '#333', marginBottom: 2 }}>{item.title}</Typography>
                <Typography variant="body1" sx={{ color: '#444' }}>{item.content}</Typography>
              </Box>
            ))}
          </Box>
        </StyledPaper>

        {/* Election Candidates Section */}
        <StyledPaper sx={{ mt: 4 }}>
          <SectionTitle variant="h4">
            Election Candidates
          </SectionTitle>
          <Box>
            {electionData.house.length > 0 && (
              <Box>
                <Typography variant="h6">House Elections</Typography>
                {electionData.house.map((candidate, index) => (
                  <Typography key={index}>
                    {formatCandidate(candidate.name, candidate.party)} - <a href={candidate.link} target="_blank" rel="noopener noreferrer">More Info</a>
                  </Typography>
                ))}
              </Box>
            )}

            {electionData.senate.length > 0 && (
              <Box>
                <Typography variant="h6">Senate Elections</Typography>
                {electionData.senate.map((candidate, index) => (
                  <Typography key={index}>
                    {formatCandidate(candidate.name, candidate.party)} - <a href={candidate.link} target="_blank" rel="noopener noreferrer">More Info</a>
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </StyledPaper>

        {/* Voter Information Section */}
        <StyledPaper sx={{ mt: 4 }}>
          <SectionTitle variant="h4">
            Voter Information
          </SectionTitle>
          {voterInfo.length > 0 ? (
            voterInfo.map((info, index) => (
              <Typography key={index}>
                {Object.keys(info)[0]}: {Object.values(info)[0]}
              </Typography>
            ))
          ) : (
            <Typography>No voter information available.</Typography>
          )}
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default StatePage;