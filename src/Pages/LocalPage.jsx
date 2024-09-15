import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material';

const LocalPage = () => {
  return (
    <Container maxWidth="md" sx={{ paddingTop: '50px', paddingBottom: '50px' }}>
      
      <Box sx={{ textAlign: 'center', marginBottom: '30px' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Local Elections
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Find information about upcoming local elections, candidates, and polling locations.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h4" gutterBottom>
          Upcoming Local Elections
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="City Council Election - June 15th" secondary="Candidates: John Doe, Jane Smith" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="School Board Election - July 10th" secondary="Candidates: Alice Johnson, Bob Lee" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Mayor Election - August 20th" secondary="Candidates: Chris Evans, Diana Rose" />
          </ListItem>
          <Divider />
        </List>
      </Box>

      <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
        <Typography variant="h4" gutterBottom>
          Find Your Local Polling Station
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src="https://via.placeholder.com/600x300"
            alt="Map of polling stations"
            style={{ maxWidth: '100%', borderRadius: '8px' }}
          />
        </Box>
      </Box>
      
    </Container>
  );
};

export default LocalPage;
