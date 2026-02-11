import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FrappeProvider } from 'frappe-react-sdk'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FrappeProvider
  url="http://127.0.0.1:8000"
  enableSocket={true}
  socketPort={9000}
>
  <App />
</FrappeProvider>

   
  </StrictMode>,
)
