import { useEffect, useState } from 'react'
import api from '../lib/api'
import { Link } from 'react-router-dom'

interface Donation {
  id: string
  medName: string
  quantity: string
  expiryDate: string
  condition: string
  location: string
  status: string
  donor: { id: string; name: string; location: string }
}

export default function Donations() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchDonations = async (q = '') => {
    setLoading(true)
    try {
      const res = await api.get('/donations', { params: q ? { search: q } : {} })
      setDonations(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDonations() }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchDonations(search)
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Available Donations</h1>
        <Link
          to="/donate"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
        >
          + Donate
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
      ) : donations.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No donations found.</p>
      ) : (
        <div className="space-y-4">
          {donations.map(d => (
            <div key={d.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{d.medName}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {d.quantity} · {d.condition} · Expires {new Date(d.expiryDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    📍 {d.location} · Donated by {d.donor?.name || 'Anonymous'}
                  </p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                  {d.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}