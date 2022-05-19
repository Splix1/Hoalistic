import React, { useState, createContext } from 'react';

export const Context = createContext();

export default function ContextProvider({ children }) {
  const [user, setUser] = useState(null);

  const value = {
    user,
    setUser,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
