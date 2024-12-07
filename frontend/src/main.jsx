import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import UserContextProvider from './contexts/userContext'
import CartContextProvider from './contexts/cartContext'
import AlertContextProvider from './contexts/alertContext'
import PopUpContextProvider from './contexts/popUpContext'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PopUpContextProvider>
      <AlertContextProvider>
        <UserContextProvider>
          <CartContextProvider>
            <App />
          </CartContextProvider>
        </UserContextProvider>
      </AlertContextProvider>
    </PopUpContextProvider>
  </StrictMode>
)
