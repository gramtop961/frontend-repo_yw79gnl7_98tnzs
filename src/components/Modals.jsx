export function InfoModal({ open, onClose, type }) {
  if (!open) return null
  const content = {
    ai: {
      title: 'AI-Powered Writing',
      body: 'PortfolioPal uses an AI backend to turn rough notes into polished, structured content. Write faster with hooks, bullet points, and clear takeaways.'
    },
    lang: {
      title: 'Multilingual Support',
      body: 'Generate portfolios and project descriptions in multiple languages. Choose your language in the builder and let the AI adapt tone and phrasing.'
    },
    builder: {
      title: 'Portfolio Builder',
      body: 'Fill a simple form with your details and instantly receive a clean portfolio layout. Copy as HTML or share as a page.'
    }
  }
  const data = content[type] || { title: 'Info', body: 'Details' }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{data.title}</h3>
          <button onClick={onClose} className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white">Close</button>
        </div>
        <p className="mt-3 text-neutral-700 dark:text-neutral-300">{data.body}</p>
        <div className="mt-5 flex justify-end">
          <button onClick={onClose} className="px-3 py-1.5 rounded-md bg-blue-600 text-white">Got it</button>
        </div>
      </div>
    </div>
  )
}
