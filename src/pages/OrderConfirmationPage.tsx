import { useLocation, Link } from 'react-router-dom'
import type { OrderRow } from '../lib/types'

export default function OrderConfirmationPage() {
  const location = useLocation()
  const order = (location.state as { order?: OrderRow } | null)?.order

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-10 shadow-sm">
      <div className="max-w-3xl space-y-6">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Order confirmed</p>
        <h1 className="text-4xl font-semibold text-[#00243D]">Thanks — your collection label is on its way.</h1>
        <p className="text-base leading-8 text-[#1A1A1A]/85">
          We’ll email your free postage label within 24 hours and send payment via PayPal within 2 working days of receiving and verifying your clubs.
        </p>

        {order ? (
          <div className="rounded-[28px] border border-slate-200 bg-[#F4F4F4] p-6">
            <p className="text-sm font-semibold text-[#00243D]">Order reference</p>
            <p className="mt-1 text-lg text-[#1A1A1A]">{order.id}</p>
            <p className="mt-4 text-sm text-[#1A1A1A]/85">Total confirmed: £{order.total_amount.toFixed(2)}</p>
          </div>
        ) : null}

        <Link
          to="/quote"
          className="inline-flex items-center justify-center rounded-full bg-[#00537E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#003f5d]"
        >
          Build another quote
        </Link>
      </div>
    </section>
  )
}
