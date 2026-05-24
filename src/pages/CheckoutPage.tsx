import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import type { QuoteItem, OrderPayload } from '../lib/types'
import { conditionLabels } from '../lib/quoteHelpers'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { items, total } = (location.state as { items: QuoteItem[]; total: number }) ?? { items: [], total: 0 }

  const [step, setStep] = useState(1)
  const [contact, setContact] = useState({
    full_name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    town: '',
    county: '',
    postcode: '',
  })
  const [needsBox, setNeedsBox] = useState<boolean | null>(null)
  const [paypalEmail, setPaypalEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canAdvanceToPayment = [
    contact.full_name,
    contact.email,
    contact.phone,
    contact.address_line1,
    contact.town,
    contact.postcode,
  ].every(Boolean) && needsBox !== null

  const canSubmit = paypalEmail.trim().length > 5

  async function submitOrder() {
    if (!items.length) return
    setIsSubmitting(true)

    const payload: OrderPayload = {
      ...contact,
      paypal_email: paypalEmail,
      needs_box: needsBox ?? false,
      items,
      total_amount: total,
    }

    try {
      const edgeUrl = import.meta.env.VITE_SUPABASE_EDGE_URL
      if (!edgeUrl) throw new Error('Edge function URL is not configured')

      const response = await fetch(`${edgeUrl}/send-order-email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
})

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Order submission failed')
      }

      const result = await response.json()
      toast.success('Order submitted successfully.')
      navigate('/order-confirmation', { state: { order: result.order } })
    } catch (error) {
      toast.error((error as Error).message || 'Unable to submit order.')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!items.length) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-[#00243D]">Your basket is empty</p>
        <p className="mt-3 text-sm text-[#1A1A1A]/80">Go back and add some clubs to your quote first.</p>
        <button
          type="button"
          onClick={() => navigate('/quote')}
          className="mt-6 inline-flex items-center justify-center rounded-[8px] bg-[#00537E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#003f5d]"
        >
          Back to quote tool
        </button>
      </div>
    )
  }

  return (
    <section className="space-y-10">
      <div className="rounded-[28px] border border-slate-200 bg-[#F4F4F4] p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Checkout</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#00243D]">Complete your order</h1>
            <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/85">
              Fill in your details below and we'll be in touch within 24 hours.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/quote')}
            className="text-sm font-semibold text-[#00537E] hover:text-[#003f5d]"
          >
            ← Back to quote
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => n < step && setStep(n)}
                className={`rounded-[8px] border px-4 py-3 text-sm font-semibold ${
                  step === n
                    ? 'border-[#00537E] bg-[#EAF7FF] text-[#00537E]'
                    : 'border-slate-200 bg-white text-[#1A1A1A]/80'
                }`}
              >
                {n === 1 ? '1. Contact details' : n === 2 ? '2. PayPal details' : '3. Confirm & submit'}
              </button>
            ))}
          </div>

          {step === 1 && (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Full name', name: 'full_name', value: contact.full_name },
                  { label: 'Email', name: 'email', value: contact.email, type: 'email' },
                  { label: 'Phone number', name: 'phone', value: contact.phone, type: 'tel' },
                  { label: 'Address Line 1', name: 'address_line1', value: contact.address_line1 },
                  { label: 'Address Line 2 (optional)', name: 'address_line2', value: contact.address_line2 },
                  { label: 'Town / City', name: 'town', value: contact.town },
                  { label: 'County (optional)', name: 'county', value: contact.county },
                  { label: 'Postcode', name: 'postcode', value: contact.postcode },
                ].map((field) => (
                  <label key={field.name} className="block text-sm font-medium text-[#00243D]">
                    {field.label}
                    <input
                      value={field.value}
                      type={field.type ?? 'text'}
                      onChange={(e) => setContact((c) => ({ ...c, [field.name]: e.target.value }))}
                      className="mt-3 w-full rounded-[8px] border border-slate-300 bg-[#F9FAFB] px-4 py-4 text-sm text-[#1A1A1A] focus:border-[#00537E] focus:ring-2 focus:ring-[#00537E]/20"
                    />
                  </label>
                ))}

                <div className="col-span-2 mt-2">
                  <p className="text-sm font-medium text-[#00243D]">Postage box</p>
                  <p className="mt-1 text-sm text-[#1A1A1A]/80">Do you need us to send you a free postage box, or do you already have suitable packaging?</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setNeedsBox(true)}
                      className={`rounded-[8px] border px-4 py-3 text-sm font-semibold text-left transition ${needsBox === true ? 'border-[#00537E] bg-[#EAF7FF] text-[#00537E]' : 'border-slate-200 bg-white text-[#00243D] hover:bg-slate-50'}`}
                    >
                      Send me a free postage box
                    </button>
                    <button
                      type="button"
                      onClick={() => setNeedsBox(false)}
                      className={`rounded-[8px] border px-4 py-3 text-sm font-semibold text-left transition ${needsBox === false ? 'border-[#00537E] bg-[#EAF7FF] text-[#00537E]' : 'border-slate-200 bg-white text-[#00243D] hover:bg-slate-50'}`}
                    >
                      I already have packaging
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canAdvanceToPayment}
                className="mt-6 inline-flex items-center justify-center rounded-[8px] bg-[#00537E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#003f5d] disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                Continue to payment details
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <label className="block text-sm font-medium text-[#00243D]">
                PayPal email address
                <input
                  value={paypalEmail}
                  type="email"
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  className="mt-3 w-full rounded-[8px] border border-slate-300 bg-[#F9FAFB] px-4 py-4 text-sm text-[#1A1A1A] focus:border-[#00537E] focus:ring-2 focus:ring-[#00537E]/20"
                />
              </label>
              <div className="mt-6 rounded-[28px] border border-slate-200 bg-[#F4F4F4] p-5">
                <p className="text-sm font-semibold text-[#00243D]">Payment reassurance</p>
                <p className="mt-2 text-sm leading-7 text-[#1A1A1A]/85">
                  We'll send payment to your PayPal within 2 working days of receiving and verifying your clubs.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-[8px] border border-slate-300 bg-white px-6 py-4 text-sm font-semibold text-[#00243D] transition hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canSubmit}
                  className="rounded-[8px] bg-[#00537E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#003f5d] disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  Review & confirm
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-base font-semibold text-[#00243D]">Review your order</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-[28px] bg-[#F4F4F4] p-5">
                  <p className="font-semibold text-[#00243D]">Postage</p>
                  <p className="mt-2 text-sm text-[#1A1A1A]/85">
                    {needsBox
                      ? `We'll send a free postage box and label to ${contact.address_line1}, ${contact.town}, ${contact.postcode} within 24 hours.`
                      : `We'll email your free postage label to ${contact.email} within 24 hours. Use your own packaging.`}
                  </p>
                </div>
                <div className="rounded-[28px] bg-[#F4F4F4] p-5">
                  <p className="font-semibold text-[#00243D]">PayPal payment</p>
                  <p className="mt-2 text-sm text-[#1A1A1A]/85">
                    £{total.toFixed(2)} will be sent to {paypalEmail} within 2 working days of us receiving and verifying your clubs.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-[8px] border border-slate-300 bg-white px-6 py-4 text-sm font-semibold text-[#00243D] transition hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={submitOrder}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-[8px] bg-[#00537E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#003f5d] disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSubmitting ? 'Submitting…' : `Submit order — £${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Order summary</p>
              <span className="rounded-full bg-[#EAF7FF] px-3 py-1 text-sm font-semibold text-[#00537E]">{items.length} items</span>
            </div>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-[28px] border border-slate-200 bg-[#F4F4F4] p-4">
                  <p className="font-semibold text-[#00243D]">{item.title}</p>
                  <p className="mt-1 text-sm text-[#1A1A1A]/80">Condition: {conditionLabels[item.condition]}</p>
                  <p className="mt-2 text-sm font-semibold text-[#00537E]">£{item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4 flex items-center justify-between">
              <p className="font-semibold text-[#00243D]">Total offer</p>
              <p className="text-xl font-semibold text-[#00537E]">£{total.toFixed(2)}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
