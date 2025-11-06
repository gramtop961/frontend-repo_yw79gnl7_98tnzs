import { useState } from 'react'

export default function Writer({ backendUrl }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [technologies, setTechnologies] = useState('')
  const [audience, setAudience] = useState('Hiring managers')
  const [tone, setTone] = useState('professional')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  async function handleGenerate(e) {
    e.preventDefault()
    setLoading(true)
    setResult('')
    try {
      const res = await fetch(`${backendUrl}/api/ai/project-writer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          technologies: technologies.split(',').map(t => t.trim()).filter(Boolean),
          audience,
          tone,
        })
      })
      const data = await res.json()
      setResult(data.result || 'No result')
      localStorage.setItem('pp_writer_last', JSON.stringify({ title, description, technologies, audience, tone, result: data.result }))
    } catch (e) {
      setResult('Failed to generate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-4xl mx-auto p-4 md:p-8">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">AI Project Writer</h2>
      <form onSubmit={handleGenerate} className="mt-4 grid gap-4">
        <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Project title" className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
        <textarea value={description} onChange={e => setDescription(e.target.value)} required placeholder="Describe your project goals, features, and outcomes" rows={4} className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
        <div className="grid md:grid-cols-3 gap-3">
          <input value={technologies} onChange={e => setTechnologies(e.target.value)} placeholder="Technologies (comma-separated)" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
          <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="Audience" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
          <select value={tone} onChange={e => setTone(e.target.value)} className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2">
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="technical">Technical</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="w-fit px-4 py-2 rounded-lg bg-blue-600 text-white font-medium disabled:opacity-60">{loading ? 'Generating…' : 'Generate'}</button>
      </form>
      {result && (
        <div className="mt-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
          {result}
        </div>
      )}
    </section>
  )
}
