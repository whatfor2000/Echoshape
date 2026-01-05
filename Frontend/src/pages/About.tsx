import { Box, Typography, Container, Grid } from '@mui/material'
import React from 'react'

const About: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          {/* ข้อความหลัก */}
          <Typography
            sx={{
              color: '#fff', // เปลี่ยนเป็นสีขาวให้ชัดขึ้น
              fontSize: { xs: '15vw', md: '7rem' }, // ปรับขนาดตามจอ
              fontFamily: 'Bebas Neue',
              lineHeight: 0.9,
              textShadow: '0 0 20px rgba(255,255,255,0.3)'
            }}
          >
            LET YOUR VOICE <br/> PAINT THE UNSEEN
          </Typography>

          {/* เงาสะท้อน */}
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.3)',
              fontSize: { xs: '15vw', md: '7rem' },
              fontFamily: 'Bebas Neue',
              lineHeight: 0.9,
              transform: 'scaleY(-1) translateY(-10px)', // กลับหัว
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 70%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 70%)',
            }}
          >
            LET YOUR VOICE <br/> PAINT THE UNSEEN
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 15 }}>
        <Typography variant="h3" sx={{ color: '#fff', fontFamily: 'Bebas Neue', mb: 4, borderBottom: '2px solid #870049', display: 'inline-block' }}>
          About Us
        </Typography>

        <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
                <Typography sx={{ fontSize: "1.25rem", color: "#d1d5db", fontFamily: 'Bebas Neue', lineHeight: 1.6 }}>
                At Echoshape, we believe in the power of sound and data to create transformative digital experiences.
                Our passion lies in reshaping how audio is understood and interacted with,
                pushing the boundaries of technology to craft the most innovative and intuitive digital products.
                We’re on a mission to design the world we’ve always envisioned —
                where sound and technology converge in ways never seen before.
                <br /><br />
                <span style={{ color: '#870049' }}>— The Echoshape Team</span>
                </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography sx={{ fontSize: "1.25rem", color: "#d1d5db", fontFamily: 'Bebas Neue', lineHeight: 1.6 }}>
                ที่ Echoshape เราเชื่อในพลังของเสียงและข้อมูลในการสร้างประสบการณ์ดิจิทัลที่เปลี่ยนแปลง
                ความหลงใหลของเราคือการเปลี่ยนแปลงวิธีที่เสียงถูกเข้าใจและมีปฏิสัมพันธ์กับมัน
                เราผลักดันขีดจำกัดของเทคโนโลยีเพื่อสร้างผลิตภัณฑ์ดิจิทัลที่เป็นนวัตกรรมและเข้าใจง่ายที่สุด
                เป้าหมายของเราคือการออกแบบโลกที่เราเคยฝันไว้ — ที่ซึ่งเสียงและเทคโนโลยีมาบรรจบกันในวิธีที่ไม่เคยเห็นมาก่อน
                <br /><br />
                <span style={{ color: '#870049' }}>— ทีมงาน Echoshape</span>
                </Typography>
            </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default About