import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import UserContextProvider from './contexts/userContext'
import CartContextProvider from './contexts/cartContext'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <CartContextProvider>
     <App/>
     </CartContextProvider>
    </UserContextProvider>
  </StrictMode>
)
