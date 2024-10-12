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

      {/* Cards Section */}
      <Box>
        <Grid container spacing={4}>
          
          {/* Card 1 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x200"
                alt="Election Info"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Election Information
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Get the latest updates on upcoming elections, candidates, and results across the country.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Card 2 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x200"
                alt="Political News"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Political News
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Stay informed with the latest political news from local, state, and federal levels.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Read News</Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Card 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x200"
                alt="Voting Locations"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Find Voting Locations
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Use our tool to locate the nearest polling stations in your area for upcoming elections.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Find Locations</Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Card 4 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x200"
                alt="Voter Registration"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Register to Vote
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Make sure you're registered to vote. Our platform helps you check and update your registration.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Register</Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Card 5 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x200"
                alt="Candidate Information"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Candidate Information
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Learn more about the candidates running in the upcoming elections.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">View Candidates</Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Card 6 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x200"
                alt="Election Resources"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Election Resources
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Access resources for election preparation, including voting guides and sample ballots.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Access Resources</Button>
              </CardActions>
            </Card>
          </Grid>

        </Grid>
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
