import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import type { Club, ConditionTier, QuoteItem, QuoteSpec, OrderPayload } from '../lib/types'
import {
  availableConditions,
  clubTypeLabels,
  conditionDescriptions,
  conditionLabels,
  getClubFields,
  getConditionPrice,
  createClubSearch,
} from '../lib/quoteHelpers'

const initialSpec: QuoteSpec = {}

function createQuoteLabel(club: Club) {
  return `${club.brand} ${club.model} — ${clubTypeLabels[club.club_type]}`
}

export default function QuotePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [selectedCondition, setSelectedCondition] = useState<ConditionTier | ''>('')
  const [specs, setSpecs] = useState<QuoteSpec>(initialSpec)
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [step, setStep] = useState(1)
  const [contact, setContact] = useState({ full_name: '', email: '', phone: '', collection_address: '' })
  const [paypalEmail, setPaypalEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: clubs = [], isLoading } = useQuery<Club[]>({
    queryKey: ['clubs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('clubs').select('*').order('brand', { ascending: true })
      if (error) throw error
      return data || []
    },
    staleTime: 1000 * 60,
  })

  const filteredClubs = useMemo(() => {
    const searchFn = createClubSearch(clubs)
    return searchFn(search)
  }, [clubs, search])

  const currentPrice = selectedClub && selectedCondition ? getConditionPrice(selectedClub, selectedCondition) : 0
  const total = quoteItems.reduce((sum, item) => sum + item.price, 0)

  const canAdvanceToPayment = Object.values(contact).every(Boolean) && step === 1
  const canSubmit = paypalEmail.trim().length > 5 && step === 2

  async function handleAddToQuote() {
    if (!selectedClub || !selectedCondition) {
      toast.error('Choose a club and condition before adding to your quote.')
      return
    }

    const newItem: QuoteItem = {
      id: crypto.randomUUID(),
      clubId: selectedClub.id,
      title: createQuoteLabel(selectedClub),
      type: selectedClub.club_type,
      specs,
      condition: selectedCondition,
      price: currentPrice,
    }

    setQuoteItems((items) => [...items, newItem])
    setSelectedClub(null)
    setSelectedCondition('')
    setSpecs(initialSpec)
    toast.success('Club added to your quote.')
  }

  function handleRemoveItem(id: string) {
    setQuoteItems((items) => items.filter((item) => item.id !== id))
  }

  function resetForm() {
    setShowCheckout(false)
    setStep(1)
    setContact({ full_name: '', email: '', phone: '', collection_address: '' })
    setPaypalEmail('')
  }

  async function submitOrder() {
    if (!quoteItems.length) return
    setIsSubmitting(true)
    const payload: OrderPayload = {
      ...contact,
      paypal_email: paypalEmail,
      items: quoteItems,
      total_amount: total,
    }

    try {
      const edgeUrl = import.meta.env.VITE_SUPABASE_EDGE_URL
      if (!edgeUrl) {
        throw new Error('Edge function URL is not configured')
      }

      const response = await fetch(`${edgeUrl}/send-order-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Order submission failed')
      }

      const result = await response.json()
      toast.success('Order submitted successfully. Check your email for the postage label.')
      setQuoteItems([])
      resetForm()
      navigate('/order-confirmation', { state: { order: result.order } })
    } catch (error) {
      toast.error((error as Error).message || 'Unable to submit order.')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableConditionsList = selectedClub ? availableConditions(selectedClub) : []
  const selectedFields = selectedClub ? getClubFields(selectedClub.club_type) : []

  return (
    <div className="space-y-10">
      <div className="rounded-[28px] border border-slate-200 bg-[#F4F4F4] p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Instant quote tool</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#00243D] sm:text-4xl">Find the current value of your golf clubs.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#1A1A1A]/85">
              Type a brand or model name to see whether we buy your club, then add the exact condition and specs to build your basket.
            </p>
          </div>
        </div>
      </div>

      <section className="grid gap-8 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <label className="block text-sm font-semibold text-[#00243D]">Search clubs</label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by brand, model or type"
              className="mt-3 w-full rounded-3xl border border-slate-300 bg-[#F9FAFB] px-4 py-4 text-sm text-[#1A1A1A] focus:border-[#00537E] focus:ring-2 focus:ring-[#00537E]/20"
            />

            <div className="mt-6 space-y-3">
              {isLoading ? (
                <div className="rounded-3xl bg-slate-100 p-6 text-sm text-slate-500">Loading clubs…</div>
              ) : filteredClubs.length ? (
                filteredClubs.map((club) => (
                  <button
                    key={club.id}
                    type="button"
                    onClick={() => {
                      setSelectedClub(club)
                      setSelectedCondition('')
                      setSpecs(initialSpec)
                    }}
                    className="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-[#F4F4F4] px-5 py-4 text-left transition hover:border-[#00537E]"
                  >
                    <div>
                      <p className="font-semibold text-[#00243D]">{club.brand} {club.model}</p>
                      <p className="text-sm text-[#1A1A1A]/80">{clubTypeLabels[club.club_type]}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#00537E]">Select</span>
                  </button>
                ))
              ) : (
                <div className="rounded-3xl bg-[#F4F4F4] p-6 text-sm text-[#1A1A1A]/80">
                  We don't currently buy this club. Try another brand or model.
                </div>
              )}
            </div>
          </div>

          {selectedClub ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Selected club</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#00243D]">{selectedClub.brand} {selectedClub.model}</h2>
                  <p className="text-sm text-[#1A1A1A]/80">{clubTypeLabels[selectedClub.club_type]}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF7FF] px-4 py-2 text-sm font-semibold text-[#00537E]">
                  {availableConditionsList.length} condition options available
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {selectedFields.map((field) => {
                  if (field.name === 'conditionOnly') return null
                  const value = specs[field.name as keyof QuoteSpec] ?? ''
                  const options = Array.isArray(field.options) ? field.options : []
                  return (
                    <label key={field.name} className="block text-sm font-medium text-[#00243D]">
                      {field.label}
                      <select
                        value={value}
                        onChange={(event) =>
                          setSpecs((current) => ({
                            ...current,
                            [field.name]: event.target.value,
                          }))
                        }
                        className="mt-3 w-full rounded-3xl border border-slate-300 bg-[#F9FAFB] px-4 py-4 text-sm text-[#1A1A1A] focus:border-[#00537E] focus:ring-2 focus:ring-[#00537E]/20"
                      >
                        <option value="">Select {field.label.toLowerCase()}</option>
                        {options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  )
                })}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-[#00243D]">
                  Condition
                  <select
                    value={selectedCondition}
                    onChange={(event) => setSelectedCondition(event.target.value as ConditionTier)}
                    className="mt-3 w-full rounded-3xl border border-slate-300 bg-[#F9FAFB] px-4 py-4 text-sm text-[#1A1A1A] focus:border-[#00537E] focus:ring-2 focus:ring-[#00537E]/20"
                  >
                    <option value="">Select the condition that fits your club</option>
                    {availableConditionsList.map((condition) => (
                      <option key={condition} value={condition}>{conditionLabels[condition]}</option>
                    ))}
                  </select>
                </label>
                <div className="rounded-3xl border border-slate-200 bg-[#F4F4F4] p-5">
                  <p className="text-sm font-semibold text-[#00243D]">Condition guide</p>
                  <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/85">Use this guide to self-assess your club condition before choosing.</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(['new', 'excellent', 'good', 'fair'] as ConditionTier[]).map((condition) => {
                  const price = getConditionPrice(selectedClub, condition)
                  if (price <= 0) return null
                  return (
                    <div key={condition} className="rounded-3xl border border-slate-200 bg-[#F9FAFB] p-4">
                      <p className="text-sm font-semibold text-[#00243D]">{conditionLabels[condition]}</p>
                      <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/80">{conditionDescriptions[condition]}</p>
                      <p className="mt-4 text-lg font-semibold text-[#00537E]">£{price.toFixed(2)}</p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Quote value</p>
                  <p className="mt-2 text-3xl font-semibold text-[#00537E]">£{currentPrice.toFixed(2)}</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddToQuote}
                  className="inline-flex items-center justify-center rounded-full bg-[#00537E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#003f5d] disabled:cursor-not-allowed disabled:bg-slate-400"
                  disabled={!selectedCondition}
                >
                  Add to quote
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Your basket</p>
                <p className="mt-2 text-3xl font-semibold text-[#00243D]">£{total.toFixed(2)}</p>
              </div>
              <span className="rounded-full bg-[#EAF7FF] px-4 py-2 text-sm font-semibold text-[#00537E]">{quoteItems.length} items</span>
            </div>

            <div className="mt-6 space-y-3">
              {quoteItems.length ? (
                quoteItems.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 bg-[#F4F4F4] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#00243D]">{item.title}</p>
                        <p className="mt-1 text-sm text-[#1A1A1A]/80">{item.condition && conditionLabels[item.condition]}</p>
                        <p className="mt-2 text-sm text-[#1A1A1A]/80">
                          {Object.entries(item.specs)
                            .filter(([, value]) => value)
                            .map(([key, value]) => `${key.replace('_', ' ')}: ${value}`)
                            .join(' · ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-[#00537E]">£{item.price.toFixed(2)}</p>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="mt-3 text-sm font-semibold text-[#00243D] hover:text-[#00537E]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-[#F4F4F4] p-6 text-sm text-[#1A1A1A]/85">
                  Add clubs to your quote and then accept the offer to continue.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowCheckout(true)}
              className="mt-6 w-full rounded-full bg-[#00537E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#003f5d] disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={!quoteItems.length}
            >
              Accept offer
            </button>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-[#F4F4F4] p-6 shadow-sm">
            <p className="font-semibold text-[#00243D]">Secure payment promise</p>
            <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/85">
              We use PayPal so you get your payment safely within 2 working days after we receive and verify your clubs.</p>
          </div>
        </aside>
      </section>

      {showCheckout ? (
        <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Checkout</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#00243D]">Review & submit your order</h2>
            </div>
            <button type="button" onClick={resetForm} className="text-sm font-semibold text-[#00537E] hover:text-[#003f5d]">
              Cancel checkout
            </button>
          </div>

          <div className="mt-8 space-y-10">
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={`rounded-3xl border px-4 py-3 text-sm font-semibold ${step === 1 ? 'border-[#00537E] bg-[#EAF7FF] text-[#00537E]' : 'border-slate-200 bg-white text-[#1A1A1A]/80'}`}
                  >
                    1. Contact details
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className={`rounded-3xl border px-4 py-3 text-sm font-semibold ${step === 2 ? 'border-[#00537E] bg-[#EAF7FF] text-[#00537E]' : 'border-slate-200 bg-white text-[#1A1A1A]/80'}`}
                  >
                    2. PayPal details
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className={`rounded-3xl border px-4 py-3 text-sm font-semibold ${step === 3 ? 'border-[#00537E] bg-[#EAF7FF] text-[#00537E]' : 'border-slate-200 bg-white text-[#1A1A1A]/80'}`}
                  >
                    3. Confirmation
                  </button>
                </div>

                {step === 1 ? (
                  <div className="rounded-3xl border border-slate-200 bg-[#F4F4F4] p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        { label: 'Full name', name: 'full_name', value: contact.full_name },
                        { label: 'Email', name: 'email', value: contact.email, type: 'email' },
                        { label: 'Phone number', name: 'phone', value: contact.phone, type: 'tel' },
                        { label: 'Collection address', name: 'collection_address', value: contact.collection_address, type: 'text' },
                      ].map((field) => (
                        <label key={field.name} className="block text-sm font-medium text-[#00243D]">
                          {field.label}
                          <input
                            value={field.value}
                            type={field.type ?? 'text'}
                            onChange={(event) => setContact((current) => ({ ...current, [field.name]: event.target.value }))}
                            className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-[#1A1A1A] focus:border-[#00537E] focus:ring-2 focus:ring-[#00537E]/20"
                          />
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!canAdvanceToPayment}
                      className="mt-6 inline-flex items-center justify-center rounded-full bg-[#00537E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#003f5d] disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      Continue to payment details
                    </button>
                  </div>
                ) : step === 2 ? (
                  <div className="rounded-3xl border border-slate-200 bg-[#F4F4F4] p-6">
                    <label className="block text-sm font-medium text-[#00243D]">
                      PayPal email address
                      <input
                        value={paypalEmail}
                        type="email"
                        onChange={(event) => setPaypalEmail(event.target.value)}
                        className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-[#1A1A1A] focus:border-[#00537E] focus:ring-2 focus:ring-[#00537E]/20"
                      />
                    </label>
                    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
                      <p className="text-sm font-semibold text-[#00243D]">Payment reassurance</p>
                      <p className="mt-2 text-sm leading-7 text-[#1A1A1A]/85">
                        We'll send payment to your PayPal within 2 working days of receiving and verifying your clubs.
                      </p>
                    </div>
                    <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="rounded-full border border-slate-300 bg-white px-6 py-4 text-sm font-semibold text-[#00243D] transition hover:bg-slate-50"
                      >
                        Back to contact
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        disabled={!canSubmit}
                        className="rounded-full bg-[#00537E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#003f5d] disabled:cursor-not-allowed disabled:bg-slate-400"
                      >
                        Review confirmation
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-[#F4F4F4] p-6">
                    <p className="text-base font-semibold text-[#00243D]">Confirmation summary</p>
                    <div className="mt-4 space-y-4">
                      <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <p className="font-semibold text-[#00243D]">Delivery</p>
                        <p className="mt-2 text-sm text-[#1A1A1A]/85">We will email your free postage label within 24 hours.</p>
                      </div>
                      <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <p className="font-semibold text-[#00243D]">PayPal payout</p>
                        <p className="mt-2 text-sm text-[#1A1A1A]/85">Payment will be sent via PayPal within 2 working days of receiving and verifying your clubs.</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={submitOrder}
                      disabled={isSubmitting}
                      className="mt-6 inline-flex items-center justify-center rounded-full bg-[#00537E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#003f5d] disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {isSubmitting ? 'Submitting order…' : `Submit order (£${total.toFixed(2)})`}
                    </button>
                  </div>
                )}
              </div>
              <div className="rounded-3xl border border-slate-200 bg-[#F4F4F4] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Order summary</p>
                <div className="mt-4 space-y-4">
                  {quoteItems.map((item) => (
                    <div key={item.id} className="rounded-3xl bg-white p-4">
                      <p className="font-semibold text-[#00243D]">{item.title}</p>
                      <p className="mt-1 text-sm text-[#1A1A1A]/80">Condition: {conditionLabels[item.condition]}</p>
                      <p className="mt-2 text-sm text-[#1A1A1A]/80">£{item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
