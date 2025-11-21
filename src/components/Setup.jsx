import { useState } from 'react'

export default function Setup({ user, onComplete }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [language, setLanguage] = useState(user.language || 'en')
  const [gender, setGender] = useState('female')
  const [age, setAge] = useState(18)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/profile/setup?email=${encodeURIComponent(user.email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, gender, age: Number(age) })
      })
      if (!res.ok) throw new Error('Failed to save preferences')
      const data = await res.json()
      onComplete({ ...user, language: data.language, period_tracking_enabled: data.period_tracking_enabled, gender: data.gender, age: data.age })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800/60 border border-blue-500/20 rounded-2xl p-8 shadow-xl text-white">
        <h2 className="text-2xl font-bold mb-2">Set up your profile</h2>
        <p className="text-blue-200/80 mb-6">Choose your language, age, and gender to personalize tips. If gender is female and age is 13+, cycle support will be enabled.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-blue-500/30">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="pt">Português</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Age</label>
            <input type="number" min="1" max="120" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-blue-500/30" />
          </div>
          <div>
            <label className="block text-sm mb-1">Gender</label>
            <div className="flex gap-3">
              {['female','male'].map(g => (
                <button key={g} type="button" onClick={() => setGender(g)} className={`px-4 py-2 rounded-lg border ${gender===g ? 'bg-blue-600 border-blue-400' : 'bg-slate-900/60 border-blue-500/30 hover:bg-slate-700'}`}>
                  {g.charAt(0).toUpperCase()+g.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors">
            {loading ? 'Saving...' : 'Save and continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
