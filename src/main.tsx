import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import './index.css'
import Auth from './auth/Auth.tsx'
import Home from './home/Home.tsx'
import Profile from './profile/Profile.tsx'
import userReducer from './features/user/userSlice.tsx'
import contentReducer from './features/content/contentSlice.tsx'

const store = configureStore({ reducer: { user: userReducer, content: contentReducer } });
export type UserState = ReturnType<typeof store.getState>;

export const url = (endpoint: string) => `https://jsonplaceholder.typicode.com/${endpoint}`;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </Provider>
  </StrictMode>,
)
