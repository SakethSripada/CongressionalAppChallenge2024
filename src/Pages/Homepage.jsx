import React from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, CardMedia, CardActions } from '@mui/material';
import '../App.css';




const Homepage = () => {
  return (
    <div className = "homepage" style={{ display: 'flex', justifyContent: 'center' }}>
    <div>
    <video className="background-video" autoPlay loop muted>
      <source src="/videos/home_background.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div className="video-overlay"></div> {/* Overlay div */}
    </div>
    <div className="content-container"> {/* Container for all content */}
    
    <Container maxWidth="lg" sx={{ paddingTop: '50px' }}>
      
      <Box sx={{ textAlign: 'center', marginBottom: '50px' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to the Voting App
        </Typography>
        <Typography variant="h6" color="white" paragraph>
          Stay updated with the latest election information, political news, and voting locations.
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Get Started
        </Button>
      </Box>

      

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', marginTop: '50px', marginBottom: '50px'}}>
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to Participate in the Election?
        </Typography>
        <Button variant="contained" color="secondary" size="large">
          Get Involved Now
        </Button>
      </Box>
    </Container>
    </div>
    </div>
  );
};


export default Homepage;
