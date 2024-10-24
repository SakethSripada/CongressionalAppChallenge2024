import React from 'react';
import { Fab } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const ChatButton = () => {
  const openChat = () => {
  };

  return (
    <Fab
      color="primary"
      aria-label="chat"
      onClick={openChat}
      sx={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 1000,
      }}
    >
      <ChatIcon />
    </Fab>
  );
};

export default ChatButton; 
