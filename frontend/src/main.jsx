import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Configure Axios Base URL for Deployment
// VITE_API_URL should be set in Vercel/Netlify environment variables
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://ngo-x9e8.onrender.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)