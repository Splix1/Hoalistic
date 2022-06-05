import { createTheme } from '@mui/material/styles';
import { useContext } from 'react';
import { Context } from './ContextProvider';

export default function LightOrDark() {
  const { state } = useContext(Context);
  return createTheme({
    palette: {
      mode: state.theme,
    },
  });
}
