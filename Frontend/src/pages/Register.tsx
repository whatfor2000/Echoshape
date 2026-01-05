import { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  typography: { fontFamily: '"Bebas Neue", sans-serif' },
  palette: {
    background: { default: '#1a202c' },
    text: { primary: '#ffffff', secondary: '#d1d5db' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
          setMessage('Registration successful! You can now log in.');
          setTimeout(() => navigate('/login'), 1000);
      } else {
        setMessage(`Registration failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage('Network error or server unreachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: 2
      }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: '450px',
            p: { xs: 3, md: 5 },
            bgcolor: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontFamily: 'Bebas Neue', letterSpacing: 2 }}>
            Create Account
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', fontFamily: 'Bebas Neue' }}>
            Join us and start creating
          </Typography>

          <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
            {/* Email */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontFamily: 'Bebas Neue', ml: 1 }}>Email</Typography>
              <TextField
                type="email"
                fullWidth
                placeholder="Enter your email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  sx: {
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.2)',
                    borderRadius: '12px',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4) !important' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6 !important' },
                  },
                }}
              />
            </Box>

            {/* Username */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontFamily: 'Bebas Neue', ml: 1 }}>Username</Typography>
              <TextField
                type="text"
                fullWidth
                placeholder="Choose a username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                InputProps={{
                  sx: {
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.2)',
                    borderRadius: '12px',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4) !important' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6 !important' },
                  },
                }}
              />
            </Box>

            {/* Password */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" sx={{ mb: 1, fontFamily: 'Bebas Neue', ml: 1 }}>Password</Typography>
              <TextField
                type="password"
                fullWidth
                placeholder="Create a password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  sx: {
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.2)',
                    borderRadius: '12px',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4) !important' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6 !important' },
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
                borderRadius: '30px',
                fontSize: '1.2rem',
                fontFamily: 'Bebas Neue',
                background: 'linear-gradient(135deg, #003E87, #870049)',
                boxShadow: '0 4px 14px 0 rgba(0,0,0,0.39)',
                transition: '0.3s',
                '&:hover': { transform: 'scale(1.02)', boxShadow: '0 6px 20px rgba(0,0,0,0.23)' },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Register'}
            </Button>
          </Box>

          {message && (
            <Typography sx={{ mt: 3, color: message.includes('success') ? '#4ade80' : '#f87171', fontFamily: 'Bebas Neue' }}>
              {message}
            </Typography>
          )}

          <Box mt={4}>
            <Button onClick={() => navigate('/login')} sx={{ color: 'text.secondary', fontFamily: 'Bebas Neue', textTransform: 'none', fontSize: '1rem' }}>
              Already have an account? <span style={{ color: '#60a5fa', marginLeft: '5px' }}>Login here</span>
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Register;