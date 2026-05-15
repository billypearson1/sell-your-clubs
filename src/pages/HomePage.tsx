import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <section className="space-y-12">
      <div className="rounded-[32px] border border-slate-200 bg-[#F4F4F4] p-10 shadow-sm sm:p-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#00243D] px-4 py-2 text-sm font-semibold text-white">
              Trusted used golf club buying
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-[#00243D] sm:text-5xl">
              Sell your clubs fast, fold-free and with trusted payback.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#1A1A1A]/90">
              Get an instant quote, send your clubs for free, and receive PayPal payment within 2 working days of inspection.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/quote"
                className="inline-flex items-center justify-center rounded-full bg-[#00537E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#003f5d]"
              >
                Start your quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-4 text-sm font-semibold text-[#00243D] transition hover:bg-slate-50"
              >
                Admin login
              </Link>
            </div>
          </div>
          <div className="rounded-[28px] bg-white p-8 shadow-lg shadow-slate-200/50">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">How it works</p>
            <div className="mt-8 space-y-6">
              {[
                {
                  icon: <ShoppingBag className="h-6 w-6 text-[#00537E]" />,
                  title: 'Get a quote',
                  detail: 'Search your club model and add it to your basket instantly.',
                },
                {
                  icon: <Sparkles className="h-6 w-6 text-[#00537E]" />,
                  title: 'Send your clubs free',
                  detail: 'We email your postage label within 24 hours at no cost to you.',
                },
                {
                  icon: <ShieldCheck className="h-6 w-6 text-[#00537E]" />,
                  title: 'Get paid',
                  detail: 'Payment is sent by PayPal within 2 working days after verification.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-[#F4F4F4] p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00537E]/10 text-[#00537E]">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-[#00243D]">{item.title}</p>
                      <p className="text-sm leading-6 text-[#1A1A1A]/80">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Fast payment</p>
          <h2 className="mt-4 text-2xl font-semibold text-[#00243D]">PayPal in 2 days</h2>
          <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/85">
            We transfer your payout as soon as your clubs are verified at our grading centre.
          </p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Free shipping</p>
          <h2 className="mt-4 text-2xl font-semibold text-[#00243D]">No postage fees</h2>
          <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/85">
            Your postage label is emailed within 24 hours so you can send your clubs to us at no cost.
          </p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Trust & control</p>
          <h2 className="mt-4 text-2xl font-semibold text-[#00243D]">Clear pricing</h2>
          <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/85">
            Choose the condition that matches your clubs and see the exact payout before you accept.</p>
        </div>
      </div>
    </section>
  )
}
