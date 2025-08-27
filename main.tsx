import React from 'react'
import ReactDOM from 'react-dom/client'
import { Router } from './router.tsx'
import './styles/globals.css'

console.log('🚀 Starting ClipLab with React Router');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)