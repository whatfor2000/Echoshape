import { Box, Typography } from '@mui/material'
import React from 'react'

const About: React.FC = () => {
  return (
    <Box sx={{ paddingInline: '11vw', width: '78vw' }}>
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        {/* ข้อความหลัก */}
        <Typography
          sx={{
            marginTop: '15px',
            textAlign: 'left',
            color: '#757575',
            fontSize: '7vw',
            fontFamily: 'Bebas Neue',
            lineHeight: 1,
          }}
        >
          LET YOUR VOICE PAINT THE UNSEEN
        </Typography>

        {/* เงาสะท้อน */}
        <Typography
          sx={{
            textAlign: 'left',
            color: '#333',
            fontSize: '7vw',
            fontFamily: 'Bebas Neue',
            lineHeight: 1,
            transform: 'scaleY(-1)',
            opacity: 1,
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
          }}
        >
          LET YOUR VOICE PAINT THE UNSEEN
        </Typography>
      </Box>
      <Typography
          sx={{
            textAlign: 'left',
            color: '#fff',
            fontSize: '3rem',
            fontFamily: 'Bebas Neue',
            fontWeight: 'bold',
         
          }}
        >
          About Us
        </Typography>
      <Box>
              <Typography sx={{ textAlign: "left", marginTop: 2, fontSize:"1.5rem" , color:"#fff", fontFamily: 'Bebas Neue' }}>
              At Echoshape, we believe in the power of sound and data to create transformative digital experiences. <br />
              Our passion lies in reshaping how audio is understood and interacted with,<br />
              pushing the boundaries of technology to craft the most innovative and intuitive digital products.<br />
              we’re on a mission to design the world we’ve always envisioned — <br />
              where sound and technology converge in ways never seen before. <br /><br />
              — The Echoshape Team
              </Typography>
      </Box>
      <br /><br />
      <Box>
              <Typography sx={{ textAlign: "left", marginTop: 2, fontSize:"1.5rem" , color:"#fff", fontFamily: 'Bebas Neue' }}>
              ที่ Echoshape เราเชื่อในพลังของเสียงและข้อมูลในการสร้างประสบการณ์ดิจิทัลที่เปลี่ยนแปลง <br />
              ความหลงใหลของเราคือการเปลี่ยนแปลงวิธีที่เสียงถูกเข้าใจและมีปฏิสัมพันธ์กับมัน <br />
              เราผลักดันขีดจำกัดของเทคโนโลยีเพื่อสร้างผลิตภัณฑ์ดิจิทัลที่เป็นนวัตกรรมและเข้าใจง่ายที่สุด <br />
              เป้าหมายของเราคือการออกแบบโลกที่เราเคยฝันไว้ — ที่ซึ่งเสียงและเทคโนโลยีมาบรรจบกันในวิธีที่ไม่เคยเห็นมาก่อน <br /><br />
              — ทีมงาน Echoshape
              </Typography>
      </Box>
    </Box>
  )
}

export default About
