import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Drawer, List, ListItem, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Snackbar, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [zipCode, setZipCode] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSnackbarMessage(`Location acquired: Latitude ${latitude}, Longitude ${longitude}`);
          setSnackbarOpen(true);
        },
        (error) => {
          console.error(error);
          setSnackbarMessage("Unable to retrieve location. Please enter your zip code.");
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

  const handleZipSubmit = () => {
    setSnackbarMessage(`Zip Code entered: ${zipCode}`);
    setSnackbarOpen(true);
    setDialogOpen(false);
  };

  return (
    <AppBar position="fixed" className="navbar">
      <Toolbar>
      <Box component="img" 
             src="/navbarlogo.png" // Update the path to your logo
             alt="Logo"
             sx={{ height: '60px', marginRight: '16px' }}
             //sx={{ height: '50px', marginRight: '16px' }} // Adjust height as needed
        />
        <Typography fontFamily = "sans-serif" variant="h6" sx={{ flexGrow: 1 }}>
         
        </Typography>
        
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
      width: 300, // Change this value to increase width
      boxSizing: 'border-box',
      backgroundColor: '#f0f0f0', // Example background color
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
          <DialogTitle>Enter Zip Code</DialogTitle>
          <DialogContent>
            <TextField 
              autoFocus
              margin="dense"
              label="Zip Code"
              type="text"
              fullWidth
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
            <Button onClick={handleZipSubmit} color="primary">Submit</Button>
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
