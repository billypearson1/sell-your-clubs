import { ShoppingBag, Package, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 py-10">
      <section>
        <h1 className="text-3xl font-semibold text-[#00243D]">How It Works</h1>
        <p className="mt-4 text-base leading-7 text-[#1A1A1A]/85">
          Selling your golf clubs with us takes just a few minutes. Here's how the process works from start to finish.
        </p>
      </section>

      <section className="space-y-8">
        <div className="flex gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#00537E] text-white">
            <ShoppingBag />
          </div>
          <div>
            <p className="text-lg font-semibold text-[#00243D]">1. Get an instant quote</p>
            <p className="mt-2 text-sm leading-7 text-[#1A1A1A]/85">
              Search for your club by brand or model, select the condition and any relevant specs, and see your offer price instantly. Add as many clubs as you like to build your basket.
            </p>
          </div>
        </div>

        <div className="flex gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#00537E] text-white">
            <Package />
          </div>
          <div>
            <p className="text-lg font-semibold text-[#00243D]">2. Send your clubs for free</p>
            <p className="mt-2 text-sm leading-7 text-[#1A1A1A]/85">
              Accept your offer and complete your details. We'll email a free postage label to you within 24 hours. Pack your clubs securely and drop them at your nearest drop-off point — it costs you nothing.
            </p>
          </div>
        </div>

        <div className="flex gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#00537E] text-white">
            <CreditCard />
          </div>
          <div>
            <p className="text-lg font-semibold text-[#00243D]">3. Get paid via PayPal</p>
            <p className="mt-2 text-sm leading-7 text-[#1A1A1A]/85">
              Once we receive and verify your clubs we'll send your payment via PayPal within 2 working days. No waiting around — fast, secure and reliable.
            </p>
          </div>
        </div>
      </section>

      <div className="rounded-[28px] bg-[#00537E] p-8 text-white">
        <h2 className="text-xl font-semibold">Ready to sell?</h2>
        <p className="mt-2 text-sm leading-7">Get your instant valuation now — no obligation.</p>
        <Link to="/quote" className="mt-4 inline-flex items-center justify-center rounded-[8px] bg-white px-6 py-3 text-sm font-semibold text-[#00537E] hover:bg-slate-100">
          Get a quote
        </Link>
      </div>
    </div>
  )
}
