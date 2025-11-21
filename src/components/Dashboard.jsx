import { useEffect, useState } from 'react'

export default function Dashboard({ user, onLogout }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [tip, setTip] = useState('')
  const [mood, setMood] = useState('ok')
  const [habits, setHabits] = useState([])

  const fetchTip = async () => {
    const res = await fetch(`${baseUrl}/api/ai/daily-tip?email=${encodeURIComponent(user.email)}&language=${user.language}`)
    const data = await res.json()
    setTip(data.tip)
  }

  const addMood = async () => {
    await fetch(`${baseUrl}/api/mood/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, mood })
    })
    fetchTip()
  }

  const loadHabits = async () => {
    const res = await fetch(`${baseUrl}/api/habits/list?email=${encodeURIComponent(user.email)}`)
    const data = await res.json()
    setHabits(data)
  }

  const createHabit = async () => {
    const title = prompt('New habit title')
    if (!title) return
    await fetch(`${baseUrl}/api/habits/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, title })
    })
    loadHabits()
  }

  useEffect(() => {
    fetchTip();
    loadHabits();
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
          <button onClick={onLogout} className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600">Logout</button>
        </div>

        <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-5">
          <h2 className="font-semibold mb-2">Daily Tip</h2>
          <p className="text-blue-200/90">{tip || 'Loading...'}</p>
        </div>

        <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold">Mood</h2>
          <div className="flex gap-2 flex-wrap">
            {['great','good','ok','low','bad'].map(m => (
              <button key={m} onClick={() => setMood(m)} className={`px-3 py-1 rounded ${mood===m?'bg-blue-600':'bg-slate-700 hover:bg-slate-600'}`}>{m}</button>
            ))}
            <button onClick={addMood} className="px-4 py-2 rounded bg-green-600 hover:bg-green-500">Save mood</button>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Habits</h2>
            <button onClick={createHabit} className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500">New</button>
          </div>
          <ul className="space-y-2">
            {habits.map(h => (
              <li key={h._id} className="px-3 py-2 bg-slate-900/60 rounded border border-slate-700">{h.title} <span className="text-xs text-blue-300/70">({h.frequency})</span></li>
            ))}
            {habits.length===0 && <p className="text-blue-200/70">No habits yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  )
}
