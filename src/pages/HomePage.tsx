import { Link } from 'react-router-dom'
import { ShoppingBag, Package, CreditCard } from 'lucide-react'
import golfbag from '../assets/golfbag.jpg'
import { useState } from 'react'

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const faqs = [
    {
      q: 'How do I send my clubs?',
      a: "After accepting your offer, we'll send you a free postage box and label within 24 hours. Simply pack your clubs and drop them at your nearest drop off point — it's completely free to you.",
    },
    {
      q: 'When do I get paid?',
      a: 'Once we receive and inspect your clubs, PayPal payments are sent within 48 hours of verification. Typical turnaround is 2–5 business days depending on shipping time.',
    },
    {
      q: 'What condition do you accept?',
      a: 'We accept clubs in New, Excellent, Good and Fair condition. Select the option that best matches your club during the quote process. We provide guidance to help you self-assess.',
    },
    {
      q: "What if my club isn't listed?",
      a: 'If your club is not listed in the search results, please contact us and we may be able to provide a quote.',
    },
  ]

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative -mt-10 -mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)] bg-[#00537E] text-white flex items-center">
        <div className="mx-auto flex max-w-7xl flex-col-reverse gap-8 px-4 py-[12px] sm:flex-row sm:items-center sm:py-[30px]">
          <div className="sm:w-1/2">
            <h1 className="text-4xl font-bold sm:text-5xl">Sell your golf clubs today.</h1>
            <p className="mt-4 text-lg">Instant offer, free postage, fast payment.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/quote" className="rounded-[8px] bg-[#00243D] px-6 py-4 text-sm font-semibold text-white hover:bg-[#001a30]">Start selling now</Link>
            </div>
          </div>

          <div className="sm:w-1/2 flex items-center justify-center">
            <img
              src={golfbag}
              alt="Golf bag"
              className="h-[180px] w-[180px] max-w-[90vw] rounded-full border-4 border-white object-cover shadow-[0_20px_45px_rgba(0,0,0,0.12)] sm:h-[260px] sm:w-[260px]"
            />
          </div>
        </div>
      </section>

      {/* Brand strip */}
      <div className="-mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)] bg-[#F4F4F4]">
  <div className="grid grid-cols-4 sm:grid-cols-8 w-full px-4 py-4 text-sm font-semibold text-[#00243D] sm:px-6">
          {['Callaway','TaylorMade','Titleist','Ping','Cobra','Cleveland','Mizuno','Srixon'].map((b) => (
            <div key={b} className="opacity-90 text-center">{b}</div>
          ))}
        </div>
      </div>

{/* Why sell with us */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <h2 className="text-3xl font-semibold text-[#00243D]">Why sell with us?</h2>
<p className="mt-3 text-base text-[#1A1A1A]/80">No listings, no waiting, no hassle. Just an instant offer and fast payment.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: '⚡',
              title: 'Instant offer',
              desc: 'See exactly what your clubs are worth before you commit. No obligation, no waiting.',
            },
            {
              icon: '📦',
              title: 'Free postage',
              desc: "We send a free postage label to your door. It costs you nothing to send your clubs.",
            },
            {
              icon: '💷',
              title: 'Fast PayPal payment',
              desc: 'Payment sent via PayPal within 2 working days of us receiving and verifying your clubs.',
            },
            {
              icon: '🏆',
              title: 'Price match guarantee',
              desc: "We'll beat any price from another golf buyback site — or pay you £10 more.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-3xl">{item.icon}</div>
              <p className="mt-4 font-semibold text-[#00243D]">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/80">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <h2 className="text-3xl font-semibold text-[#00243D]">How it works</h2>
        <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-stretch">
          <div className="flex w-full items-center gap-4 sm:w-1/3">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#00537E] text-white"><ShoppingBag /></div>
            <div>
              <p className="font-semibold">Search your clubs</p>
              <p className="text-sm text-[#1A1A1A]/80">Search and add clubs to your basket for an instant offer.</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center px-4 text-[#00537E]">→</div>

          <div className="flex w-full items-center gap-4 sm:w-1/3">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#00537E] text-white"><Package /></div>
            <div>
              <p className="font-semibold">Send your clubs free</p>
              <p className="text-sm text-[#1A1A1A]/80">We'll send a free box and postage label straight to your door.</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center px-4 text-[#00537E]">→</div>

          <div className="flex w-full items-center gap-4 sm:w-1/3">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#00537E] text-white"><CreditCard /></div>
            <div>
              <p className="font-semibold">Get paid</p>
              <p className="text-sm text-[#1A1A1A]/80">PayPal payment sent within 48 hours of receiving your clubs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <h2 className="text-3xl font-semibold text-[#00243D]">Frequently asked questions</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="rounded-lg border border-slate-200 bg-white p-4">
              <button className="w-full text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{f.q}</p>
                  <span className="text-sm text-[#00537E]">{openFaq === i ? '−' : '+'}</span>
                </div>
              </button>
              {openFaq === i ? <p className="mt-3 text-sm text-[#1A1A1A]/80">{f.a}</p> : null}
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
