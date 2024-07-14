// AppContext.js
import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [id, setId] = useState(null);

  return (
    <AppContext.Provider value={{ id, setId }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
