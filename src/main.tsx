import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import Register from './containers/userRequest/Register/register'
import AppRoutes from './app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoutes/>
  </StrictMode>,
)
