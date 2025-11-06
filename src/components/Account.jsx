import { useEffect, useState } from 'react'
import { LoginForm, SignupForm, ForgotReset } from './AuthForms'

export default function Account({ backendUrl, onNavigate }) {
  const [tab, setTab] = useState('login')
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  async function refreshMe() {
    const token = localStorage.getItem('pp_token')
    if (!token) { setUser(null); return }
    try {
      const res = await fetch(`${backendUrl}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Auth error')
      setUser(data)
    } catch (e) {
      setError(e.message)
      setUser(null)
    }
  }

  useEffect(() => { refreshMe() }, [backendUrl])

  function handleSuccess(){
    refreshMe()
    setTab('profile')
  }

  function logout(){
    localStorage.removeItem('pp_token')
    localStorage.removeItem('pp_csrf')
    setUser(null)
    setTab('login')
  }

  return (
    <section className="max-w-3xl mx-auto p-4 md:p-8">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Account</h2>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={()=>setTab('login')} className={`px-3 py-1.5 rounded-md text-sm ${tab==='login'?'bg-blue-600 text-white':'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'}`}>Login</button>
        <button onClick={()=>setTab('signup')} className={`px-3 py-1.5 rounded-md text-sm ${tab==='signup'?'bg-blue-600 text-white':'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'}`}>Sign up</button>
        <button onClick={()=>setTab('forgot')} className={`px-3 py-1.5 rounded-md text-sm ${tab==='forgot'?'bg-blue-600 text-white':'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'}`}>Forgot/Reset</button>
        <button onClick={()=>setTab('profile')} className={`px-3 py-1.5 rounded-md text-sm ${tab==='profile'?'bg-blue-600 text-white':'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'}`}>Profile</button>
      </div>

      <div className="mt-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
        {tab==='login' && <LoginForm backendUrl={backendUrl} onSuccess={handleSuccess} csrfToken={localStorage.getItem('pp_csrf')||''} />}
        {tab==='signup' && <SignupForm backendUrl={backendUrl} onSuccess={handleSuccess} />}
        {tab==='forgot' && <ForgotReset backendUrl={backendUrl} />}
        {tab==='profile' && (
          <ProfileView user={user} error={error} onLogout={logout} onAdmin={()=>onNavigate && onNavigate('admin')} />
        )}
      </div>
    </section>
  )
}

function ProfileView({ user, error, onLogout, onAdmin }){
  if (error) return <div className="text-red-600 text-sm">{error}</div>
  if (!user) return <div className="text-neutral-600 dark:text-neutral-300">Not signed in.</div>
  const isAdmin = user.email && user.email.toLowerCase() === (import.meta.env.VITE_PRIMARY_ADMIN_EMAIL || 'myemail@domain.com').toLowerCase()
  return (
    <div className="space-y-3">
      <div className="text-sm text-neutral-600 dark:text-neutral-300">Signed in as</div>
      <div className="text-lg font-semibold">{user.name || '(No name)'} <span className="text-neutral-500">•</span> {user.email}</div>
      <div className="flex gap-2">
        <button onClick={onLogout} className="px-3 py-1.5 rounded-md bg-neutral-200 dark:bg-neutral-800">Log out</button>
        {isAdmin && <button onClick={onAdmin} className="px-3 py-1.5 rounded-md bg-blue-600 text-white">Go to Admin</button>}
      </div>
    </div>
  )
}
