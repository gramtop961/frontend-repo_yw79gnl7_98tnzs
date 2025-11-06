import { useState, useEffect } from 'react'

export function LoginForm({ backendUrl, onSuccess, csrfToken }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body = new URLSearchParams()
      body.append('username', email)
      body.append('password', password)
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRF-Token': csrfToken || '' },
        body
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      localStorage.setItem('pp_token', data.access_token)
      localStorage.setItem('pp_csrf', data.csrf_token || '')
      onSuccess && onSuccess(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="Email" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Password" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
      <button disabled={loading} className="px-3 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60">{loading? 'Signing in…':'Sign in'}</button>
    </form>
  )
}

export function SignupForm({ backendUrl, onSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Signup failed')
      localStorage.setItem('pp_token', data.access_token)
      localStorage.setItem('pp_csrf', data.csrf_token || '')
      onSuccess && onSuccess(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name (optional)" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="Email" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} placeholder="Password (min 8 chars)" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
      <button disabled={loading} className="px-3 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60">{loading? 'Creating…':'Create account'}</button>
    </form>
  )
}

export function ForgotReset({ backendUrl }) {
  const [view, setView] = useState('forgot')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function handleForgot(e){
    e.preventDefault()
    setMsg('')
    const res = await fetch(`${backendUrl}/api/auth/forgot-password`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) })
    const data = await res.json()
    setMsg(data.message + (data.token? ` (Token: ${data.token})`:''))
    if (data.token) setToken(data.token)
  }

  async function handleReset(e){
    e.preventDefault()
    setMsg('')
    const res = await fetch(`${backendUrl}/api/auth/reset-password`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token, new_password: password }) })
    const data = await res.json()
    setMsg(data.message || 'Done')
  }

  return (
    <div className="space-y-4">
      {msg && <div className="text-sm text-green-600">{msg}</div>}
      {view==='forgot'? (
        <form onSubmit={handleForgot} className="grid gap-3">
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
          <button className="px-3 py-2 rounded-md bg-blue-600 text-white">Send reset link</button>
          <button type="button" onClick={()=>setView('reset')} className="text-sm text-neutral-600 dark:text-neutral-300">Have a token? Reset password</button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="grid gap-3">
          <input value={token} onChange={e=>setToken(e.target.value)} placeholder="Reset token" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="New password" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
          <button className="px-3 py-2 rounded-md bg-blue-600 text-white">Reset password</button>
          <button type="button" onClick={()=>setView('forgot')} className="text-sm text-neutral-600 dark:text-neutral-300">Back</button>
        </form>
      )}
    </div>
  )
}

export function AdminPanel({ backendUrl }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('pp_token')
    if (!token) { setError('Access Denied'); return }
    fetch(`${backendUrl}/api/admin/overview`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => { const d = await r.json(); if(!r.ok) throw new Error(d.detail || 'Denied'); return d })
      .then(setData)
      .catch(e => setError(e.message))
  }, [backendUrl])

  if (error) return <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>
  if (!data) return <div>Loading…</div>

  return (
    <div className="grid gap-6">
      <section>
        <h3 className="font-semibold mb-2">Users</h3>
        <div className="overflow-auto rounded border border-neutral-200 dark:border-neutral-800">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900">
              <tr><th className="text-left p-2">Email</th><th className="text-left p-2">Name</th><th className="text-left p-2">Created</th></tr>
            </thead>
            <tbody>
              {data.users.map(u => (
                <tr key={u._id} className="border-t border-neutral-200 dark:border-neutral-800">
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{new Date(u.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h3 className="font-semibold mb-2">Activity</h3>
        <div className="overflow-auto rounded border border-neutral-200 dark:border-neutral-800">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900">
              <tr><th className="text-left p-2">User</th><th className="text-left p-2">Type</th><th className="text-left p-2">IP</th><th className="text-left p-2">Time</th></tr>
            </thead>
            <tbody>
              {data.activity.map(a => (
                <tr key={a._id} className="border-t border-neutral-200 dark:border-neutral-800">
                  <td className="p-2">{a.user_id}</td>
                  <td className="p-2">{a.type}</td>
                  <td className="p-2">{a.ip || '-'}</td>
                  <td className="p-2">{new Date(a.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
