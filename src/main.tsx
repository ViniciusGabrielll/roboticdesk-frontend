import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import Login from './containers/Login/login'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Login/>
  </StrictMode>,
)
