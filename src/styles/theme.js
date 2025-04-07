import { createTheme } from '@mui/material/styles';

// Futuristic theme with glassy/neo-morphic elements
const futuristicTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00bcd4',
      light: '#33c9dc',
      dark: '#008394',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c4dff',
      light: '#9670ff',
      dark: '#5035b1',
      contrastText: '#ffffff',
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
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(0, 188, 212, 0.2), transparent 25%), radial-gradient(circle at 75% 75%, rgba(124, 77, 255, 0.2), transparent 25%)',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,188,212,0.2)',
          background: 'linear-gradient(145deg, rgba(13, 34, 57, 0.9) 0%, rgba(15, 42, 69, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0,188,212,0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 28px rgba(0,188,212,0.3)',
          },
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
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 10%, transparent 10.5%)',
            transform: 'scale(10, 10)',
            opacity: 0,
            transition: 'transform 0.5s, opacity 1s',
          },
          '&:active::after': {
            transform: 'scale(0, 0)',
            opacity: 0.3,
            transition: '0s',
          },
        },
        contained: {
          boxShadow: '0 4px 10px rgba(0,188,212,0.3)',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0,188,212,0.4)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #00bcd4 0%, #00d4e6 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #7c4dff 0%, #9670ff 100%)',
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
        outlinedPrimary: {
          borderColor: '#00bcd4',
          '&:hover': {
            borderColor: '#00d4e6',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, rgba(10, 25, 41, 0.9) 0%, rgba(15, 42, 69, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(10, 25, 41, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          borderRight: '1px solid rgba(0,188,212,0.1)',
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
            backgroundColor: 'rgba(13, 34, 57, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
          },
          elevation1: {
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          },
          elevation2: {
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          },
          elevation3: {
            boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
          filled: {
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          },
          colorPrimary: {
            background: 'linear-gradient(45deg, #00bcd4 0%, #00d4e6 100%)',
          },
          colorSecondary: {
            background: 'linear-gradient(45deg, #7c4dff 0%, #9670ff 100%)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.2)',
                transition: 'border-color 0.2s',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0,188,212,0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00bcd4',
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            background: 'linear-gradient(145deg, rgba(13, 34, 57, 0.95) 0%, rgba(15, 42, 69, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
            border: '1px solid rgba(0,188,212,0.1)',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: 'rgba(255,255,255,0.1)',
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            '&.Mui-checked': {
              color: '#00bcd4',
              '& + .MuiSwitch-track': {
                backgroundColor: 'rgba(0,188,212,0.5)',
              },
            },
          },
          track: {
            backgroundColor: 'rgba(255,255,255,0.3)',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
          standardSuccess: {
            backgroundColor: 'rgba(0,230,118,0.2)',
            color: '#00e676',
          },
          standardError: {
            backgroundColor: 'rgba(255,23,68,0.2)',
            color: '#ff1744',
          },
          standardWarning: {
            backgroundColor: 'rgba(255,171,0,0.2)',
            color: '#ffab00',
          },
          standardInfo: {
            backgroundColor: 'rgba(3,169,244,0.2)',
            color: '#03a9f4',
          },
        },
      },
    },
  });
  
  export default futuristicTheme;