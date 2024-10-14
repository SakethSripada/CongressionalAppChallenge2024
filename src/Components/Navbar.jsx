import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Drawer, List, ListItem, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Snackbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link } from 'react-router-dom';
import '../App.css';
import axios from 'axios';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [fullAddress, setFullAddress] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [electionInfoList, setElectionInfoList] = useState([]);  // To store multiple election info
  const [representativesInfo, setRepresentativesInfo] = useState([]);  // To store representative info
  const [officials, setOfficials] = useState([]);  // To store officials info
  const [elections, setElections] = useState([]);  // To store available elections

  const civicAPIKey = 'AIzaSyBL3WFFp76lGFGKI-flp-ilGzlY56PzCfc';  // Civic Information API
  const geocodeAPIKey = 'AIzaSyAtj1NCZaapddWRhlR7zxIQk0qVgZ_X_os';  // Geocoding API

  useEffect(() => {
    fetchElections();
  }, []);

  // Fetch available elections using the Civic API
  const fetchElections = async () => {
    try {
      const electionsResponse = await axios.get('https://www.googleapis.com/civicinfo/v2/elections', {
        params: {
          key: civicAPIKey
        }
      });
      setElections(electionsResponse.data.elections);  // Store all elections in state
    } catch (error) {
      console.error('Error fetching elections:', error);
    }
  };

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
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse Geocoding API request to get the full address including the zip code
            const geocodeResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
              params: {
                latlng: `${latitude},${longitude}`,
                key: geocodeAPIKey
              }
            });

            const results = geocodeResponse.data.results;
            if (results.length > 0) {
              const formattedAddress = results[0].formatted_address;
              
              if (formattedAddress) {
                setFullAddress(formattedAddress);  // Automatically set the full address
                setSnackbarMessage(`Location acquired: Address ${formattedAddress}`);
                setSnackbarOpen(true);

                // Fetch election, voter info, and representatives using Civic Information API
                fetchElectionInfo(formattedAddress);
                fetchRepresentativesInfo(formattedAddress);
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
            setDialogOpen(true); // Open address input dialog if geolocation fails
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setSnackbarMessage("Unable to retrieve location. Please enter your address.");
          setSnackbarOpen(true);
          setDialogOpen(true); // Open address input dialog if geolocation fails
        }
      );
    } else {
      setSnackbarMessage("Geolocation is not supported by this browser.");
      setSnackbarOpen(true);
      setDialogOpen(true); // Open address input dialog if geolocation is not supported
    }
  };

  const fetchElectionInfo = async (address) => {
    try {
      const electionInfoResponses = await Promise.all(
        elections.map(async (election) => {
          const electionInfoResponse = await axios.get(`https://www.googleapis.com/civicinfo/v2/voterinfo`, {
            params: {
              address: address,
              electionId: election.id,
              key: civicAPIKey
            }
          });
          return { election, data: electionInfoResponse.data };  // Combine election details and voter info
        })
      );

      setElectionInfoList(electionInfoResponses);  // Store all election info
      setSnackbarMessage("Election information retrieved successfully.");
      setSnackbarOpen(true);

    } catch (error) {
      console.error('Error fetching election info:', error);
      setSnackbarMessage("Failed to fetch election information.");
      setSnackbarOpen(true);
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
      setRepresentativesInfo(representativesResponse.data.offices);  // Store representative info
      setOfficials(representativesResponse.data.officials);  // Store official info
      setSnackbarMessage("Representative information retrieved successfully.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error fetching representatives:', error);
      setSnackbarMessage("Failed to fetch representative information.");
      setSnackbarOpen(true);
    }
  };

  const handleAddressSubmit = () => {
    fetchElectionInfo(fullAddress);  // Fetch election info using entered address
    fetchRepresentativesInfo(fullAddress);  // Fetch representative info using entered address
    setSnackbarMessage(`Address entered: ${fullAddress}`);
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

      {/* Grouped Display of Election Information */}
      <div>
        {/* Election Information Section */}
        {electionInfoList.length > 0 && (
          <div>
            <h2>Election Information</h2>
            {electionInfoList.map((info, index) => (
              <div key={index}>
                <h3>{info.election.name}</h3>
                <p>Election Date: {info.election.electionDay}</p>
                <p>Address: {info.data.normalizedInput?.line1 || 'N/A'}, {info.data.normalizedInput?.city || 'N/A'}, {info.data.normalizedInput?.state || 'N/A'} {info.data.normalizedInput?.zip || 'N/A'}</p>
              </div>
            ))}
          </div>
        )}

        {/* Polling Locations Section */}
        {electionInfoList.length > 0 && electionInfoList[0].data.pollingLocations && (
          <div>
            <h2>Polling Locations</h2>
            {electionInfoList[0].data.pollingLocations.map((location, index) => (
              <div key={index}>
                <p>Location Name: {location.address?.locationName || 'N/A'}</p>
                <p>Address: {location.address?.line1 || 'N/A'}, {location.address?.city || 'N/A'}, {location.address?.state || 'N/A'} {location.address?.zip || 'N/A'}</p>
                <p>Polling Hours: {location.pollingHours || 'N/A'}</p>
              </div>
            ))}
          </div>
        )}

        {/* Contests and Candidates Section */}
        {electionInfoList.length > 0 && electionInfoList[0].data.contests && (
          <div>
            <h2>Contests and Candidates</h2>
            {electionInfoList[0].data.contests.map((contest, index) => (
              <div key={index}>
                <p>Contest: {contest.office || contest.referendumTitle || 'N/A'}</p>
                {contest.candidates && (
                  <div>
                    <h4>Candidates:</h4>
                    {contest.candidates.map((candidate, idx) => (
                      <p key={idx}>{candidate.name} ({candidate.party || 'No Party'})</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Election Officials Section */}
        {electionInfoList.length > 0 && electionInfoList[0].data.state && electionInfoList[0].data.state[0].electionAdministrationBody.electionOfficials && (
          <div>
            <h2>Election Officials</h2>
            {electionInfoList[0].data.state[0].electionAdministrationBody.electionOfficials.map((official, index) => (
              <div key={index}>
                <p>Name: {official.name || 'N/A'}</p>
                <p>Title: {official.title || 'N/A'}</p>
                <p>Phone: {official.officePhoneNumber || 'N/A'}</p>
                <p>Email: {official.emailAddress || 'N/A'}</p>
              </div>
            ))}
          </div>
        )}

        {/* Representative Information Section */}
        {representativesInfo.length > 0 && (
          <div>
            <h2>Your Representatives</h2>
            {representativesInfo.map((office, index) => (
              <div key={index}>
                <h3>{office.name}</h3>
                <p>Office Level: {office.levels ? office.levels.join(', ') : 'N/A'}</p>
                <p>Roles: {office.roles ? office.roles.join(', ') : 'N/A'}</p>
              </div>
            ))}
          </div>
        )}

        {/* Officials Section for Representatives */}
        {officials.length > 0 && (
          <div>
            <h2>Officials</h2>
            {officials.map((official, index) => (
              <div key={index}>
                <p>Name: {official.name}</p>
                <p>Party: {official.party || 'N/A'}</p>
                {official.phones && <p>Phone: {official.phones[0]}</p>}
                {official.urls && <p>Website: <a href={official.urls[0]} target="_blank" rel="noopener noreferrer">{official.urls[0]}</a></p>}
                {official.emails && <p>Email: {official.emails[0]}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppBar>
  );
};

export default Navbar;