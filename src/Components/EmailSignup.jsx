import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import axios from 'axios';

const EmailSignup = () => {
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async () => {
    try {
      console.log('Sending request to API:', { email, zipCode });
      const response = await axios.post('http://localhost:5000/api/send-election-reminder', { email, zipCode });
      console.log('API response:', response.data);
      setMessage(response.data.message || 'Thank you for signing up!');
    } catch (error) {
      console.error('Error during signup:', error.message);
      setMessage('There was an error. Please try again later.');
    }
  };

  return (
    <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
      <TextField
        label="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outlined"
        sx={{
          marginBottom: '10px',
          width: '300px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'white',
          },
          '& .MuiInputBase-input': {
            color: 'white',
          },
        }}
        InputLabelProps={{
          style: { color: 'white' },
        }}
      />
      <br />
      <TextField
        label="Enter your ZIP code"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        variant="outlined"
        sx={{
          marginBottom: '10px',
          width: '300px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'white',
          },
          '& .MuiInputBase-input': {
            color: 'white',
          },
        }}
        InputLabelProps={{
          style: { color: 'white' },
        }}
      />
      <br />
      <Button variant="contained" color="primary" onClick={handleSignup}>
        Sign Up for Election Reminders
      </Button>
      {message && <p>{message}</p>}
    </Box>
  );
};

export default EmailSignup;
