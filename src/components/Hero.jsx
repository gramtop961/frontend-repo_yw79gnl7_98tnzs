import Spline from '@splinetool/react-spline'

export default function Hero({ onNavigate }) {
  return (
    <section className="relative min-h-[70vh] grid md:grid-cols-2 items-center overflow-hidden">
      <div className="order-2 md:order-1 p-8 md:p-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white">PortfolioPal</h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 max-w-prose">Build a beautiful portfolio and generate polished project write-ups with AI. Modern, responsive, and multilingual by design.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => onNavigate('builder')} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">Build Portfolio</button>
          <button onClick={() => onNavigate('writer')} className="px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium hover:opacity-90">AI Project Writer</button>
        </div>
      </div>
      <div className="order-1 md:order-2 h-[50vh] md:h-[70vh]">
        <Spline scene="https://prod.spline.design/VJLoxp84lCdVfdZu/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-white/10 dark:from-neutral-950/60 dark:via-transparent dark:to-neutral-950/10"></div>
      </div>
    </section>
  )
}
