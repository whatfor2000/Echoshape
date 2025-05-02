import React from 'react'
import { Box, Typography, LinearProgress } from '@mui/material'

interface EmotionBarProps {
  emotion: string
  value: number // ค่าระหว่าง 0 - 100
  color?: string // ยังใช้ได้ ถ้าไม่มี gradient
  emoji?: string
}

const EmotionBar: React.FC<EmotionBarProps> = ({ emotion, value, color, emoji }) => {
  console.log(color);
  return (
    <Box
      sx={{
        marginY: 1,
        padding: 0.5,
        px: 2,
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 12px rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {/* Emoji + Emotion Label */}
      <Typography
        sx={{
          fontFamily: 'Bebas Neue',
          fontWeight: 600,
          fontSize: '1rem',
          minWidth: '140px',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <span style={{ fontSize: '1.3rem' }}>{emoji}</span> {emotion}
      </Typography>
      
        
      {/* Gradient Progress Bar */}
      <Box sx={{ flexGrow: 1 }}>
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            height: 14,
            borderRadius: 7,
            backgroundColor: 'rgba(0,0,0,0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundImage: `linear-gradient(to right, #00c6ff, #0072ff)`, // gradient สีฟ้า → น้ำเงิน
              borderRadius: 7,
              transition: 'width 0.3s ease-in-out',
            },
          }}
        />
      </Box>

      {/* Value (%) */}
      <Typography
        sx={{
          fontFamily: 'Bebas Neue',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          color: '#000',
          minWidth: '40px',
          textAlign: 'right',
        }}
      >
        {value.toFixed(2)}%
      </Typography>
    </Box>
  )
}

export default EmotionBar
