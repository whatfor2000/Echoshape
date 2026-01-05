import { Box, Button, Typography, Container, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ImageComponent from '../components/Images'
import { NavLink } from 'react-router-dom'
import Cookies from 'js-cookie'

const Home: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    const token = Cookies.get('access_token')
    setIsLogin(!!token) // เขียนย่อให้สั้นลง
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 5 }}>
      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center">
          {/* ส่วนข้อความ */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography 
                sx={{ 
                  textAlign: { xs: "center", md: "left" }, 
                  color: "#fff", 
                  fontSize: { xs: "3rem", md: "5rem", lg: "7rem" }, // ปรับขนาดตามหน้าจอ
                  fontFamily: 'Bebas Neue',
                  lineHeight: 0.9,
                  letterSpacing: '2px'
                }}
              >
                LET YOUR VOICE <br /> PAINT THE UNSEEN
              </Typography>

              <Typography 
                sx={{ 
                  textAlign: { xs: "center", md: "left" }, 
                  marginTop: 3, 
                  fontSize: { xs: "1rem", md: "1.25rem" }, 
                  color: "#d1d5db", 
                  fontFamily: 'Bebas Neue',
                  letterSpacing: '1px'
                }}
              >
                Transform your voice into stunning AI-generated <br />
                soundscapes and visuals. Our technology makes it <br />
                easy to create immersive audio and visual <br />
                experiences from your recordings.
              </Typography>

              {/* ส่วนปุ่มกด */}
              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
                <NavLink to={isLogin ? "/HomeAfterLogin" : "/login"} style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    sx={{
                      background: "linear-gradient(135deg,#003E87,#870049)",
                      width: "180px",
                      height: "55px",
                      borderRadius: "30px",
                      fontFamily: 'Bebas Neue',
                      fontSize: "1.2rem",
                      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                      "&:hover": { transform: 'scale(1.05)', background: "linear-gradient(135deg,#0056b3,#a0005a)" },
                    }}
                  >
                    Get Started
                  </Button>
                </NavLink>

                <NavLink to="/about" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="outlined"
                    sx={{
                      width: "180px",
                      height: "55px",
                      borderRadius: "30px",
                      fontFamily: 'Bebas Neue',
                      fontSize: "1.2rem",
                      color: "white",
                      borderColor: "white",
                      borderWidth: '2px',
                      "&:hover": { borderColor: '#870049', color: '#870049', borderWidth: '2px' },
                    }}
                  >
                    Learn More
                  </Button>
                </NavLink>
              </Box>
            </Box>
          </Grid>

          {/* ส่วนรูปภาพตัวอย่าง */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {['./images/image1.png', './images/image2.png', './images/image3.png', './images/image4.png'].map((src, index) => (
                <Grid item xs={6} key={index}>
                  <Box sx={{ 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'translateY(-5px)' }
                  }}>
                    <ImageComponent height={'200px'} width={'100%'} src={src} alt={`Example ${index + 1}`} title={''} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Home