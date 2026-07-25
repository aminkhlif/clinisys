// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

// Design tokens — strict monochrome scale
export const grey = {
  0: '#FFFFFF',
  50: '#FAFAFA',
  100: '#F2F2F2',
  150: '#E8E8E8',
  200: '#DDDDDD',
  300: '#C4C4C4',
  400: '#9E9E9E',
  500: '#787878',
  600: '#565656',
  700: '#3A3A3A',
  800: '#242424',
  850: '#1A1A1A',
  900: '#121212',
  950: '#0A0A0A',
  1000: '#000000',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: grey[900],
      dark: grey[1000],
      light: grey[700],
      contrastText: grey[0],
    },
    secondary: {
      main: grey[600],
      contrastText: grey[0],
    },
    background: {
      default: grey[50],
      paper: grey[0],
    },
    text: {
      primary: grey[900],
      secondary: grey[500],
      disabled: grey[300],
    },
    divider: grey[150],
    success: { main: grey[800], contrastText: grey[0] },
    warning: { main: grey[600], contrastText: grey[0] },
    error: { main: grey[900], contrastText: grey[0] },
    action: {
      hover: 'rgba(0,0,0,0.04)',
      selected: 'rgba(0,0,0,0.06)',
      disabled: grey[300],
      disabledBackground: grey[100],
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", "Roboto", "Arial", sans-serif',
    h5: { fontWeight: 650, letterSpacing: '-0.01em' },
    h6: { fontWeight: 650, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 600 },
    body2: { color: grey[600] },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        body: { backgroundColor: grey[50] },
        '::selection': { backgroundColor: grey[800], color: grey[0] },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: 'none',
          border: `1px solid ${grey[150]}`,
          transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.85rem',
          padding: '8px 18px',
          transition: 'all 140ms ease',
        },
        contained: {
          backgroundColor: grey[900],
          color: grey[0],
          '&:hover': {
            backgroundColor: grey[1000],
            boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
            transform: 'translateY(-1px)',
          },
          '&:active': { transform: 'translateY(0)' },
          '&.Mui-focusVisible': {
            boxShadow: `inset 0 0 0 2px ${grey[500]}`,
          },
          '&.Mui-disabled': { backgroundColor: grey[100], color: grey[300] },
        },
        outlined: {
          borderColor: grey[200],
          color: grey[800],
          '&:hover': { borderColor: grey[400], backgroundColor: grey[50] },
        },
        text: {
          color: grey[700],
          '&:hover': { backgroundColor: grey[100] },
        },
        containedError: {
          backgroundColor: grey[900],
          '&:hover': { backgroundColor: grey[1000] },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: grey[0],
            '& fieldset': { borderColor: grey[200] },
            '&:hover fieldset': { borderColor: grey[400] },
            '&.Mui-focused fieldset': { borderColor: grey[900], borderWidth: '1.5px' },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { boxShadow: 'none', backgroundImage: 'none' },
        elevation1: { border: `1px solid ${grey[150]}` },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: grey[0],
          color: grey[900],
          boxShadow: 'none',
          borderBottom: `1px solid ${grey[150]}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16, border: `1px solid ${grey[150]}` },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontWeight: 650, fontSize: '1.05rem', letterSpacing: '-0.01em' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: grey[600],
          transition: 'background-color 140ms ease, color 140ms ease',
          '&:hover': { backgroundColor: grey[100], color: grey[900] },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: grey[400],
          '&.Mui-checked': { color: grey[900] },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'background-color 140ms ease',
        },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: grey[150] } },
    },
    MuiSkeleton: {
      styleOverrides: { root: { backgroundColor: grey[150] } },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          backgroundColor: grey[100],
          color: grey[800],
        },
      },
    },
  },
});

export default theme;