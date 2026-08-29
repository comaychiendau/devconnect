import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import CommunitiesPage from './pages/CommunitiesPage.jsx'
import GuestHomePage from './pages/GuestHomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<GuestHomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/communities" element={<CommunitiesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
