import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import React, { PropsWithChildren } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: grey[800],
    },
  },
});

function ThemeProvider({ children }: PropsWithChildren<object>) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}

export default ThemeProvider;
