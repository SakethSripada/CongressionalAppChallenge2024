import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, Chip, Link, Divider } from '@mui/material';
import { AddressContext } from '../Context/AddressContext';  
import axios from 'axios';

const LocalPage = () => {
  const { address } = useContext(AddressContext);  
  const [localReps, setLocalReps] = useState([]);

  const civicAPIKey = process.env.REACT_APP_CIVIC_API_KEY; 

  useEffect(() => {
    if (address) {
      const fetchLocalReps = async () => {
        try {
          const response = await axios.get(`https://www.googleapis.com/civicinfo/v2/representatives`, {
            params: { address, key: civicAPIKey }
          });

          const offices = response.data.offices;
          const officials = response.data.officials;
          const local = [];

          offices.forEach((office) => {
            if (office.levels && office.levels.includes('administrativeArea2')) { 
              office.officialIndices.forEach((index) => {
                const official = officials[index];
                local.push({
                  office: office.name,
                  name: official.name,
                  party: official.party || 'N/A',
                  phone: official.phones ? official.phones[0] : 'N/A',
                  website: official.urls ? official.urls[0] : 'N/A'
                });
              });
            }
          });

          setLocalReps(local);
        } catch (error) {
          console.error('Error fetching local representatives:', error);
        }
      };

      fetchLocalReps();
    }
  }, [address, civicAPIKey]);

  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(to right, rgba(255, 102, 102, 0.5), rgba(255, 255, 255, 0.5), rgba(102, 153, 255, 0.5))', // Lighter background gradient        
        minHeight: '100vh', 
        py: 8 
      }}
    >
      <Container maxWidth="lg" sx={{ py: 8, pt: 10 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ 
              fontWeight: 900, 
              color: '#333',
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '3rem', md: '4.5rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}>
          Local Elections
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{
              color: 'rgba(0,0,0,0.7)',
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 300,
            }}>
          Find information about your local representatives and polling stations.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'medium', mb: 4, fontFamily: "'Playfair Display', serif" }}>
            Your Local Representatives
          </Typography>
          <Grid container spacing={4}>
            {localReps.length > 0 ? (
              localReps.map((rep, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{
                    borderRadius: '10px', 
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Softer shadow
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)', // Subtle lift on hover
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                    }
                  }} elevation={0}>
                    <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
                        {rep.name}
                      </Typography>
                      <Chip label={rep.party} color="secondary" size="small" sx={{ mb: 2, fontFamily: "'Roboto', sans-serif" }} />
                      <Typography color="text.secondary" gutterBottom sx={{ fontFamily: "'Roboto', sans-serif" }}>
                        {rep.office}
                      </Typography>
                      <Typography variant="body2" paragraph sx={{ fontFamily: "'Roboto', sans-serif" }}>
                        Phone: {rep.phone}
                      </Typography>
                      <Link href={rep.website} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main', textDecoration: 'underline', fontFamily: "'Roboto', sans-serif" }}>
                        Official Website
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ fontFamily: "'Roboto', sans-serif" }}>
                  No local representatives found for the provided address.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        <Divider sx={{ my: 8 }} />

        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'medium', mb: 4, fontFamily: "'Playfair Display', serif" }}>
            Find Your Local Polling Station
          </Typography>
          <Card elevation={3} sx={{ borderRadius: '10px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src="https://via.placeholder.com/800x400"
                  alt="Map of polling stations"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default LocalPage;