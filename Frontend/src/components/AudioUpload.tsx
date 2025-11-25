import { Box, Typography, Button, Paper } from '@mui/material'
import React, { useState } from 'react'

type Props = {
  onResult: (data: unknown) => void
  disabled?: boolean
}

const AudioUpload: React.FC<Props> = ({ onResult, disabled }) => {
  const [audioSrc, setAudioSrc] = useState<string | null>(null)
  const [liveScript, setLiveScript] = useState<string>('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAudioSrc(url)
    }
  }

  const handleUpload = async () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('transcript', '');

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Response:', data);


      if (response.ok) {
        alert('Upload Success!');
        onResult(data); // 🔥 ส่งผลลัพธ์กลับไปยัง Function
        setLiveScript(data.transcript);  // Update live script with transcript from response
      } else {
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Upload failed: network or server error.');
    }
  };

  const ButtonStyle = {
    boxShadow: 3,
    cursor: 'pointer',
    marginTop: 2,
    color: 'white',
    fontFamily: 'Bebas Neue',
    fontWeight: 'bold',
    fontSize: '1.3rem',
    borderRadius: '25px',
    paddingX: 3,
    paddingY: 1,
    background: 'linear-gradient(135deg,#0b3d20,#1e5631)',
    '&:hover': {
      background: 'linear-gradient(135deg,#1e5631,#0b3d20)',
    },
  }

  return (
    <Box
      sx={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg,rgb(3, 29, 54),rgb(76, 9, 63))',
        padding: 3,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 2,
          borderRadius: 4,
          width: '100%',
          backgroundColor: '#ffffff10',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
        }}
      >
       <Typography
               sx={{
                 fontSize:"1.4rem",
                 fontWeight: 'bold',
                 color: '#fff',
                 fontFamily: 'Bebas Neue',
                 textAlign: 'start',
               }}
        >
          Upload & Play Audio (Only Thai language is supported)
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" component="label" sx={ButtonStyle} disabled={disabled}>
            📁 Upload Audio File
            <input
              type="file"
              accept="audio/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          {audioSrc && (
            <Button
              variant="contained"
              sx={{
                ...ButtonStyle,
                background: 'linear-gradient(135deg,#00c853,#00e5ff)',
                '&:hover': {
                  background: 'linear-gradient(135deg,#00bfa5,#64dd17)',
                }
              }}
              onClick={handleUpload}
            >
              🎵Analysis File
            </Button>
          )}
        </Box>

        {audioSrc && (
          <Box sx={{ marginTop: 4 }}>
            <Typography
              variant="h6"
              sx={{ fontFamily: 'Bebas Neue', mb: 1, color: '#fff' }}
            >
              Preview:
            </Typography>
            <audio controls src={audioSrc} style={{ width: '100%' }} />
          </Box>
        )}
      </Paper>

      <Box sx={{
        backgroundColor: 'rgb(255,255,255,0.8)',
        width: "100%",
        mt: 2,
        borderRadius: 4,
        padding: 2,
        textAlign: 'start',
        backdropFilter: 'blur(10px)',
      }}>
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: 'bold',
            color: '#000',
            fontFamily: 'Bebas Neue',
            textAlign: 'start',
          }}
        >
          Live Script
        </Typography>
        <Typography variant="h6" sx={{
          fontFamily: 'Bebas Neue',
          height: '200px',
          width: '100%',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {liveScript || 'No transcript available yet.'}
        </Typography>
      </Box>
    </Box>
  )
}

export default AudioUpload
