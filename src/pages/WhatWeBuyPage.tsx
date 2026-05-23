import { Link } from 'react-router-dom'

const categories = [
  { name: 'Drivers', description: 'All major brands from 2010 onwards.' },
  { name: 'Fairway Woods', description: '3 wood, 5 wood and beyond.' },
  { name: 'Hybrids', description: 'Rescue clubs from all major manufacturers.' },
  { name: 'Iron Sets', description: 'Full sets and part sets considered.' },
  { name: 'Individual Irons', description: 'Single irons including long irons and gap fillers.' },
  { name: 'Wedges', description: 'Pitching, gap, sand and lob wedges.' },
  { name: 'Putters', description: 'Blade, mallet and counterbalance putters.' },
  { name: 'Complete Bags', description: 'Full sets including bag.' },
]

const brands = ['Callaway', 'TaylorMade', 'Titleist', 'Ping', 'Cobra', 'Cleveland', 'Mizuno', 'Srixon', 'Odyssey', 'Scotty Cameron', 'Wilson', 'Benross']

export default function WhatWeBuyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 py-10">
      <section>
        <h1 className="text-3xl font-semibold text-[#00243D]">What We Buy</h1>
        <p className="mt-4 text-base leading-7 text-[#1A1A1A]/85">
          We buy a wide range of used golf clubs from all the major brands. Here's a guide to what we accept.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#00243D]">Club types</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {categories.map((cat) => (
            <div key={cat.name} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-[#00243D]">{cat.name}</p>
              <p className="mt-1 text-sm text-[#1A1A1A]/80">{cat.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#00243D]">Brands we buy</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {brands.map((brand) => (
            <span key={brand} className="rounded-full bg-[#EAF7FF] px-4 py-2 text-sm font-semibold text-[#00537E]">{brand}</span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#00243D]">Condition we accept</h2>
        <div className="mt-4 space-y-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-semibold text-[#00243D]">New</p>
            <p className="mt-1 text-sm text-[#1A1A1A]/80">Unused, mint condition with no signs of wear.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-semibold text-[#00243D]">Excellent</p>
            <p className="mt-1 text-sm text-[#1A1A1A]/80">Lightly used with minimal marks.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-semibold text-[#00243D]">Fair</p>
            <p className="mt-1 text-sm text-[#1A1A1A]/80">Well-used with cosmetic wear. No dents or cracks.</p>
          </div>
        </div>
      </section>

      <div className="rounded-[28px] bg-[#00537E] p-8 text-white">
        <h2 className="text-xl font-semibold">Not sure if we buy your clubs?</h2>
        <p className="mt-2 text-sm leading-7">Search in our quote tool — if your club is listed we'll buy it.</p>
        <Link to="/quote" className="mt-4 inline-flex items-center justify-center rounded-[8px] bg-white px-6 py-3 text-sm font-semibold text-[#00537E] hover:bg-slate-100">
          Get a quote
        </Link>
      </div>
    </div>
  )
}
