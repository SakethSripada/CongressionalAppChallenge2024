import React, { createContext, useState } from 'react';

// Create the context
export const AddressContext = createContext();

// Create a provider component
export const AddressProvider = ({ children }) => {
  const [address, setAddress] = useState('');

  return (
    <AddressContext.Provider value={{ address, setAddress }}>
      {children}
    </AddressContext.Provider>
  );
};