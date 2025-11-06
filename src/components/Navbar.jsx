import { useEffect } from 'react'
import { Sun, Moon, Rocket } from 'lucide-react'

export default function Navbar({ onNavigate, currentView, theme, setTheme }) {
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('pp_theme', theme)
  }, [theme])

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-neutral-900/70 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
          <Rocket className="h-5 w-5 text-blue-600" />
          PortfolioPal
        </button>
        <nav className="hidden md:flex items-center gap-4">
          <button onClick={() => onNavigate('builder')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${currentView==='builder' ? 'bg-blue-600 text-white' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>Build Portfolio</button>
          <button onClick={() => onNavigate('writer')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${currentView==='writer' ? 'bg-blue-600 text-white' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>AI Project Writer</button>
        </nav>
        <div className="flex items-center gap-2">
          <button aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}
