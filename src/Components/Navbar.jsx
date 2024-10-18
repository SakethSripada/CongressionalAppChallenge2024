import React, { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Snackbar,
  Container,
  Box,
  Divider,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AddressContext } from '../Context/AddressContext';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default, // Set a background color for the middle section
  padding: '0 16px', // Add some padding
  boxShadow: theme.shadows[2], // Optional: add a shadow for a floating effect
}));

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [manualAddress, setManualAddress] = useState('');

  const { setAddress } = useContext(AddressContext);
  const geocodingAPIKey = process.env.REACT_APP_GEOCODING_API_KEY;

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const geocodeResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
              params: {
                latlng: `${latitude},${longitude}`,
                key: geocodingAPIKey,
              },
            });

            const results = geocodeResponse.data.results;
            if (results.length > 0) {
              const formattedAddress = results[0].formatted_address;
              if (formattedAddress) {
                setAddress(formattedAddress);
                setSnackbarMessage(`Location acquired: ${formattedAddress}`);
                setSnackbarOpen(true);
              } else {
                throw new Error("Address not found.");
              }
            } else {
              throw new Error("No results found.");
            }
          } catch (error) {
            setSnackbarMessage("Error retrieving location.");
            setSnackbarOpen(true);
            setDialogOpen(true); 
          }
        },
        () => {
          setSnackbarMessage("Geolocation unavailable. Please enter address.");
          setSnackbarOpen(true);
          setDialogOpen(true);
        }
      );
    } else {
      setSnackbarMessage("Geolocation is not supported.");
      setSnackbarOpen(true);
      setDialogOpen(true);
    }
  };

  const handleAddressSubmit = () => {
    setAddress(manualAddress);
    setSnackbarMessage(`Address entered: ${manualAddress}`);
    setSnackbarOpen(true);
    setDialogOpen(false);
  };

  return (
    <AppBar position="fixed" sx={{ boxShadow: 0, bgcolor: 'transparent', mt: 1.5, overflow: 'hidden'}}>
      <Container maxWidth="lg">
        <StyledToolbar sx={{borderRadius: '18px'}}>
          <Box sx={{ display: 'flex', alignItems: 'center'}}>
            <Box component="img" src="/navbarlogo.png" alt="Logo" sx={{ height: '60px', marginRight: 2 }} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                component={Link} 
                to="/" 
                color="inherit" 
                sx={{ 
                  transition: 'background-color 0.3s, color 0.3s',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 255, 255, 0.1)', // Light background on hover
                    color: 'white', // Change text color on hover
                  } 
                }}
              >
                Home
              </Button>
              <Button 
                component={Link} 
                to="/local" 
                color="inherit" 
                sx={{ 
                  transition: 'background-color 0.3s, color 0.3s',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 255, 255, 0.1)', 
                    color: 'white',
                  } 
                }}
              >
                Local
              </Button>
              <Button 
                component={Link} 
                to="/state" 
                color="inherit" 
                sx={{ 
                  transition: 'background-color 0.3s, color 0.3s',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 255, 255, 0.1)', 
                    color: 'white',
                  } 
                }}
              >
                State
              </Button>
              <Button 
                component={Link} 
                to="/national" 
                color="inherit" 
                sx={{ 
                  transition: 'background-color 0.3s, color 0.3s',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 255, 255, 0.1)', 
                    color: 'white',
                  } 
                }}
              >
                National
              </Button>
            </Box>

          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={handleLocationClick}>
              <LocationOnIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </StyledToolbar>
      </Container>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box 
          sx={{ 
            width: 250, 
            bgcolor: 'primary.main', // Set background color to primary color
            color: 'white', // Optional: Change text color to white
            height: '100%', // Make sure it takes full height
          }}
        >
          <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}>
            <Box component="img" src="/navbarlogo.png" alt="Logo" sx={{ height: '60px' }} />
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
            <CloseRoundedIcon />
          </IconButton>
          <Divider sx={{ backgroundColor: 'white' }} />
          <List>
            <ListItem 
              button 
              component={Link} 
              to="/" 
              sx={{ 
                color: 'white', 
                '&:hover': { 
                  bgcolor: 'rgba(255, 255, 255, 0.1)', // Change this to your desired hover color
                },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold', letterSpacing: '0.5px' }}>
                Home
              </Typography>

            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/local" 
              sx={{ 
                color: 'white', 
                '&:hover': { 
                  bgcolor: 'rgba(255, 255, 255, 0.1)', // Change this to your desired hover color
                },
              }}
            >
              Local
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/state" 
              sx={{ 
                color: 'white', 
                '&:hover': { 
                  bgcolor: 'rgba(255, 255, 255, 0.1)', // Change this to your desired hover color
                },
              }}
            >
              State
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/national" 
              sx={{ 
                color: 'white', 
                '&:hover': { 
                  bgcolor: 'rgba(255, 255, 255, 0.1)', // Change this to your desired hover color
                },
              }}
            >
              National
            </ListItem>
          </List>
        </Box>
      </Drawer>


      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Enter Address</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            label="Address"
            placeholder="e.g. 1600 Pennsylvania Ave NW, Washington, DC 20500"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAddressSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        autoHideDuration={6000}
      />
    </AppBar>
  );
};

export default Navbar;
