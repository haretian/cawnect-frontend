import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import './index.css'
import Auth from './auth/Auth.tsx'
import Home from './home/Home.tsx'
import Profile from './profile/Profile.tsx'
import userReducer from './features/user/userSlice'

const store = configureStore({ reducer: { user: userReducer } })
export type UserState = ReturnType<typeof store.getState>

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </Provider>
  </StrictMode>,
)
