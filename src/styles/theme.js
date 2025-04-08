import { createTheme } from '@mui/material/styles';

// Modern theme with enhanced glassmorphism effects
const futuristicTheme = createTheme({
// Update with these colors
palette: {
  mode: 'light',
  primary: {
    main: '#1976d2',
    light: '#4791db',
    dark: '#115293',
  },
  secondary: {
    main: '#546e7a',
    light: '#78909c',
    dark: '#37474f',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
  },
},
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.025em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.15), transparent 35%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15), transparent 35%),
            linear-gradient(to right bottom, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))
          `,
          backgroundAttachment: 'fixed',
          backgroundSize: '200% 200%',
          animation: 'gradientAnimation 15s ease infinite',
        },
        '@keyframes gradientAnimation': {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '100%': { backgroundPosition: '0% 0%' }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(6, 182, 212, 0.15)',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(248, 250, 252, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.01)',
            boxShadow: '0 12px 36px rgba(6, 182, 212, 0.2)',
            border: '1px solid rgba(248, 250, 252, 0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.9), rgba(139, 92, 246, 0.9))',
          border: '1px solid rgba(248, 250, 252, 0.12)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(6, 182, 212, 0.25)',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 1), rgba(139, 92, 246, 1))',
          },
        },
        contained: {
          boxShadow: '0 4px 16px rgba(6, 182, 212, 0.2)',
        },
        outlined: {
          borderColor: 'rgba(248, 250, 252, 0.2)',
          '&:hover': {
            borderColor: 'rgba(248, 250, 252, 0.3)',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1))',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(10px)',
            '& fieldset': {
              borderColor: 'rgba(248, 250, 252, 0.12)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(248, 250, 252, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#06b6d4',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 16px rgba(6, 182, 212, 0.1)',
        },
      },
    },
  },
});

export default futuristicTheme;