import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

interface Match {
  id: string
  medName: string
  quantity: string
  location: string
  donor: { name: string }
}

export default function PostNeed() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    medName: '', quantityNeeded: '', urgency: 'MEDIUM', description: '',
  })
  const [matches, setMatches] = useState<Match[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/needs', form)
      setMatches(res.data.matches)
      setSubmitted(true)
    } catch {
      setError('Failed to post need. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-10 px-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-center">
          <div className="text-4xl mb-2">✅</div>
          <h2 className="text-xl font-bold text-green-800">Need posted!</h2>
          <p className="text-green-600 text-sm mt-1">We searched for matching donations.</p>
        </div>

        {matches.length > 0 ? (
          <div>
            <h3 className="font-bold text-gray-900 mb-3">
              🎉 {matches.length} matching donation{matches.length > 1 ? 's' : ''} found!
            </h3>
            <div className="space-y-3">
              {matches.map(m => (
                <div key={m.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-medium text-gray-900">{m.medName}</p>
                  <p className="text-gray-500 text-sm">{m.quantity} · 📍 {m.location}</p>
                  <p className="text-gray-400 text-sm">Donated by {m.donor?.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>No matching donations found yet.</p>
            <p className="text-sm mt-1">You'll be notified when one becomes available.</p>
          </div>
        )}

        <button
          onClick={() => navigate('/needs')}
          className="mt-6 w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
        >
          View all needs
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Post a Need</h1>
      <p className="text-gray-500 mb-6">Tell us what medication you need and we'll search for matches.</p>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-200 rounded-xl p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
          <input
            type="text"
            name="medName"
            value={form.medName}
            onChange={handleChange}
            placeholder="e.g. Ibuprofen"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Needed</label>
          <input
            type="text"
            name="quantityNeeded"
            value={form.quantityNeeded}
            onChange={handleChange}
            placeholder="e.g. 20 tablets"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
          <select
            name="urgency"
            value={form.urgency}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Any additional context..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Post Need & Find Matches'}
        </button>
      </form>
    </div>
  )
}