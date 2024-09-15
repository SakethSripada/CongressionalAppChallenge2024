import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false); 
  const [zipCode, setZipCode] = useState('');
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Latitude:", latitude, "Longitude:", longitude);
          alert(`Location acquired: Latitude ${latitude}, Longitude ${longitude}`);
        },
        (error) => {
          console.error(error);
          alert("Unable to retrieve location. Please enter your zip code.");
          setOpen(true);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setOpen(true);
    }
  };

  // Zip code input handler
  const handleZipCodeChange = (event) => {
    setZipCode(event.target.value);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleZipSubmit = () => {
    alert(`Zip Code entered: ${zipCode}`);
    setOpen(false);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Politics Platform
        </Typography>

        <IconButton 
          edge="start" 
          color="inherit" 
          aria-label="menu" 
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>

        <Menu
          id="nav-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose} component={Link} to="/link1">Link 1</MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to="/link2">Link 2</MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to="/link3">Link 3</MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to="/link4">Link 4</MenuItem>
        </Menu>

        <IconButton 
          edge="end" 
          color="inherit" 
          aria-label="get-location" 
          onClick={handleLocationClick}
        >
          <LocationOnIcon />
        </IconButton>

        <Dialog open={open} onClose={handleDialogClose}>
          <DialogTitle>Enter Zip Code</DialogTitle>
          <DialogContent>
            <TextField 
              autoFocus
              margin="dense"
              label="Zip Code"
              type="text"
              fullWidth
              value={zipCode}
              onChange={handleZipCodeChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleZipSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
