import { useState } from 'react'

export default function Builder({ backendUrl }) {
  const [form, setForm] = useState({
    name: '',
    role: '',
    summary: '',
    language: 'English',
    tone: 'confident',
  })
  const [projects, setProjects] = useState([{ name: '', description: '', highlights: '', tech: '', link: '' }])
  const [education, setEducation] = useState([{ school: '', degree: '', period: '', details: '' }])
  const [skills, setSkills] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  function update(idx, list, setter, key, value) {
    const next = list.slice()
    next[idx] = { ...next[idx], [key]: value }
    setter(next)
  }

  function addRow(setter, template) {
    setter(prev => [...prev, template])
  }

  async function handleGenerate(e) {
    e.preventDefault()
    setLoading(true)
    setResult('')
    try {
      const payload = {
        ...form,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        projects: projects.map(p => ({
          name: p.name,
          description: p.description,
          highlights: p.highlights ? p.highlights.split(';').map(h => h.trim()).filter(Boolean) : [],
          tech: p.tech ? p.tech.split(',').map(t => t.trim()).filter(Boolean) : [],
          link: p.link || undefined,
        })),
        education: education.map(e => ({ school: e.school, degree: e.degree, period: e.period, details: e.details })),
      }
      const res = await fetch(`${backendUrl}/api/ai/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setResult(data.result || 'No result')
      localStorage.setItem('pp_portfolio_last', JSON.stringify({ payload, result: data.result }))
    } catch (err) {
      setResult('Failed to generate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-5xl mx-auto p-4 md:p-8">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Portfolio Builder</h2>
      <form onSubmit={handleGenerate} className="mt-4 grid gap-4">
        <div className="grid md:grid-cols-2 gap-3">
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Your name" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
          <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required placeholder="Your role (e.g., Full-Stack Developer)" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
        </div>
        <textarea value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} required placeholder="Short professional summary" rows={3} className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
        <div className="grid md:grid-cols-3 gap-3">
          <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Portuguese</option>
            <option>Hindi</option>
            <option>Japanese</option>
          </select>
          <select value={form.tone} onChange={e => setForm(f => ({ ...f, tone: e.target.value }))} className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2">
            <option value="confident">Confident</option>
            <option value="friendly">Friendly</option>
            <option value="technical">Technical</option>
            <option value="enthusiastic">Enthusiastic</option>
          </select>
          <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Skills (comma-separated)" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
        </div>

        <div className="border rounded-lg border-neutral-300 dark:border-neutral-700 p-3">
          <div className="flex items-center justify-between"><h3 className="font-medium text-neutral-900 dark:text-white">Projects</h3><button type="button" onClick={() => addRow(setProjects, { name: '', description: '', highlights: '', tech: '', link: '' })} className="text-blue-600">Add project</button></div>
          {projects.map((p, i) => (
            <div key={i} className="mt-3 grid md:grid-cols-2 gap-3">
              <input value={p.name} onChange={e => update(i, projects, setProjects, 'name', e.target.value)} placeholder="Name" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
              <input value={p.link} onChange={e => update(i, projects, setProjects, 'link', e.target.value)} placeholder="Link (optional)" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
              <textarea value={p.description} onChange={e => update(i, projects, setProjects, 'description', e.target.value)} placeholder="Short description" rows={2} className="md:col-span-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
              <input value={p.highlights} onChange={e => update(i, projects, setProjects, 'highlights', e.target.value)} placeholder="Highlights (separate with ; )" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
              <input value={p.tech} onChange={e => update(i, projects, setProjects, 'tech', e.target.value)} placeholder="Tech (comma-separated)" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
            </div>
          ))}
        </div>

        <div className="border rounded-lg border-neutral-300 dark:border-neutral-700 p-3">
          <div className="flex items-center justify-between"><h3 className="font-medium text-neutral-900 dark:text-white">Education</h3><button type="button" onClick={() => addRow(setEducation, { school: '', degree: '', period: '', details: '' })} className="text-blue-600">Add education</button></div>
          {education.map((ed, i) => (
            <div key={i} className="mt-3 grid md:grid-cols-2 gap-3">
              <input value={ed.school} onChange={e => update(i, education, setEducation, 'school', e.target.value)} placeholder="School" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
              <input value={ed.degree} onChange={e => update(i, education, setEducation, 'degree', e.target.value)} placeholder="Degree" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
              <input value={ed.period} onChange={e => update(i, education, setEducation, 'period', e.target.value)} placeholder="Period (e.g., 2020 - 2024)" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
              <input value={ed.details} onChange={e => update(i, education, setEducation, 'details', e.target.value)} placeholder="Details (optional)" className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="w-fit px-4 py-2 rounded-lg bg-blue-600 text-white font-medium disabled:opacity-60">{loading ? 'Generating…' : 'Generate Portfolio Content'}</button>
      </form>

      {result && (
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
            {result}
          </div>
          <PreviewPanel jsonText={result} />
        </div>
      )}
    </section>
  )
}

function PreviewPanel({ jsonText }) {
  let parsed
  try {
    parsed = JSON.parse(jsonText)
  } catch {
    return (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-neutral-700 dark:text-neutral-300">
        The AI did not return valid JSON yet. You can still copy the text result, or try regenerating.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Live Preview</h3>
      <p className="mt-1 text-neutral-600 dark:text-neutral-300">A quick visual of your portfolio content.</p>
      <div className="mt-4 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{parsed.hero || parsed.about || 'Your Name'}</h1>
          <p className="text-neutral-600 dark:text-neutral-300">{parsed.cta || parsed.summary}</p>
        </div>
        <div>
          <h2 className="font-semibold">Projects</h2>
          <ul className="mt-2 space-y-2">
            {(parsed.projects || []).map((p, i) => (
              <li key={i} className="rounded-md border border-neutral-200 dark:border-neutral-800 p-3">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-300">{p.blurb || p.description}</div>
                {p.tech && <div className="mt-1 text-xs text-blue-600">{Array.isArray(p.tech) ? p.tech.join(', ') : p.tech}</div>}
              </li>
            ))}
          </ul>
        </div>
        {parsed.skills && (
          <div>
            <h2 className="font-semibold">Skills</h2>
            <div className="mt-2 text-sm">{Array.isArray(parsed.skills) ? parsed.skills.join(', ') : parsed.skills}</div>
          </div>
        )}
      </div>
    </div>
  )
}
