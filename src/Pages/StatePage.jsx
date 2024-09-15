import React from 'react';
import { Container, Typography, Box, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StatePage = () => {
  return (
    <Container maxWidth="lg" sx={{ paddingTop: '50px', paddingBottom: '50px' }}>
      
      <Box sx={{ textAlign: 'center', marginBottom: '30px' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          State Elections
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Explore the latest information and resources for state elections.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            State Election News
          </Typography>
          <Box>
            <Typography variant="body1" paragraph>
              Stay informed with the latest news about state-level elections. Get updates on candidates, voting laws, and more.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              - Election Law Changes: August 1, 2023 <br/>
              - Gubernatorial Debate: September 15, 2023
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Important Dates
          </Typography>
          <Box>
            <Typography variant="body1" paragraph>
              Mark your calendar with these important election dates:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              - Voter Registration Deadline: October 10, 2023 <br/>
              - Early Voting Starts: October 25, 2023 <br/>
              - Election Day: November 8, 2023
            </Typography>
          </Box>
        </Grid>

      </Grid>

      <Box sx={{ marginTop: '50px' }}>
        <Typography variant="h4" gutterBottom>
          State Election Guides
        </Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How to Register to Vote in State Elections</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              To register to vote in your state, follow these steps...
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Where to Vote</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              You can find your nearest polling station by visiting the official state election website or using our polling station locator.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      
    </Container>
  );
};

export default StatePage;
