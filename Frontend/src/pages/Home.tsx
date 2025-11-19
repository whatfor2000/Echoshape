import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ImageComponent from '../components/Images'
import { NavLink } from 'react-router-dom'
import Cookies from 'js-cookie'

const Home: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    const token = Cookies.get('access_token')
    setIsLogin(()=>{
      if(!token) return false
      return true
    })

  }, [])
  

  return (
    <Box>
      <Box sx={{ paddingInline: "11vw", width: "78vw" }}>
        <Typography sx={{ textAlign: "left", color: "#fff", fontSize: "7vw", fontFamily: 'Bebas Neue' }}>
          LET YOUR VOICE PAINT THE UNSEEN
        </Typography>

        <Box>
          <Typography sx={{ textAlign: "left", marginTop: 2, fontSize: "1.5rem", color: "#fff", fontFamily: 'Bebas Neue' }}>
            Transform your voice into stunning Al-generated <br />
            soundscapes and visuals. Our technology makes it <br />
            easy to create immersive audio and visual <br />
            experiences from your recoroings.<br />
          </Typography>
        </Box>
        <NavLink
          to={
            isLogin ? "/HomeAfterLogin" : "/login"
          }
        >
          <Button
            sx={{
              background: "linear-gradient(135deg,#003E87,#870049)",
              boxShadow: 5,
              cursor: "pointer",
              width: "200px",
              height: "50px",
              margin: "10px",
              marginTop: 2,
              color: "white",
              fontFamily: 'Bebas Neue',
              fontWeight: "bold",
              borderRadius: "25px",
              "&:hover": {
                background: "linear-gradient(135deg,#003E87,rgb(3, 29, 54))",
              },
            }}
            variant="contained"
          >
            <Typography variant="h6" sx={{ fontFamily: 'Bebas Neue', fontWeight: "bold" }}>
              Get Started
            </Typography>
          </Button>
        </NavLink>

        <NavLink to="/about">
          <Button
            sx={{
              boxShadow: 5, // เพิ่มให้เหมือนปุ่มแรก
              cursor: "pointer",
              width: "250px",
              height: "50px",
              margin: "10px",
              marginTop: 2,
              backgroundColor: "rgba(0,0,0,0)",
              color: "white",
              fontFamily: 'Bebas Neue',
              fontWeight: "bold",
              borderRadius: "25px", // เพิ่มให้เหมือนปุ่มแรก
              border: "1px solid white",
              "&:hover": {
                background: "linear-gradient(135deg,rgb(27, 148, 248),#870049)",
              },
            }}
            variant="contained"
          >

            <Typography variant="h6" sx={{ fontFamily: 'Bebas Neue', fontWeight: "bold" }}>
              Learn More About
            </Typography>

          </Button>
        </NavLink>


        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box >
            <ImageComponent height={'auto'} width={'100%'} src="./images/image1.png" alt="Image 1" title={''} />
          </Box>
          <Box>
            <ImageComponent height={'auto'} width={'100%'} src="./images/image2.png" alt="Image 2" title={''} />
          </Box>
          <Box>
            <ImageComponent height={'auto'} width={'100%'} src="./images/image3.png" alt="Image 3" title={''} />
          </Box>
          <Box>
            <ImageComponent height={'auto'} width={'100%'} src="./images/image4.png" alt="Image 4" title={''} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Home
