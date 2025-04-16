import React, { useState } from 'react'
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material'
import AudioRecorder from '../components/AudioRecord'
import AudioUpload from '../components/AudioUpload'
import ImageComponent from '../components/Images'
import EmotionBar from '../components/Emotion'

const Function: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0)

  interface ResultType {
    image: string;
    probabilities: {
      anger: number;
      frustration: number;
      happiness: number;
      neutral: number;
      sadness: number;
    };
  }

  const [result, setResult] = useState<ResultType | null>(null)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
  }

  return (
    <Box sx={{ marginTop: '15px', paddingInline: '11vw', width: '78vw' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 3, color: '#fff', fontFamily: 'Prompt' }}>
        Record or upload an audio file to analyze and generate AI image
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* LEFT SIDE - Tabs with content */}
        <Box sx={{ width: { xs: '100%', md: '60%' } }}>
          <Paper elevation={6} sx={{ backgroundColor: '#ffffff10', backdropFilter: 'blur(10px)', borderRadius: 2, overflow: 'hidden', paddingBottom: 2, fontFamily: 'Prompt' }}>
            <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="secondary" textColor="inherit" variant="fullWidth" centered sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
              <Tab label="Record Audio" />
              <Tab label="Upload Audio" />
            </Tabs>

            <Box>
              {tabIndex === 0 && <AudioRecorder onResult={(data: unknown) => { if (typeof data === 'object' && data !== null && 'image' in data && 'probabilities' in data) { setResult(data as ResultType) } }} />}
              {tabIndex === 1 && <AudioUpload onResult={(data: unknown) => { if (typeof data === 'object' && data !== null && 'image' in data && 'probabilities' in data) { setResult(data as ResultType) } }} />}
            </Box>
          </Paper>
        </Box>

        {/* RIGHT SIDE - Result display */}
        <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '10px', width: { xs: '100%', md: '40%' } ,height: '100%'}}>
          {result ? (
            <>
              <ImageComponent height="240px" width="100%" src={result.image} alt="Generated" title="" />
              <Box sx={{ mt: 4, marginInline: "10px" }}>
                <EmotionBar emoji="😠" emotion="Anger" value={result.probabilities.anger * 100} color="#d32f2f" />
                <EmotionBar emoji="😤" emotion="Frustration" value={result.probabilities.frustration * 100} color="#ff9800" />
                <EmotionBar emoji="😊" emotion="Happiness" value={result.probabilities.happiness * 100} color="#fbc02d" />
                <EmotionBar emoji="😐" emotion="Neutral" value={result.probabilities.neutral * 100} color="#9e9e9e" />
                <EmotionBar emoji="😢" emotion="Sadness" value={result.probabilities.sadness * 100} color="#1565c0" />
              </Box>
            </>
          ) : (
            <Typography sx={{ p: 2, color: 'white' }}>No result yet.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Function
