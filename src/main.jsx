import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/index.css'

// `base` is stripped from every path the router reads and put back on every one
// it writes, so the same build works at the domain root and under a subpath.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename || undefined}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
