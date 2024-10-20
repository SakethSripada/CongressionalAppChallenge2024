import React, { useState, useContext, useEffect } from 'react';
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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AddressContext } from '../Context/AddressContext';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default, 
  padding: '0 16px', 
  boxShadow: theme.shadows[2], 
}));

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [showArrow, setShowArrow] = useState(true);

  const { setAddress } = useContext(AddressContext);
  const geocodingAPIKey = process.env.REACT_APP_GEOCODING_API_KEY;

  useEffect(() => {
    // Auto-hide the arrow after 5 seconds
    const timer = setTimeout(() => setShowArrow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleLocationClick = () => {
    setShowArrow(false); // Hide the arrow once the button is clicked
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
    if (!manualAddress) {
      setSnackbarMessage("Please enter your address. Example: 1600 Pennsylvania Ave NW, Washington, DC 20500");
    } else {
      setAddress(manualAddress);
      setSnackbarMessage(`Address entered: ${manualAddress}`);
    }
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
                    bgcolor: 'rgba(255, 255, 255, 0.1)', 
                    color: 'white', 
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
              
              <Button 
                component={Link} 
                to="/new-voters" 
                color="inherit" 
                sx={{ 
                  transition: 'background-color 0.3s, color 0.3s',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 255, 255, 0.1)', 
                    color: 'white',
                  } 
                }}
              >
                New Voters
              </Button>

            </Box>

          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            {showArrow && (
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: '50%', 
                  right: 80, 
                  transform: 'translateY(-50%)',
                  display: 'flex', 
                  alignItems: 'center' 
                }}
              >
                <ArrowForwardIcon 
                  sx={{ 
                    fontSize: 40, 
                    color: 'yellow', 
                    animation: 'bounce 1s infinite',
                    '@keyframes bounce': {
                      '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-5px)' },
                    },
                  }} 
                />
                <Typography variant="body2" sx={{ color: 'yellow', ml: 1 }}>
                  Click here
                </Typography>
              </Box>
            )}
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
            bgcolor: 'primary.main', 
            color: 'white', 
            height: '100%', 
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
                  bgcolor: 'rgba(255, 255, 255, 0.1)', 
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
                  bgcolor: 'rgba(255, 255, 255, 0.1)', 
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
                  bgcolor: 'rgba(255, 255, 255, 0.1)', 
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
                  bgcolor: 'rgba(255, 255, 255, 0.1)', 
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
          {/* Example address displayed below the input field */}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Example: 1600 Pennsylvania Ave NW, Washington, DC 20500
          </Typography>
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