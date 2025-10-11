import { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

// NOTE: This component assumes that Material-UI and a custom font like 'Bebas Neue'
// are loaded in your main application's HTML file or theme configuration.
// For example, in your index.html head:
// <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Bebas+Neue&display=swap" />
// <script src="https://cdn.tailwindcss.com"></script>

// Create a custom theme for consistency, though we are using 'sx' for most styles.
const theme = createTheme({
    typography: {
        fontFamily: '"Bebas Neue", sans-serif',
    },
    palette: {
        background: {
            default: '#1a202c', // Matches bg-gray-900
        },
        text: {
            primary: '#ffffff',
            secondary: '#d1d5db', // Matches text-gray-300
        },
    },
});

const Login = () => {
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFacebookLogin = () => {
        // redirect ไป backend
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/facebook`;
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.success) {
                    console.log(data);
                    // sessionStorage.setItem("access_token", data.access_token);
                    setCookie('access_token', data.access_token,);
                    setMessage('Login successful!');
                    // You would typically redirect the user here or update state
                    setTimeout(() => {
                        navigate('/HomeAfterLogin');
                        window.location.reload();
                    }, 1500)
                } else {
                    setMessage(`Login failed: ${data.message || 'Unknown error'}`);
                }
            } else {
                setMessage(`Login failed: ${data.message || 'Invalid credentials'}`);
            }
        } catch (error) {
            console.error('Login error:', error);
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
                    bgcolor: 'rgba(55, 65, 81, 0.7)', // Matches bg-gray-800 with opacity
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
                    Log In
                </Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', mt: 2 }}>
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
                                    bgcolor: '#374151', // bg-gray-700
                                    borderRadius: '8px',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'transparent',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#3b82f6', // focus:ring-blue-500
                                    },
                                },
                            }}
                            sx={{ transition: 'all 0.2s' }}
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
                                    bgcolor: '#374151', // bg-gray-700
                                    borderRadius: '8px',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'transparent',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#3b82f6', // focus:ring-blue-500
                                    },
                                },
                            }}
                            sx={{ transition: 'all 0.2s' }}
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
                        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login'}
                    </Button>
                    <Button onClick={handleFacebookLogin} style={{ background: "#1877F2", color: "white" , padding: '10px', marginTop: '10px', borderRadius: '25px', fontWeight: 'bold', fontFamily: 'Bebas Neue', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease', width: '100%' , border: 'none', cursor: 'pointer' }}
                        sx={{transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: 8,
                            },}}>
                        Login with Facebook
                    </Button>
                </Box>
                {message && (
                    <Typography
                        variant="body2"
                        sx={{
                            mt: 2,
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: message.startsWith('Login successful') ? 'success.main' : 'error.main',
                        }}
                    >
                        {message}
                    </Typography>
                )}
                <Box mt={3} sx={{ textAlign: 'center' }}>
                    <Button onClick={() => navigate('/register')} sx={{ color: 'text.secondary' }}>
                        Don't have an account? register here.
                    </Button>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Login;