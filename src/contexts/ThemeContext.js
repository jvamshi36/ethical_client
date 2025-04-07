import React, { createContext, useState, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

// Create context
const ThemeContext = createContext();

// Define theme options
const themeOptions = {
  light: {
    palette: {
      mode: 'light',
      primary: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1976d2',
      },
      secondary: {
        main: '#651fff',
        light: '#834bff',
        dark: '#4615b2',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
    },
  },
  dark: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1976d2',
      },
      secondary: {
        main: '#651fff',
        light: '#834bff',
        dark: '#4615b2',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            backgroundColor: '#1e1e1e',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
    },
  },
  futuristic: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#00bcd4',
        light: '#33c9dc',
        dark: '#008394',
      },
      secondary: {
        main: '#7c4dff',
        light: '#9670ff',
        dark: '#5035b1',
      },
      background: {
        default: '#0a1929',
        paper: '#0d2239',
      },
      info: {
        main: '#03a9f4',
      },
      success: {
        main: '#00e676',
      },
      warning: {
        main: '#ffab00',
      },
      error: {
        main: '#ff1744',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 500,
      },
      h2: {
        fontWeight: 500,
      },
      h3: {
        fontWeight: 500,
      },
      h4: {
        fontWeight: 500,
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,188,212,0.2)',
            background: 'linear-gradient(145deg, #0d2239 0%, #0f2a45 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,188,212,0.1)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 16px',
            transition: 'all 0.2s ease-in-out',
            position: 'relative',
            overflow: 'hidden',
          },
          contained: {
            boxShadow: '0 4px 10px rgba(0,188,212,0.3)',
            '&:hover': {
              boxShadow: '0 6px 12px rgba(0,188,212,0.4)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: 'linear-gradient(90deg, #0a1929 0%, #0f2a45 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          },
          head: {
            fontWeight: 600,
            backgroundColor: 'rgba(13, 34, 57, 0.7)',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: 'rgba(0,188,212,0.05) !important',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  },
};

// Create theme provider component
export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('futuristic');
  
  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme) {
      setThemeMode(savedTheme);
    }
  }, []);
  
  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);
  
  // Create MUI theme based on selected theme mode
  const theme = createTheme(themeOptions[themeMode]);
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    setThemeMode(prevMode => {
      if (prevMode === 'light') return 'dark';
      if (prevMode === 'dark') return 'futuristic';
      return 'light';
    });
  };
  
  // Set specific theme
  const setTheme = (mode) => {
    if (themeOptions[mode]) {
      setThemeMode(mode);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme, setTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);