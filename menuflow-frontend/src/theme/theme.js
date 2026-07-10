// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1DC7EA',
      dark: '#03b5d2',
      light: '#5cd8ee',
    },
    secondary: {
      main: '#FB404B',
    },
    background: {
      default: '#F4F6F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C2C2C',
      secondary: '#9A9A9A',
    },
    success: {
      main: '#00C851',
    },
    warning: {
      main: '#FF8F00',
    },
    error: {
      main: '#FB404B',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Helvetica Neue", "Roboto", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: '0 1px 20px 0 rgba(0, 0, 0, 0.1)',
          border: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          textTransform: 'uppercase',
          fontWeight: 600,
          fontSize: '0.75rem',
          padding: '10px 22px',
        },
        contained: {
          boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14)',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 20px 0 rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#2C2C2C',
          boxShadow: '0 1px 4px 0 rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;