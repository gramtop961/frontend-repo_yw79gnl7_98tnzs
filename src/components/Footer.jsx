export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-neutral-600 dark:text-neutral-300">
        <p>© {new Date().getFullYear()} PortfolioPal. Built with love and AI.</p>
        <p>Credits: 3D scene by Spline • Icons by Lucide • UI with Tailwind</p>
      </div>
    </footer>
  )
}
