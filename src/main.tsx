import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toast } from 'react-bootstrap'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toast></Toast>
    <App />
  </StrictMode>,
)
