import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import Cookies from "js-cookie";

const Header: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) return null; // ป้องกัน context null
  const { user, setUser } = auth;

  const isLogin = !!user;

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {}, { withCredentials: true });
      Cookies.remove("access_token");
      
      setUser(null);
      navigate("/login");

    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const linkStyle = { textDecoration: "none", color: "white", margin: "0 1rem" };
  const activeStyle = { fontWeight: "bold", color: "#FF0000" };
  const TextStyle = { fontFamily: "Bebas Neue", fontWeight: "bold", fontSize: "1.1rem" };

  return (
    <AppBar position="static" sx={{ backgroundColor: "rgba(0,0,0,0)", boxShadow: "none" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo + Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img src="./images/Logo.png" alt="Logo" style={{ width: 50, height: 50 }} />
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold", fontFamily: "Bebas Neue", fontSize: "2rem" }}>
            Echoshape
          </Typography>
        </Box>

        {/* Navigation */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <NavLink to="/" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
            <Typography sx={TextStyle}>Home</Typography>
          </NavLink>
          <NavLink to={isLogin ? "/HomeAfterLogin" : "/login"} style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
            <Typography sx={TextStyle}>Explore</Typography>
          </NavLink>
          <NavLink to={isLogin ? "/function" : "/login"} style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
            <Typography sx={TextStyle}>Create Picture</Typography>
          </NavLink>
          <NavLink to="/about" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
            <Typography sx={TextStyle}>About</Typography>
          </NavLink>
          <NavLink to="/subscription" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
            <Typography sx={TextStyle}>Subscription</Typography>
          </NavLink>
          <NavLink to={isLogin ? "/profile" : "/login"} style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
            <Typography sx={TextStyle}>Profile</Typography>
          </NavLink>
        </Box>

        {/* Login / Logout */}
        <Box>
          {isLogin ? (
            <Button variant="contained" color="error" onClick={handleLogout}>
              Logout 
              {/* ({user?.email || user?.id}) */}
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
