import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TimeValidationProvider } from './components/Context/TimeValidationProvider.tsx'
TimeValidationProvider

createRoot(document.getElementById('root')!).render(
  <TimeValidationProvider>
  <StrictMode>
    <App />
  </StrictMode>,
  </TimeValidationProvider>
)
