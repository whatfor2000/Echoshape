import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Paper, Container, Grid, LinearProgress } from '@mui/material'
import AudioRecorder from '../components/AudioRecord'
import AudioUpload from '../components/AudioUpload'
import ImageComponent from '../components/Images'
import EmotionBar from '../components/Emotion'
import Cookies from 'js-cookie'

// ... (Interface และ Logic เดิมคงไว้) ...
// ผมขอละส่วน Logic ไว้เพื่อความกระชับ

const Function: React.FC = () => {
  // Copy Logic เดิมมาใส่ตรงนี้ได้เลยครับ (useState, useEffect, handleGenerate)
  // ...
  const [tabIndex, setTabIndex] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>({ hasSubscription: false, usedThisMonth: 0, maxGenerate: 2 })
  const [loading, setLoading] = useState(false)
  
  // Mock function for display (Replace with your actual logic)
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => setTabIndex(newValue)
  const handleGenerate = (data: any) => { /* Your Logic */ }

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Typography variant="h3" sx={{ textAlign: 'center', mb: 5, color: '#fff', fontFamily: 'Bebas Neue', letterSpacing: 2 }}>
        Record or upload audio <br /> to generate AI Image
      </Typography>

      <Grid container spacing={4}>
        {/* LEFT SIDE - Control Panel */}
        <Grid item xs={12} md={7} lg={6}>
          <Paper elevation={10} sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)', 
            borderRadius: '24px', 
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              centered
              variant="fullWidth"
              sx={{ 
                '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)', fontFamily: 'Bebas Neue', fontSize: '1.2rem' },
                '& .Mui-selected': { color: '#fff !important' },
                '& .MuiTabs-indicator': { backgroundColor: '#870049', height: '4px' }
              }}
            >
              <Tab label="Record Audio" />
              <Tab label="Upload Audio" />
            </Tabs>

            <Box sx={{ p: 4, minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {tabIndex === 0 && <AudioRecorder onResult={handleGenerate} disabled={loading} />}
              {tabIndex === 1 && <AudioUpload onResult={handleGenerate} disabled={loading} />}
            </Box>

            {/* Subscription Info Bar */}
            <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: '#fff', fontFamily: 'Bebas Neue' }}>Usage this month</Typography>
                  <Typography sx={{ color: '#fff', fontFamily: 'Bebas Neue' }}>{subscription.usedThisMonth} / {subscription.maxGenerate}</Typography>
               </Box>
               <LinearProgress 
                  variant="determinate" 
                  value={(subscription.usedThisMonth / subscription.maxGenerate) * 100} 
                  sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#870049' } }}
               />
               {loading && <Typography sx={{ mt: 1, color: '#4ade80', fontFamily: 'Bebas Neue', textAlign: 'center' }}>Processing AI Generation...</Typography>}
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT SIDE - Result Panel */}
        <Grid item xs={12} md={5} lg={6}>
          <Box sx={{ 
            height: '100%', 
            minHeight: '400px',
            bgcolor: 'rgba(0, 0, 0, 0.3)', 
            borderRadius: '24px', 
            border: '1px dashed rgba(255,255,255,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: result ? 'flex-start' : 'center',
            p: 3
          }}>
            {result ? (
              <Box sx={{ width: '100%', animation: 'fadeIn 0.5s' }}>
                <Typography variant="h4" sx={{ mb: 3, color: '#fff', fontFamily: 'Bebas Neue' }}>Analysis Results</Typography>
                
                <Box sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.4)', mb: 3 }}>
                   <ImageComponent height="300px" width="100%" src={result.image} alt="Generated" title=""/>
                </Box>

                <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 2, borderRadius: '16px' }}>
                  <EmotionBar emoji="😠" emotion="Anger" value={result.probabilities.anger * 100} color="#ef4444" />
                  <EmotionBar emoji="😤" emotion="Frustration" value={result.probabilities.frustration * 100} color="#f97316" />
                  <EmotionBar emoji="😊" emotion="Happiness" value={result.probabilities.happiness * 100} color="#eab308" />
                  <EmotionBar emoji="😐" emotion="Neutral" value={result.probabilities.neutral * 100} color="#9ca3af" />
                  <EmotionBar emoji="😢" emotion="Sadness" value={result.probabilities.sadness * 100} color="#3b82f6" />
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', opacity: 0.5 }}>
                <Typography sx={{ fontSize: '4rem' }}>🎵 ➡️ 🖼️</Typography>
                <Typography sx={{ color: 'white', fontFamily: 'Bebas Neue', fontSize: '1.5rem', mt: 2 }}>
                  Waiting for audio input...
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Function