import { useState } from 'react'
import Login from './components/Login'
import Setup from './components/Setup'
import Dashboard from './components/Dashboard'

function App() {
  const [user, setUser] = useState(null)
  const [needsSetup, setNeedsSetup] = useState(false)

  const handleLoggedIn = (u) => {
    setUser(u)
    // If we don't have gender or age on first login, ask for setup
    if (!u.gender || !u.age) {
      setNeedsSetup(true)
    }
  }

  const handleSetupComplete = (updated) => {
    setUser(updated)
    setNeedsSetup(false)
  }

  if (!user) return <Login onLoggedIn={handleLoggedIn} />
  if (needsSetup) return <Setup user={user} onComplete={handleSetupComplete} />

  return <Dashboard user={user} onLogout={() => { setUser(null); setNeedsSetup(false) }} />
}

export default App
