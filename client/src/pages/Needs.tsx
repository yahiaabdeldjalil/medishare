import { useEffect, useState } from 'react'
import api from '../lib/api'
import { Link } from 'react-router-dom'

interface Need {
  id: string
  medName: string
  quantityNeeded: string
  urgency: string
  description: string
  status: string
  seeker: { id: string; name: string; location: string }
}

const urgencyColor: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-gray-100 text-gray-600',
}

export default function Needs() {
  const [needs, setNeeds] = useState<Need[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchNeeds = async (q = '') => {
    setLoading(true)
    try {
      const res = await api.get('/needs', { params: q ? { search: q } : {} })
      setNeeds(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNeeds() }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchNeeds(search)
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Medication Needs</h1>
        <Link
          to="/post-need"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
        >
          + Post Need
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by medication name..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-gray-400 text-center py-10">Loading...</p>
      ) : needs.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No needs posted yet.</p>
      ) : (
        <div className="space-y-4">
          {needs.map(n => (
            <div key={n.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{n.medName}</h3>
                  <p className="text-gray-500 text-sm mt-1">Needs: {n.quantityNeeded}</p>
                  {n.description && (
                    <p className="text-gray-400 text-sm mt-1">{n.description}</p>
                  )}
                  <p className="text-gray-400 text-sm mt-1">
                    Posted by {n.seeker?.name || 'Anonymous'}
                  </p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${urgencyColor[n.urgency]}`}>
                  {n.urgency}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}