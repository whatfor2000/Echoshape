import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Function from './pages/Function'
import About from './pages/About'
import { Box } from '@mui/material'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider, AuthContext } from './AuthContext'

function App() {
  return (
    <AuthProvider>

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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Box>
      </Box>
    </AuthProvider>
  )
}

export default App
