import React from 'react'
import { NavLink } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Box } from '@mui/material'

const Header: React.FC = () => {
  const linkStyle = {
    textDecoration: 'none',
    color: 'white',
    margin: '0 1rem',
  }

  const activeStyle = {
    fontWeight: 'bold',
    color: '#FF0000', // สีทองเมื่อ active
  }

  const TextStyle = {
    fontFamily: 'Bebas Neue',
    fontWeight: 'bold',
    fontSize: '1.1rem',
}

  return (
    <AppBar position="static" sx={{ backgroundColor: 'rgba(0,0,0,0)', boxShadow: 'none', }}>
      <Toolbar>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src="./images/Logo.png" alt="Logo" style={{ width: '50px', height: '50px' }} />
          <Typography variant="h6" sx={{ color: 'white',  fontWeight: 'bold',fontFamily: 'Bebas Neue', fontSize: '2rem', }}>
            Echoshape
          </Typography>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 2,
          }}
        >
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
            to="/function"
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
      </Toolbar>
    </AppBar>
  )
}

export default Header
