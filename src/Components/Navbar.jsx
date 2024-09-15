import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Politics Platform
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/link1">Link 1</Button>
          <Button color="inherit" component={Link} to="/link2">Link 2</Button>
          <Button color="inherit" component={Link} to="/link3">Link 3</Button>
          <Button color="inherit" component={Link} to="/link4">Link 4</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
