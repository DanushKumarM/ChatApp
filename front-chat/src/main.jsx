import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Approutes from './config/routes.jsx'
import { Toaster } from 'react-hot-toast'
import DarkModeToggle from './components/DarkModeToggle.jsx'
import { ChatProvider } from './context/ChatContext.jsx'

createRoot(document.getElementById('root')).render(
 
    <BrowserRouter >
    <Toaster />
    <DarkModeToggle />
     <ChatProvider>
     <Approutes/>
     </ChatProvider>
    </BrowserRouter>



)
