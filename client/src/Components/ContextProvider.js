import React, { useState, createContext, useReducer } from 'react';
import user from '../Store/User';

export const Context = createContext();

const initialState = {};

export default function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(user, initialState);

  const value = {
    state,
    dispatch,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
