import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Snackbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import axios from 'axios';
import { AddressContext } from '../Context/AddressContext';  // Import AddressContext

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [manualAddress, setManualAddress] = useState('');  // Manage manual input address
  
  const { setAddress } = useContext(AddressContext);  // Use setAddress from AddressContext

  const civicAPIKey = 'AIzaSyBL3WFFp76lGFGKI-flp-ilGzlY56PzCfc';  // Your provided API key

  // Get location using geolocation
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
                setAddress(formattedAddress);  // Set address in context
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
            setDialogOpen(true); // Open address dialog if geolocation fails
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

  // Handle manual address submission
  const handleAddressSubmit = () => {
    setAddress(manualAddress);  // Set the manually entered address in the context
    setSnackbarMessage(`Address entered: ${manualAddress}`);
    setSnackbarOpen(true);
    setDialogOpen(false);
  };

  return (
    <AppBar position="fixed" className="navbar">
      <Toolbar>
        <Box component="img" src="/navbarlogo.png" alt="Logo" sx={{ height: '60px', marginRight: '16px' }} />
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(!drawerOpen)}>
          <MenuIcon />
        </IconButton>
        <IconButton edge="end" color="inherit" aria-label="get-location" onClick={() => handleLocationClick()}>
          <LocationOnIcon />
        </IconButton>
        
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <List>
            <ListItem button component={Link} to="/">Home</ListItem>
            <ListItem button component={Link} to="/local">Local</ListItem>
            <ListItem button component={Link} to="/state">State</ListItem>
            <ListItem button component={Link} to="/national">National</ListItem>
          </List>
        </Drawer>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Enter Address</DialogTitle>
          <DialogContent>
            <TextField 
              autoFocus
              fullWidth
              value={manualAddress}  // Bind manualAddress to the input field
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;