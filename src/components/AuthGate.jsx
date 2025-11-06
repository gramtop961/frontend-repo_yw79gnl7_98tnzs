import { useEffect, useState } from 'react'

export default function AuthGate({ backendUrl, children }) {
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('pp_token')
    if (!token) { setError('Not authenticated'); return }
    fetch(`${backendUrl}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => { const d = await r.json(); if(!r.ok) throw new Error(d.detail || 'Auth error'); return d })
      .then(setUser)
      .catch(e => setError(e.message))
  }, [backendUrl])

  if (error && !user) return <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>
  if (!user) return <div>Loading…</div>
  return typeof children === 'function' ? children(user) : children
}
