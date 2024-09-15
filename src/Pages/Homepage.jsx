import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

const Homepage = () => {
  return (
    <Container>
      <Box sx={{ textAlign: 'center', paddingTop: '50px' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Voting App
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Stay updated with the latest election information, political news, and voting locations.
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default Homepage;
