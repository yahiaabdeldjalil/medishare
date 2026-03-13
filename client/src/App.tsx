import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Donations from './pages/Donations'
import Needs from './pages/Needs'
import DonatePage from './pages/DonatePage'
import PostNeed from './pages/PostNeed'

function App() {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/needs" element={<Needs />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/donate" element={user ? <DonatePage /> : <Navigate to="/login" />} />
        <Route path="/post-need" element={user ? <PostNeed /> : <Navigate to="/login" />} />
      </Routes>
    </>
  )
}

export default App