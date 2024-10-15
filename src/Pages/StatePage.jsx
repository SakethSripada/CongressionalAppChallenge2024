import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { AddressContext } from '../Context/AddressContext';  // Import the AddressContext

const StatePage = () => {
  const { address } = useContext(AddressContext);  // Access the address from context
  const [stateReps, setStateReps] = useState([]);

  const civicAPIKey = 'AIzaSyBL3WFFp76lGFGKI-flp-ilGzlY56PzCfc';  // Insert your Civic API key here

  // Fetch State Representatives
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
            if (office.levels && office.levels.includes('administrativeArea1')) {  // State level
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
  }, [address]);

  return (
    <Container maxWidth="lg" sx={{ paddingTop: '50px', paddingBottom: '50px' }}>
      
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', marginBottom: '30px' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          State Elections
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Explore the latest information and resources for state elections.
        </Typography>
      </Box>

      {/* State Representatives Section */}
      <Box sx={{ marginBottom: '50px' }}>
        <Typography variant="h4" gutterBottom>
          Your State Representatives
        </Typography>
        {stateReps.length > 0 ? (
          stateReps.map((rep, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{`${rep.name} (${rep.party}) - ${rep.office}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Phone: {rep.phone || 'N/A'} <br />
                  Website: {rep.website ? (
                    <a href={rep.website} target="_blank" rel="noopener noreferrer">
                      {rep.website}
                    </a>
                  ) : 'N/A'}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No state representatives found for the provided address.
          </Typography>
        )}
      </Box>

      {/* State Election News and Important Dates */}
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

      {/* Election Guides Section */}
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
