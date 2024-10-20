import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from '@mui/material/styles/styled';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.18)',
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

const NewVotersPage = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, rgba(255, 102, 102, 0.5), rgba(255, 255, 255, 0.5), rgba(102, 153, 255, 0.5))',
        minHeight: '100vh',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', marginBottom: '30px', marginTop: '70px' }}>
          <Typography
            variant="h2"
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
            New to Voting?
            <br></br>
          </Typography>
          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 900,
              color: '#333',
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '1rem', md: '2rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Here's What You Need to Know
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ color: 'rgba(0,0,0,0.7)', fontFamily: "'Roboto', sans-serif", fontWeight: 300 }}
          >
            Voting is your chance to shape the future. It affects policies on healthcare, education, rights, and more.
          </Typography>
        </Box>

        {/* Section 1 - Check Your Eligibility */}
        <StyledPaper>
          <SectionTitle variant="h4">
            1. Check Your Eligibility
          </SectionTitle>
          <Typography variant="body1">
            - You must be a U.S. citizen, at least 18 years old, and a resident of your state.
            <br />
            - Not sure? Quickly check your eligibility through{' '}
            <a href="https://www.canivote.org" target="_blank" rel="noopener noreferrer" style={{ color: '#1a73e8' }}>
              CanIVote.org
            </a>.
          </Typography>
        </StyledPaper>

        {/* Section 2 - Register to Vote */}
        <StyledPaper>
          <SectionTitle variant="h4">
            2. Register to Vote
          </SectionTitle>
          <Typography variant="body1">
            - Without registration, you can’t vote. Register online, by mail, or in person.
            <br />
            - Be sure to meet your state's registration deadline.
          </Typography>
        </StyledPaper>

        {/* Section 3 - Find Your Polling Place */}
        <StyledPaper>
          <SectionTitle variant="h4">
            3. Find Your Polling Place
          </SectionTitle>
          <Typography variant="body1">
            - Poll locations vary by state and county. Check yours <strong>before</strong> Election Day.
            <br />
            - Also, check if you qualify for early voting or mail-in ballots.
          </Typography>
        </StyledPaper>

        {/* Section 4 - Research Candidates & Issues */}
        <StyledPaper>
          <SectionTitle variant="h4">
            4. Research the Candidates & Issues
          </SectionTitle>
          <Typography variant="body1">
            - Learn about candidates, ballot measures, and important issues before you go to the polls.
            <br />
            - Make an informed choice that aligns with your values.
          </Typography>
        </StyledPaper>

        {/* Section 5 - Prepare for Election Day */}
        <StyledPaper>
          <SectionTitle variant="h4">
            5. Prepare for Election Day
          </SectionTitle>
          <Typography variant="body1">
            - Know your polling place and its hours.
            <br />
            - Bring any required ID (check state-specific requirements).
            <br />
            - Plan transportation if needed.
          </Typography>
        </StyledPaper>

        {/* Section 6 - Vote */}
        <StyledPaper>
          <SectionTitle variant="h4">
            6. Vote!
          </SectionTitle>
          <Typography variant="body1">
            - Take your time and double-check your ballot before submitting it.
            <br />
            - Your vote helps shape the future of your community and country.
          </Typography>
        </StyledPaper>

        {/* Helpful Resources Section */}
        <StyledPaper sx={{ mt: 4 }}>
          <SectionTitle variant="h4">
            Helpful Resources
          </SectionTitle>
          <Box>
            <Typography variant="body1">
              -{' '}
              <a href="https://www.canivote.org" target="_blank" rel="noopener noreferrer" style={{ color: '#1a73e8' }}>
                CanIVote.org
              </a>{' '}
              – Check registration, find your polling place, and learn about voting laws.
            </Typography>
            <Typography variant="body1">
              -{' '}
              <a href="https://www.vote.org" target="_blank" rel="noopener noreferrer" style={{ color: '#1a73e8' }}>
                Vote.org
              </a>{' '}
              – Register, request absentee ballots, and track voting deadlines.
            </Typography>
            <Typography variant="body1">
              -{' '}
              <a href="https://www.ballotpedia.org" target="_blank" rel="noopener noreferrer" style={{ color: '#1a73e8' }}>
                Ballotpedia
              </a>{' '}
              – Find unbiased information on candidates and ballot measures.
            </Typography>
          </Box>
        </StyledPaper>

        {/* Back to Home Button */}
        <Box sx={{ marginTop: '50px', textAlign: 'center' }}>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            sx={{ padding: '10px 20px', marginTop: '20px' }}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NewVotersPage;
