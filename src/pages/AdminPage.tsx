import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import Fuse from 'fuse.js'
import { supabase } from '../lib/supabase'
import type { Club, OrderRow } from '../lib/types'
import { clubTypeLabels } from '../lib/quoteHelpers'

const emptyClub = {
  brand: '',
  model: '',
  club_type: 'driver' as const,
  price_avg: 0,
}

export default function AdminPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'prices' | 'orders'>('prices')
  const [search, setSearch] = useState('')
  const [formClub, setFormClub] = useState<Partial<Club>>(emptyClub)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const { data: clubs = [] } = useQuery<Club[]>({
    queryKey: ['admin-clubs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('clubs').select('*').order('brand')
      if (error) throw error
      return data || []
    },
  })

  const { data: orders = [] } = useQuery<OrderRow[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    },
  })

  const filteredClubs = useMemo(() => {
    if (!search.trim()) return clubs
    const fuse = new Fuse(clubs, {
      keys: ['brand', 'model'],
      threshold: 0.3,
      minMatchCharLength: 1,
    })
    return fuse.search(search).map((result) => result.item)
  }, [clubs, search])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search.toLowerCase().trim()
      if (!query) return true
      return [order.full_name, order.email, order.phone, order.paypal_email]
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
  }, [orders, search])

  async function handleSaveClub() {
    if (!formClub.brand || !formClub.model || !formClub.club_type) {
      toast.error('Brand, model and club type are required.')
      return
    }

    setSaving(true)
    const payload = {
      brand: formClub.brand,
      model: formClub.model,
      club_type: formClub.club_type,
      price_avg: Number(formClub.price_avg ?? 0),
    }

    try {
      if (isEditing && formClub.id) {
        const { error } = await supabase.from('clubs').update(payload).eq('id', formClub.id)
        if (error) throw error
        toast.success('Club price updated.')
      } else {
        const { error } = await supabase.from('clubs').insert(payload)
        if (error) throw error
        toast.success('New club added.')
      }
      setFormClub(emptyClub)
      setIsEditing(false)
      await queryClient.invalidateQueries({ queryKey: ['admin-clubs'] })
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleEditClub(club: Club) {
    setFormClub(club)
    setIsEditing(true)
    setActiveTab('prices')
  }

  async function handleDeleteClub(clubId: number) {
    if (!window.confirm('Delete this club from the price database?')) return
    const { error } = await supabase.from('clubs').delete().eq('id', clubId)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Club deleted.')
    await queryClient.invalidateQueries({ queryKey: ['admin-clubs'] })
  }

  async function handleUpdateOrderStatus(orderId: string, status: OrderRow['status']) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Order status updated.')
    await queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
  }

  return (
    <section className="space-y-10">
      <div className="rounded-[28px] border border-slate-200 bg-[#F4F4F4] p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin panel</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#00243D]">Manage pricing and orders</h1>
            <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/85">
              Only users with the admin role can access this panel. Update club values, review orders, and mark progress quickly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('prices')}
              className={`rounded-full px-5 py-3 text-sm font-semibold ${activeTab === 'prices' ? 'bg-[#00537E] text-white' : 'bg-white text-[#00243D] border border-slate-200'}`}
            >
              Price database
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`rounded-full px-5 py-3 text-sm font-semibold ${activeTab === 'orders' ? 'bg-[#00537E] text-white' : 'bg-white text-[#00243D] border border-slate-200'}`}
            >
              Orders
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="w-full sm:w-auto text-sm font-semibold text-[#00243D]">
            Search
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={activeTab === 'orders' ? 'Search orders by name, email or phone' : 'Search clubs by brand or model'}
              className="mt-3 w-full rounded-3xl border border-slate-300 bg-[#F9FAFB] px-4 py-4 text-sm text-[#1A1A1A] focus:border-[#00537E] focus:ring-2 focus:ring-[#00537E]/20"
            />
          </label>
          {activeTab === 'prices' ? (
            <button
              type="button"
              onClick={() => {
                setFormClub(emptyClub)
                setIsEditing(false)
              }}
              className="inline-flex items-center justify-center rounded-full bg-[#00537E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#003f5d]"
            >
              Add new club
            </button>
          ) : null}
        </div>

        {activeTab === 'prices' ? (
          <div className="grid gap-8 xl:grid-cols-[0.7fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-[28px] border border-slate-200 bg-[#F4F4F4] p-6">
                <p className="text-sm font-semibold text-[#00243D]">Club pricing editor</p>
                <p className="mt-2 text-sm leading-7 text-[#1A1A1A]/85">
                  Set the average eBay selling price. Buy prices are calculated automatically per condition.
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-[#00243D]">
                  Brand
                  <input
                    value={formClub.brand ?? ''}
                    onChange={(event) => setFormClub((current) => ({ ...current, brand: event.target.value }))}
                    className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-[#1A1A1A] focus:border-[#00537E] focus:ring-2 focus:ring-[#00537E]/20"
                  />
                </label>
                <label className="block text-sm font-semibold text-[#00243D]">
                  Model
                  <input
                    value={formClub.model ?? ''}
                    onChange={(event) => setFormClub((current) => ({ ...current, model: event.target.value }))}
                    className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-[#1A1A1A] focus:border-[#00537E] focus:ring-2 focus:ring-[#00537E]/20"
                  />
                </label>
                <label className="block text-sm font-semibold text-[#00243D]">
                  Club type
                  <select
                    value={formClub.club_type ?? 'driver'}
                    onChange={(event) => setFormClub((current) => ({ ...current, club_type: event.target.value as Club['club_type'] }))}
                    className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-[#1A1A1A] focus:border-[#00537E] focus:ring-2 focus:ring-[#00537E]/20"
                  >
                    {Object.entries(clubTypeLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-[#00243D]">
                  Average eBay selling price (£)
                  <input
                    type="number"
                    min="0"
                    value={formClub.price_avg ?? 0}
                    onChange={(event) => setFormClub((current) => ({ ...current, price_avg: Number(event.target.value) }))}
                    className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-[#1A1A1A] focus:border-[#00537E] focus:ring-2 focus:ring-[#00537E]/20"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleSaveClub}
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-full bg-[#00537E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#003f5d] disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isEditing ? 'Save changes' : 'Create club entry'}
                </button>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => {
                      setFormClub(emptyClub)
                      setIsEditing(false)
                    }}
                    className="rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-[#00243D] transition hover:bg-slate-50"
                  >
                    Reset form
                  </button>
                ) : null}
              </div>
            </div>

            <div className="space-y-4">
              {filteredClubs.map((club) => (
                <div key={club.id} className="rounded-[28px] border border-slate-200 bg-[#F4F4F4] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <p className="font-semibold text-[#00243D]">{club.brand} {club.model}</p>
                      <p className="text-sm text-[#1A1A1A]/80">{clubTypeLabels[club.club_type]}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEditClub(club)}
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#00243D] transition hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClub(club.id)}
                        className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 rounded-3xl bg-white p-4 text-sm text-[#1A1A1A]/85">
                    <p className="font-semibold text-[#00243D]">Average eBay price</p>
                    <p className="mt-1">£{club.price_avg.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="rounded-[28px] border border-slate-200 bg-[#F4F4F4] p-6">
                <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <p className="text-sm font-semibold text-[#00243D]">{order.full_name}</p>
                    <p className="mt-1 text-sm text-[#1A1A1A]/80">{order.email} · {order.phone}</p>
                    <p className="mt-2 text-sm text-[#1A1A1A]/80">
                      {[order.address_line1, order.address_line2, order.town, order.county, order.postcode].filter(Boolean).join(', ')}
                    </p>
                    <p className="mt-1 text-sm text-[#1A1A1A]/80">PayPal: {order.paypal_email}</p>
                    <p className="mt-3 text-sm text-[#1A1A1A]/85">Total: £{order.total_amount.toFixed(2)}</p>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-[#00243D]">Status</label>
                    <select
                      value={order.status}
                      onChange={(event) => handleUpdateOrderStatus(order.id, event.target.value as OrderRow['status'])}
                      className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#1A1A1A] focus:border-[#00537E] focus:ring-2 focus:ring-[#00537E]/20"
                    >
                      {['pending', 'label_sent', 'received', 'paid', 'rejected'].map((status) => (
                        <option key={status} value={status}>{status.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-5 rounded-3xl bg-white p-4 text-sm text-[#1A1A1A]/85">
                  <p className="font-semibold text-[#00243D]">Items</p>
                  <ul className="mt-3 space-y-3">
                    {order.items.map((item, index) => (
                      <li key={index} className="rounded-3xl border border-slate-200 p-4">
                        <p className="font-semibold text-[#00243D]">{item.title}</p>
                        <p className="mt-1 text-sm text-[#1A1A1A]/80">Condition: {item.condition}</p>
                        <p className="mt-1 text-sm text-[#1A1A1A]/80">Price: £{item.price.toFixed(2)}</p>
                        <p className="mt-2 text-sm text-[#1A1A1A]/80">
                          {Object.entries(item.specs)
                            .filter(([, value]) => value)
                            .map(([key, value]) => `${key.replace('_', ' ')}: ${value}`)
                            .join(' · ')}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
