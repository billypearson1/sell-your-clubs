import { Link } from 'react-router-dom'
import { Zap, Package, Banknote, Trophy, ArrowRight } from 'lucide-react'
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
      a: 'We accept clubs in New, Excellent and Fair condition. Select the option that best matches your club during the quote process. We provide guidance to help you self-assess.',
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
        <div className="mx-auto flex max-w-7xl flex-col-reverse gap-8 px-4 py-[22px] sm:flex-row sm:items-center sm:py-[50px]">
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
              className="h-[270px] w-[270px] max-w-[90vw] rounded-full object-cover shadow-[0_20px_45px_rgba(0,0,0,0.12)] sm:h-[380px] sm:w-[380px]"
            />
          </div>
        </div>
      </section>

      {/* Brand strip */}
      <div className="-mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)] bg-[#F4F4F4]">
        <div className="grid grid-cols-4 sm:grid-cols-8 w-full px-4 py-4 text-sm font-semibold text-[#00243D] sm:px-6">
          {['Callaway', 'TaylorMade', 'Titleist', 'Ping', 'Cobra', 'Cleveland', 'Mizuno', 'Srixon'].map((b) => (
            <div key={b} className="opacity-90 text-center">{b}</div>
          ))}
        </div>
      </div>

      {/* Why sell with us */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <h2 className="text-3xl font-semibold text-[#00243D]">Why sell with us?</h2>
<p className="mt-3 text-lg text-[#1A1A1A]/80">No listings, no waiting, no hassle. Just an instant offer and fast payment.</p>
<div className="mt-3" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: <Zap className="h-6 w-6 text-[#00537E]" />, title: 'Instant offer', desc: 'See exactly what your clubs are worth before you commit. No obligation, no waiting.' },
            { icon: <Package className="h-6 w-6 text-[#00537E]" />, title: 'Free postage', desc: 'We provide a free postage label and box. It costs you nothing to send your clubs.' },
            { icon: <Banknote className="h-6 w-6 text-[#00537E]" />, title: 'Fast PayPal payment', desc: 'Payment sent via PayPal within 2 working days of us receiving and verifying your clubs.' },
            { icon: <Trophy className="h-6 w-6 text-[#00537E]" />, title: 'Price match guarantee', desc: "We'll beat any price from another golf buyback site — or pay you £10 more." },
          ].map((item) => (
            <div key={item.title} className="p-2">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#EAF7FF]">
                  {item.icon}
                </div>
                <p className="text-lg font-semibold text-[#00243D]">{item.title}</p>
              </div>
              <p className="mt-3 text-base leading-7 text-[#1A1A1A]/80">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <div className="-mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)] bg-[#EAF7FF] mt-16">
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-semibold text-[#00243D]">How it works</h2>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-stretch">
            <div className="flex w-full flex-col gap-3 sm:w-1/3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00537E] text-white text-xl font-bold">1</div>
              <p className="text-lg font-semibold text-[#00243D]">Search your clubs</p>
              <p className="text-base text-[#1A1A1A]/80">Search and add clubs to your basket for an instant offer.</p>
            </div>

            <div className="hidden sm:flex items-center px-4">
              <ArrowRight className="h-6 w-6 text-[#00537E]" strokeWidth={2} />
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-1/3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00537E] text-white text-xl font-bold">2</div>
              <p className="text-lg font-semibold text-[#00243D]">Send your clubs free</p>
              <p className="text-base text-[#1A1A1A]/80">No box? No problem. We'll send a free box straight to your door.</p>
            </div>

            <div className="hidden sm:flex items-center px-4">
              <ArrowRight className="h-6 w-6 text-[#00537E]" strokeWidth={2} />
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-1/3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00537E] text-white text-xl font-bold">3</div>
              <p className="text-lg font-semibold text-[#00243D]">Get paid</p>
              <p className="text-base text-[#1A1A1A]/80">PayPal payment sent within 48 hours of receiving your clubs.</p>
            </div>
          </div>
        </section>
      </div>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-20 sm:px-6">
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
