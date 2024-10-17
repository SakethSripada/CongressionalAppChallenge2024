import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import { AddressContext } from '../Context/AddressContext';  
import axios from 'axios';

const LocalPage = () => {
  const { address } = useContext(AddressContext);  
  const [localReps, setLocalReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const civicAPIKey = process.env.REACT_APP_CIVIC_API_KEY;  

  useEffect(() => {
    if (address) {
      const fetchLocalReps = async () => {
        setLoading(true); // Set loading to true before fetching data
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
          setErrorMessage('');
        } catch (error) {
          console.error('Error fetching local representatives:', error);
          setErrorMessage('Error fetching local representatives. Please try again later.');
        } finally {
          setLoading(false); // Set loading to false after fetching data
        }
      };

      fetchLocalReps();
    }
  }, [address, civicAPIKey]);

  return (
    <Container maxWidth="md" sx={{ paddingTop: '50px', paddingBottom: '50px' }}>
      <Box sx={{ textAlign: 'center', marginBottom: '30px' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Local Elections
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Find information about your local representatives and polling stations.
        </Typography>
      </Box>

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ textAlign: 'center', marginBottom: '50px' }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Typography variant="body1" color="error">
          {errorMessage}
        </Typography>
      )}

      {/* Local Representatives Section */}
      <Box>
        <Typography variant="h4" gutterBottom>
          Your Local Representatives
        </Typography>
        <List>
          {localReps.length > 0 ? (
            localReps.map((rep, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${rep.name} (${rep.party})`}
                    secondary={`Office: ${rep.office} | Phone: ${rep.phone}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No local representatives found for the provided address.
            </Typography>
          )}
        </List>
      </Box>

      {/* Polling Station Section */}
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