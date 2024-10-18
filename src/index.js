import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#140a35', // Change to your desired primary color
    },
    secondary: {
      main: '#f8b231', // Change to your desired secondary color
    },
    // Add more customizations if needed
    background: {
      default: '#140a35', // Default background color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Change to your desired font
  },
  
  // Additional theme customization can go here
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme = {theme}>
      <App />
    </ThemeProvider>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
