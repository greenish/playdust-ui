import { CheckBoxSharp, SquareOutlined } from '@mui/icons-material';
import {
  CssBaseline,
  Paper,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import React, { PropsWithChildren } from 'react';

const greyBackground = '#F6F6F6';
const border = '1px solid #e2e2e2';

const baseTheme = createTheme({
  typography: {
    fontFamily: ['Poppins', 'sans-serif'].join(','),
    button: {
      textTransform: 'none',
    },
  },
  palette: {
    primary: {
      main: '#284866',
    },
    text: {
      primary: '#141414',
    },
    background: {
      default: '#FEFEFE',
    },
  },
});

const themeOverrides = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
      defaultProps: {
        size: 'small',
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
        square: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: greyBackground,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: greyBackground,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
        square: true,
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          top: 6,
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        label: '',
        size: 'small',
        sx: {
          marginTop: '20px',
          borderRadius: 0,
          '& legend': {
            display: 'none',
          },
        },
      },
      styleOverrides: {
        select: {
          backgroundColor: baseTheme.palette.background.default,
          borderRadius: 0,
          marginTop: -4,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 30,
          height: 16,
          padding: 0,
          margin: '13px 12px',
          display: 'flex',
          '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': {
              transform: 'translateX(14px)',
              '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: baseTheme.palette.primary.main,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            color: baseTheme.palette.background.default,
            width: 12,
            height: 12,
            borderRadius: 6,
          },
          '& .MuiSwitch-track': {
            borderRadius: 16 / 2,
            opacity: 1,
            backgroundColor: 'rgba(0,0,0,.25)',
            boxSizing: 'border-box',
          },
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        icon: <SquareOutlined />,
        checkedIcon: <CheckBoxSharp />,
      },
    },
    MuiTextField: {
      defaultProps: {
        InputLabelProps: { shrink: true },
      },
      styleOverrides: {
        root: ({ ownerState }) => {
          const base = {
            '& .MuiInputBase-root': {
              borderRadius: 0,
            },
          };

          if (ownerState.label === undefined) {
            return base;
          }

          return {
            ...base,
            paddingTop: 20,
            '& input': {
              marginTop: -4,
            },
            '& legend': {
              display: 'none',
            },
          };
        },
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        PaperComponent: (props) => <Paper {...props} elevation={1} />,
      },
    },
    MuiAccordion: {
      defaultProps: {
        square: true,
        disableGutters: true,
      },
      styleOverrides: {
        root: {
          border,
          borderBottom: 0,
          '.MuiAccordionSummary-root': {
            background: greyBackground,
            borderBottom: border,
          },
          '.MuiAccordionDetails-root': {
            padding: 16,
            borderBottom: border,
          },
        },
      },
    },
  },
});

const theme = createTheme(themeOverrides, baseTheme);

function ThemeProvider({ children }: PropsWithChildren<object>) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline>{children}</CssBaseline>
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
