import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Function from './pages/Function'
import About from './pages/About'
import { Box } from '@mui/material'

function App() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      minWidth="100vw"
      sx={{
        backgroundImage: 'url(./images/bg.png)', // หรือจะใส่ลิงก์ตรงๆ ก็ได้
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#333', // ตั้งสีตัวอักษรให้เหมาะกับพื้นหลัง
      }}
    >
      <Header />
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/function" element={<Function />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default App
