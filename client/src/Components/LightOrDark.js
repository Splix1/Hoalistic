import { createTheme } from '@mui/material/styles';
import supabase from '../client';
import React, { useContext } from 'react';
import { Context } from './ContextProvider';

export default function LightOrDark() {
  const { state } = useContext(Context);
  //
}
