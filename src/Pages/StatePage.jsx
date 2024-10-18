import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import axios from 'axios';
import { AddressContext } from '../Context/AddressContext';
import { styled } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PersonIcon from '@mui/icons-material/Person';

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

  const civicAPIKey = process.env.REACT_APP_CIVIC_API_KEY; 

  useEffect(() => {
    if (address) {
      const fetchStateReps = async () => {
        try {
          const response = await axios.get(`https://www.googleapis.com/civicinfo/v2/representatives`, {
            params: { address, key: civicAPIKey }
          });

          const offices = response.data.offices;
          const officials = response.data.officials;
          const state = [];

          offices.forEach((office) => {
            if (office.levels && office.levels.includes('administrativeArea1')) {  
              office.officialIndices.forEach((index) => {
                const official = officials[index];
                state.push({
                  office: office.name,
                  name: official.name,
                  party: official.party || 'N/A',
                  phone: official.phones ? official.phones[0] : 'N/A',
                  website: official.urls ? official.urls[0] : 'N/A'
                });
              });
            }
          });

          setStateReps(state);
        } catch (error) {
          console.error('Error fetching state representatives:', error);
        }
      };

      fetchStateReps();
    }
  }, [address, civicAPIKey]);

  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, rgba(255, 102, 102, 0.5), rgba(255, 255, 255, 0.5), rgba(102, 153, 255, 0.5))',
        minHeight: '100vh',
        py: 8,
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 8, pt: 10 }}>
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', marginBottom: '50px' }}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 900, 
              color: '#333',
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '3rem', md: '4.5rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            State Elections
          </Typography>
          <Typography 
            variant="h5" 
            sx={{
              color: 'rgba(0,0,0,0.7)',
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 300,
            }}
          >
            Explore the latest information and resources for state elections.
          </Typography>
        </Box>

        {/* State Representatives Section */}
        <StyledPaper>
          <SectionTitle variant="h4">
            <PersonIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
            Your State Representatives
          </SectionTitle>
          {stateReps.length > 0 ? (
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

        <Grid container spacing={4}>
          {/* Important Dates Section */}
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
      </Container>
    </Box>
  );
};

export default StatePage;