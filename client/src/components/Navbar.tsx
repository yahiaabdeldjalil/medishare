import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-green-600">
        💊 MediShare
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/donations" className="text-sm text-gray-600 hover:text-gray-900">
          Donations
        </Link>
        <Link to="/needs" className="text-sm text-gray-600 hover:text-gray-900">
          Needs
        </Link>

        {user ? (
          <>
            <Link
              to="/donate"
              className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Donate
            </Link>
            <Link
              to="/post-need"
              className="border border-green-600 text-green-600 text-sm px-4 py-2 rounded-lg hover:bg-green-50"
            >
              Post Need
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  )
}