import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material'
import { useCookies } from 'react-cookie'

const Header: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [cookies, , removeCookie] = useCookies(['access_token'])
  const navigate = useNavigate()

  useEffect(() => {
    const token = cookies.access_token
    setIsLogin(!!token)
  }, [cookies])

  const handleLogout = () => {
    removeCookie('access_token')
    setIsLogin(false)
    navigate('/login')
  }

  const linkStyle = {
    textDecoration: 'none',
    color: 'white',
    margin: '0 1rem',
  }

  const activeStyle = {
    fontWeight: 'bold',
    color: '#FF0000',
  }

  const TextStyle = {
    fontFamily: 'Bebas Neue',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: 'rgba(0,0,0,0)', boxShadow: 'none' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src="./images/Logo.png" alt="Logo" style={{ width: '50px', height: '50px' }} />
          <Typography
            variant="h6"
            sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Bebas Neue', fontSize: '2rem' }}
          >
            Echoshape
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              ...linkStyle,
              ...(isActive ? activeStyle : {})
            })}
          >
            <Typography sx={TextStyle}>Home</Typography>
          </NavLink>
          <NavLink
            to={isLogin ? "/function" : "/login"}
            style={({ isActive }) => ({
              ...linkStyle,
              ...(isActive ? activeStyle : {})
            })}
          >
            <Typography sx={TextStyle}>Function</Typography>
          </NavLink>
          <NavLink
            to="/about"
            style={({ isActive }) => ({
              ...linkStyle,
              ...(isActive ? activeStyle : {})
            })}
          >
            <Typography sx={TextStyle}>About</Typography>
          </NavLink>
        </Box>

        {/* Login / Logout Button */}
        <Box>
          {isLogin ? (
            <Button variant="contained" color="error" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  )
}

export default Header
