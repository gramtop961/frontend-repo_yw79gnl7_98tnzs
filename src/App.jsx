import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Writer from './components/Writer'
import Builder from './components/Builder'
import Footer from './components/Footer'
import { InfoModal } from './components/Modals'
import Account from './components/Account'
import { AdminPanel } from './components/AuthForms'

function App() {
  const [view, setView] = useState('home')
  const [theme, setTheme] = useState(() => localStorage.getItem('pp_theme') || 'light')
  const [infoOpen, setInfoOpen] = useState(false)
  const [infoType, setInfoType] = useState('ai')

  const backendUrl = useMemo(() => {
    return import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('pp_last_view')
    if (saved) setView(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('pp_last_view', view)
  }, [view])

  function openInfo(type) {
    setInfoType(type)
    setInfoOpen(true)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Navbar onNavigate={setView} currentView={view} theme={theme} setTheme={setTheme} />

      {view === 'home' && (
        <main>
          <Hero onNavigate={setView} />
          <Features onNavigate={setView} onOpenInfo={(t) => openInfo(t)} />
        </main>
      )}

      {view === 'writer' && (
        <main>
          <Writer backendUrl={backendUrl} />
        </main>
      )}

      {view === 'builder' && (
        <main>
          <Builder backendUrl={backendUrl} />
        </main>
      )}

      {view === 'account' && (
        <main>
          <Account backendUrl={backendUrl} onNavigate={setView} />
        </main>
      )}

      {view === 'admin' && (
        <main className="max-w-6xl mx-auto p-4 md:p-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Admin Dashboard</h2>
          <AdminPanel backendUrl={backendUrl} />
        </main>
      )}

      <Footer />

      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} type={infoType} />
    </div>
  )
}

export default App
