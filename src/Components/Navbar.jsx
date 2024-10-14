import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Drawer, List, ListItem, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Snackbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import '../App.css';
import axios from 'axios';
import { useEffect } from 'react';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); 
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [fullAddress, setFullAddress] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [nationalReps, setNationalReps] = useState([]);
  const [stateReps, setStateReps] = useState([]);
  const [localReps, setLocalReps] = useState([]);

  const civicAPIKey = 'AIzaSyBL3WFFp76lGFGKI-flp-ilGzlY56PzCfc';  // Your provided API key

  useEffect(() => {
    if (fullAddress) {
      fetchRepresentativesInfo(fullAddress);
    }
  }, [fullAddress]);

  // Define the drawer toggle function
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen); // Toggle drawer state
  };

  const handleDialogClose = () => {
    setDialogOpen(false); // Close the dialog
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const geocodeResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
              params: {
                latlng: `${latitude},${longitude}`,
                key: civicAPIKey
              }
            });

            const results = geocodeResponse.data.results;
            if (results.length > 0) {
              const formattedAddress = results[0].formatted_address;
              if (formattedAddress) {
                setFullAddress(formattedAddress);  
                setSnackbarMessage(`Location acquired: Address ${formattedAddress}`);
                setSnackbarOpen(true);
              } else {
                throw new Error("Address not found in geolocation results.");
              }
            } else {
              throw new Error("No results found.");
            }
          } catch (error) {
            console.error('Error during reverse geocoding:', error);
            setSnackbarMessage("Unable to retrieve location. Please enter your address.");
            setSnackbarOpen(true);
            setDialogOpen(true); 
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setSnackbarMessage("Unable to retrieve location. Please enter your address.");
          setSnackbarOpen(true);
          setDialogOpen(true); 
        }
      );
    } else {
      setSnackbarMessage("Geolocation is not supported by this browser.");
      setSnackbarOpen(true);
      setDialogOpen(true); 
    }
  };

  const fetchRepresentativesInfo = async (address) => {
    try {
      const representativesResponse = await axios.get(`https://www.googleapis.com/civicinfo/v2/representatives`, {
        params: {
          address: address,
          key: civicAPIKey
        }
      });

      const offices = representativesResponse.data.offices;
      const officials = representativesResponse.data.officials;

      let national = [];
      let state = [];
      let local = [];

      offices.forEach((office) => {
        office.officialIndices.forEach((officialIndex) => {
          const official = officials[officialIndex];
          const officialData = {
            office: office.name,
            name: official.name,
            party: official.party || 'N/A',
            phone: official.phones ? official.phones[0] : 'N/A',
            website: official.urls ? official.urls[0] : 'N/A',
            email: official.emails ? official.emails[0] : 'N/A'
          };

          if (office.levels.includes('country')) {
            national.push(officialData);
          } else if (office.levels.includes('administrativeArea1')) {
            state.push(officialData);
          } else if (office.levels.includes('administrativeArea2')) {
            local.push(officialData);
          }
        });
      });

      setNationalReps(national);
      setStateReps(state);
      setLocalReps(local);

      console.log("National Representatives:", national);
      console.log("State Representatives:", state);
      console.log("Local Representatives:", local);

      setSnackbarMessage("Representative information retrieved successfully.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error fetching representatives:', error);
      setSnackbarMessage("Failed to fetch representative information.");
      setSnackbarOpen(true);
    }
  };

  const handleAddressSubmit = () => {
    fetchRepresentativesInfo(fullAddress);  // Fetch representative info using entered address
    setSnackbarMessage(`Address entered: ${fullAddress}`);
    setSnackbarOpen(true);
    setDialogOpen(false);
  };

  return (
    <AppBar position="fixed" className="navbar">
      <Toolbar>
        <Box component="img" 
             src="/navbarlogo.png" 
             alt="Logo"
             sx={{ height: '60px', marginRight: '16px' }}
        />
        <Typography variant="h6" sx={{ flexGrow: 1 }} />
        
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>

        <IconButton edge="end" color="inherit" aria-label="get-location" onClick={handleLocationClick}>
          <LocationOnIcon />
        </IconButton>
        
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          sx={{
            '& .MuiDrawer-paper': {
              width: 300,
              boxSizing: 'border-box',
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          <List>
            <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>Home</ListItem>
            <ListItem button component={Link} to="/local" onClick={handleDrawerToggle}>Local</ListItem>
            <ListItem button component={Link} to="/state" onClick={handleDrawerToggle}>State</ListItem>
            <ListItem button component={Link} to="/national" onClick={handleDrawerToggle}>National</ListItem>
          </List>
        </Drawer>

        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Enter Address</DialogTitle>
          <DialogContent>
            <TextField 
              autoFocus
              margin="dense"
              label="Address"
              type="text"
              fullWidth
              placeholder="e.g. 1600 Pennsylvania Ave NW, Washington, DC 20500"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
            />
            <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
              Example: 1600 Pennsylvania Ave NW, Washington, DC 20500
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
            <Button onClick={handleAddressSubmit} color="primary">Submit</Button>
          </DialogActions>
        </Dialog>

        <Snackbar 
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          autoHideDuration={6000}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;