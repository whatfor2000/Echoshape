import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material'
import AudioRecorder from '../components/AudioRecord'
import AudioUpload from '../components/AudioUpload'
import ImageComponent from '../components/Images'
import EmotionBar from '../components/Emotion'
import Cookies from 'js-cookie'

// interface สำหรับ subscription จาก backend
interface UserSubscription {
  hasSubscription: boolean
  usedThisMonth: number
  maxGenerate: number
}

const Function: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [subscription, setSubscription] = useState<UserSubscription>({
    hasSubscription: false,
    usedThisMonth: 0,
    maxGenerate: 2,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/subscriptions/me`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('access_token')}`,
          },
          credentials: 'include',
      })
        if (!res.ok) throw new Error('Failed to fetch subscription')
        const data = await res.json()
        setSubscription(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchSubscription()
  }, [])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
  }

  const handleGenerate = async (data: any) => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/subscriptions/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,
          'Authorization': `Bearer ${Cookies.get('access_token')}`,
        },
        credentials: 'include',
        body: JSON.stringify({ imageUrl: data.url, amount: 0 }),
      })
      const resData = await res.json()
      if (!res.ok) {
        alert(resData.message || 'เกิดข้อผิดพลาด')
        return
      }

      setResult(data)
      setSubscription(prev => ({
        ...prev,
        usedThisMonth: resData.usedThisMonth,
      }))
    } catch (err) {
      console.error(err)
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ marginTop: '15px', paddingInline: '11vw', width: '78vw' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 3, color: '#fff', fontFamily: 'Bebas Neue' }}>
        Record or upload an audio file to analyze and generate AI image
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* LEFT SIDE - Tabs */}
        <Box sx={{ width: { xs: '100%', md: '60%' } }}>
          <Paper elevation={6} sx={{ backgroundColor: '#ffffff10', backdropFilter: 'blur(10px)', borderRadius: 2, overflow: 'hidden', paddingBottom: 2 }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              centered
              sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}
            >
              <Tab label="Record Audio" />
              <Tab label="Upload Audio" />
            </Tabs>

            <Box>
              {tabIndex === 0 && <AudioRecorder onResult={handleGenerate} disabled={loading} />}
              {tabIndex === 1 && <AudioUpload onResult={handleGenerate} disabled={loading} />}
            </Box>
          </Paper>
          <Typography sx={{ mt: 2, color: '#fff', fontFamily: 'Bebas Neue', fontSize: '1rem' }}>
            คุณมีสิทธิ์สร้างภาพได้สูงสุด {subscription.maxGenerate} ภาพต่อเดือน
          </Typography>
          <Typography sx={{ color: '#fff', fontFamily: 'Bebas Neue', fontSize: '1rem' }}>
            ภาพที่ใช้ไปแล้ว: {subscription.usedThisMonth} ภาพ
          </Typography>
          {loading && <Typography sx={{ color: '#fff', fontFamily: 'Bebas Neue', fontSize: '1rem' }}>
            กำลังประมวลผล... กรุณารอสักครู่
          </Typography>}
        </Box>

        {/* RIGHT SIDE - Result */}
        <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '10px', width: { xs: '100%', md: '40%' }, height: '100%' }}>
          {result ? (
            <>
              <Typography variant="h5" sx={{ mt: 2, ml: 2, fontWeight: 'bold', marginBottom: 3, color: '#fff' }}>
                Analysis Results
              </Typography>
              <ImageComponent height="240px" width="100%" src={result.image} alt="Generated" title=""/>
              <Box sx={{ mt: 4, marginInline: '10px' }}>
                <EmotionBar emoji="😠" emotion="Anger" value={result.probabilities.anger * 100} color="#d32f2f" />
                <EmotionBar emoji="😤" emotion="Frustration" value={result.probabilities.frustration * 100} color="#ff9800" />
                <EmotionBar emoji="😊" emotion="Happiness" value={result.probabilities.happiness * 100} color="#fbc02d" />
                <EmotionBar emoji="😐" emotion="Neutral" value={result.probabilities.neutral * 100} color="#9e9e9e" />
                <EmotionBar emoji="😢" emotion="Sadness" value={result.probabilities.sadness * 100} color="#1565c0" />
              </Box>
              <Typography sx={{ mt: 2, ml: 2, color: '#fff', fontFamily: 'Bebas Neue', fontSize: '1rem' }}>
                ภาพที่ใช้ไปแล้ว: {subscription.usedThisMonth} / {subscription.maxGenerate} ภาพ
              </Typography>
            </>
          ) : (
            <Typography sx={{ p: 2, color: 'white', fontFamily: 'Bebas Neue', fontSize: '1.1rem' }}>No result yet.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Function
