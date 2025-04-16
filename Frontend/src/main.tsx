import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>  {/* ใช้ HashRouter ที่นี่ */}
      <App />
    </HashRouter>
  </StrictMode>,
)
