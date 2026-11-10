import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* Vercel Web Analytics: logs to the console in dev, reports page views in production builds. */}
    <Analytics mode={import.meta.env.DEV ? 'development' : 'production'} />
  </React.StrictMode>
)
