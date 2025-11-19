import { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  typography: {
    fontFamily: '"Bebas Neue", sans-serif',
  },
  palette: {
    background: {
      default: '#1a202c',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d1d5db',
    },
  },
});

const Register = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setMessage('Registration successful! You can now log in.');
          setTimeout(() => navigate('/login'), 1000); // Redirect to login after success
        } else {
          setMessage(`Registration failed: ${data.message || 'Unknown error'}`);
        }
      } else {
        setMessage(`Registration failed: ${data.message || 'Invalid data'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Network error or server unreachable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: '100%',
          maxWidth: '500px',
          p: 4,
          bgcolor: 'rgba(55, 65, 81, 0.7)',
          borderRadius: '16px',
          boxShadow: 24,
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'white',
          margin: '0 auto'
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 3,
            fontFamily: 'Bebas Neue',
          }}
        >
          Register
        </Typography>
        <Box component="form" onSubmit={handleRegister} sx={{ width: '100%', mt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1, fontFamily: 'Bebas Neue' }}>
              Email
            </Typography>
            <TextField
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                sx: {
                  color: 'white',
                  bgcolor: '#374151',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                },
              }}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1, fontFamily: 'Bebas Neue' }}>
              Username
            </Typography>
            <TextField
              type="text"
              fullWidth
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              InputProps={{
                sx: {
                  color: 'white',
                  bgcolor: '#374151',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                },
              }}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1, fontFamily: 'Bebas Neue' }}>
              Password
            </Typography>
            <TextField
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                sx: {
                  color: 'white',
                  bgcolor: '#374151',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                },
              }}
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: '25px',
              fontWeight: 'bold',
              fontFamily: 'Bebas Neue',
              boxShadow: 5,
              mt: 2,
              background: 'linear-gradient(135deg, #003E87, #870049)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 8,
              },
              '&.Mui-disabled': {
                background: '#4b5563',
                color: '#9ca3af',
              },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Register'}
          </Button>
        </Box>
        {message && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              textAlign: 'center',
              fontWeight: 'bold',
              color: message.startsWith('Registration successful') ? 'success.main' : 'error.main',
            }}
          >
            {message}
          </Typography>
        )}
        <Box mt={3} sx={{textAlign: 'center'}}>
          <Button onClick={() => navigate('/login')} sx={{ color: 'text.secondary' }}>
            Already have an account? Login here.
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Register;
