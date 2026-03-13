import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200 py-20 px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Share medications, save lives
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
          MediShare connects people who have surplus medications with those who need
          rare or expensive ones — for free.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/donations"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
          >
            Browse Donations
          </Link>
          {user ? (
            <Link
              to="/donate"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              Donate Medication
            </Link>
          ) : (
            <Link
              to="/register"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '💊', title: 'Donate', desc: 'Post surplus or unused medications with details and expiry date.' },
            { icon: '🙋', title: 'Request', desc: 'Post what you need. We instantly search for matching donations.' },
            { icon: '🤝', title: 'Connect', desc: 'Get matched with a donor and coordinate the handoff privately.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}