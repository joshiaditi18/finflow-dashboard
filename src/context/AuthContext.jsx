import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const DEMO_USERS = [
  {
    id: 'user_1',
    name: 'Aditi Sharma',
    email: 'aditi@finflow.app',
    password: 'demo123',
    avatar: null,
    upiIds: ['aditi@okaxis', 'aditi.sharma@ybl'],
    primaryUpi: 'aditi@okaxis',
    linkedApps: ['gpay', 'phonepe'],
    phone: '+91 98765 43210',
    role: 'admin',
  },
  {
    id: 'user_2',
    name: 'Rohan Mehta',
    email: 'rohan@finflow.app',
    password: 'demo123',
    avatar: null,
    upiIds: ['rohan@paytm'],
    primaryUpi: 'rohan@paytm',
    linkedApps: ['paytm'],
    phone: '+91 91234 56789',
    role: 'viewer',
  },
]

const STORAGE_KEY = 'finflow_auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      return s ? JSON.parse(s) : null
    } catch { return null }
  })
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  // Email/password login
  async function login(email, password) {
    setLoading(true)
    setAuthError('')
    await delay(800) // simulate network
    const found = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (found) {
      const { password: _, ...safe } = found
      setUser(safe)
      setLoading(false)
      return true
    }
    setAuthError('Invalid email or password. Try aditi@finflow.app / demo123')
    setLoading(false)
    return false
  }

  // Google SSO simulation
  async function loginWithGoogle() {
    setLoading(true)
    setAuthError('')
    await delay(1200)
    const { password: _, ...safe } = DEMO_USERS[0]
    setUser(safe)
    setLoading(false)
    return true
  }

  function logout() {
    setUser(null)
  }

  // UPI app linking
  function linkUpiApp(appId) {
    setUser(prev => ({
      ...prev,
      linkedApps: prev.linkedApps.includes(appId)
        ? prev.linkedApps
        : [...prev.linkedApps, appId],
    }))
  }

  function unlinkUpiApp(appId) {
    setUser(prev => ({
      ...prev,
      linkedApps: prev.linkedApps.filter(a => a !== appId),
    }))
  }

  function addUpiId(upiId) {
    if (!upiId.includes('@')) return false
    setUser(prev => ({
      ...prev,
      upiIds: prev.upiIds.includes(upiId) ? prev.upiIds : [...prev.upiIds, upiId],
    }))
    return true
  }

  function removeUpiId(upiId) {
    setUser(prev => ({
      ...prev,
      upiIds: prev.upiIds.filter(u => u !== upiId),
      primaryUpi: prev.primaryUpi === upiId ? prev.upiIds[0] || '' : prev.primaryUpi,
    }))
  }

  function setPrimaryUpi(upiId) {
    setUser(prev => ({ ...prev, primaryUpi: upiId }))
  }

  function updateProfile(data) {
    setUser(prev => ({ ...prev, ...data }))
  }

  return (
    <AuthContext.Provider value={{
      user, loading, authError,
      login, loginWithGoogle, logout,
      linkUpiApp, unlinkUpiApp,
      addUpiId, removeUpiId, setPrimaryUpi,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }
