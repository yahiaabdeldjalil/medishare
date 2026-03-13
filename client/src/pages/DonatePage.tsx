import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function DonatePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    medName: '', quantity: '', expiryDate: '',
    condition: 'SEALED', location: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/donations', form)
      navigate('/donations')
    } catch {
      setError('Failed to post donation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Donate a Medication</h1>
      <p className="text-gray-500 mb-6">Fill in the details about the medication you want to donate.</p>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-200 rounded-xl p-6">
        {[
          { label: 'Medication Name', name: 'medName', type: 'text', placeholder: 'e.g. Ibuprofen 400mg' },
          { label: 'Quantity', name: 'quantity', type: 'text', placeholder: 'e.g. 30 tablets' },
          { label: 'Expiry Date', name: 'expiryDate', type: 'date', placeholder: '' },
          { label: 'Location', name: 'location', type: 'text', placeholder: 'e.g. Algiers' },
        ].map(({ label, name, type, placeholder }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name as keyof typeof form]}
              onChange={handleChange}
              placeholder={placeholder}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="SEALED">Sealed</option>
            <option value="OPENED">Opened</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Donation'}
        </button>
      </form>
    </div>
  )
}