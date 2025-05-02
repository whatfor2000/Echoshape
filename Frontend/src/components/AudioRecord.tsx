import React, { useRef, useState } from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'

interface AudioRecorderProps {
  onResult: (data: unknown) => void; // เพิ่ม prop นี้เพื่อส่งค่าผลลัพธ์กลับ
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onResult }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [liveScript, setLiveScript] = useState<string>('')  // จัดเก็บ liveScript
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const startRecording = async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert('Your browser does not support audio recording.')
      return
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    audioChunks.current = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data)
      }
    }

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' })
      const url = URL.createObjectURL(audioBlob)
      setAudioURL(url)

      // แปลงเป็น WAV ก่อนส่งไปยัง API
      const wavBlob = await convertToWav(audioBlob)
      onResult({ audioBlob: wavBlob, url }); // ส่งไฟล์ WAV กลับไป

    }

    mediaRecorder.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  // ฟังก์ชันแปลงจาก .webm เป็น .wav
  const convertToWav = (audioBlob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async () => {
        const audioContext = new (window.AudioContext || window.AudioContext)()
        const audioBuffer = await audioContext.decodeAudioData(reader.result as ArrayBuffer)

        const offlineContext = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate)
        const bufferSource = offlineContext.createBufferSource()
        bufferSource.buffer = audioBuffer
        bufferSource.connect(offlineContext.destination)
        bufferSource.start(0)

        offlineContext.startRendering().then((renderedBuffer) => {
          const wavBlob = audioBufferToWav(renderedBuffer)  // แปลงเป็น WAV
          resolve(wavBlob)
        })
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(audioBlob)
    })
  }

  // ฟังก์ชันแปลง AudioBuffer เป็น WAV
  const audioBufferToWav = (audioBuffer: AudioBuffer): Blob => {
    const numChannels = audioBuffer.numberOfChannels
    const sampleRate = audioBuffer.sampleRate
    const bufferLength = audioBuffer.length

    // สร้าง buffer WAV
    const wavHeader = new ArrayBuffer(44)
    const view = new DataView(wavHeader)
 

    // กำหนด header สำหรับไฟล์ WAV
    writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + bufferLength * numChannels * 2, true)
    writeString(view, 8, 'WAVE')
    writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true) // PCM
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * numChannels * 2, true)
    view.setUint16(32, numChannels * 2, true)
    view.setUint16(34, 16, true) // 16-bit
    writeString(view, 36, 'data')
    view.setUint32(40, bufferLength * numChannels * 2, true)

    // สร้าง data buffer
    const pcmData = new Int16Array(bufferLength * numChannels)
    let offset = 0
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel)
      for (let i = 0; i < bufferLength; i++) {
        pcmData[offset++] = channelData[i] * 0x7FFF
      }
    }

    // สร้างไฟล์ Blob ที่เป็น WAV
    const wavData = new Blob([wavHeader, pcmData], { type: 'audio/wav' })
    return wavData
  }

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  // handleUpload ฟังก์ชันที่ส่งข้อมูลไปยัง API
  // handleUpload ฟังก์ชันที่ส่งข้อมูลไปยัง API
const handleUpload = async () => {
  if (!audioURL) {
    alert('Please record an audio first.')
    return
  }

  const formData = new FormData()
  const wavBlob = await convertToWav(audioChunks.current[0]) // แปลงไฟล์เป็น .wav
  formData.append('file', wavBlob, 'recording.wav') // ส่งไฟล์ WAV แทนที่ .webm
  formData.append('transcript', liveScript)

  try {
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    console.log('Response:', data)

    if (response.ok) {
      alert('Upload Success!')
      onResult(data) // ส่งผลลัพธ์กลับไปยัง Function
      setLiveScript(data.transcript) // Update live script with transcript from response
    } else {
      alert(`Upload failed: ${data.error}`)
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    alert('Upload failed: network or server error.')
  }
}


  const ButtonStyle = {
    boxShadow: 3,
    cursor: 'pointer',
    color: 'white',
    fontFamily: 'Bebas Neue',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    borderRadius: '25px',
    px: 4,
    py: 1.5,
  }

  return (
    <Box
      sx={{
        minHeight: '100%',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg,rgb(3, 29, 54),rgb(76, 9, 44))',
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
          Audio Recorder (Only Thai language is supported)
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            disabled={isRecording}
            onClick={startRecording}
            sx={{
              backdropFilter: 'blur(30px)',
              ...ButtonStyle,
              color: '#fff',
              background: 'linear-gradient(135deg,#00c853,#64dd17)',
              '&:hover': {
                background: 'linear-gradient(135deg,#43a047,#00e676)',
              },
            }}
          >
            Start
          </Button>

          <Button
            variant="contained"
            // disabled={!isRecording}
            onClick={stopRecording}
            sx={{
              ...ButtonStyle,
              color: '#fff',
              background: 'linear-gradient(135deg,#c62828,#ff7043)',
              '&:hover': {
                background: 'linear-gradient(135deg,#b71c1c,#ff5722)',
              },
            }}
          >
            Stop
          </Button>
        </Box>

        {audioURL && (
          <>
            <Box display="flex" justifyContent="center" mb={2}>
              <audio controls src={audioURL} style={{ width: '100%' }} />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <a href={audioURL} download="recording.wav">
                <Button
                  sx={{
                    ...ButtonStyle,
                    width: '250px',
                    background: 'linear-gradient(135deg,#1e3c72,#2a5298)',
                    '&:hover': {
                      background: 'linear-gradient(135deg,#2980b9,#6dd5fa)',
                    },
                  }}
                >
                  Download
                </Button>
              </a>

              <Button
                sx={{
                  ...ButtonStyle,
                  width: '300px',
                  background: 'linear-gradient(135deg,#00c853,#00e5ff)',
                  '&:hover': {
                    background: 'linear-gradient(135deg,#00bfa5,#64dd17)',
                  }
                }}
                onClick={handleUpload}
              >
                🎵Analysis Record
              </Button>
            </Box>
          </>
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

export default AudioRecorder
