import { Sparkles, Layout, Languages } from 'lucide-react'

export default function Features({ onNavigate, onOpenInfo }) {
  const items = [
    {
      title: 'AI-Powered Writing',
      desc: 'Craft concise, engaging descriptions for your projects with one click.',
      icon: Sparkles,
      action: () => onOpenInfo('ai')
    },
    {
      title: 'Portfolio Builder',
      desc: 'Turn your details into a polished, responsive portfolio instantly.',
      icon: Layout,
      action: () => onNavigate('builder')
    },
    {
      title: 'Multilingual Support',
      desc: 'Generate content in your preferred language for a global audience.',
      icon: Languages,
      action: () => onOpenInfo('lang')
    },
  ]

  return (
    <section className="py-12 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">Features</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ title, desc, icon: Icon, action }) => (
            <button key={title} onClick={action} className="text-left group rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md transition bg-white dark:bg-neutral-900">
              <Icon className="h-6 w-6 text-blue-600" />
              <h3 className="mt-3 font-semibold text-neutral-900 dark:text-white">{title}</h3>
              <p className="mt-1 text-neutral-600 dark:text-neutral-300">{desc}</p>
              <span className="mt-3 inline-block text-blue-600 group-hover:translate-x-0.5 transition">Learn more →</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
