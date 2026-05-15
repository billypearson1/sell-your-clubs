import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-2xl rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Page not found</p>
      <h1 className="mt-4 text-4xl font-semibold text-[#00243D]">404</h1>
      <p className="mt-4 text-base leading-7 text-[#1A1A1A]/85">
        The page you’re looking for doesn’t exist. Return to the quote tool or homepage.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link className="rounded-full bg-[#00537E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#003f5d]" to="/">
          Homepage
        </Link>
        <Link className="rounded-full border border-slate-300 bg-white px-6 py-4 text-sm font-semibold text-[#00243D] transition hover:bg-slate-50" to="/quote">
          Quote tool
        </Link>
      </div>
    </section>
  )
}
