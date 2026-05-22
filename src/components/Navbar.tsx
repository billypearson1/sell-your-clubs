import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useBasket } from '../context/BasketContext'
import logo from '../assets/sellyourclubs_logo.png'

export default function Navbar() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getUser()
      setIsLoggedIn(Boolean(data.user))
    }
    check()
    const { data: sub } = supabase.auth.onAuthStateChange(() => check())
    return () => sub?.subscription.unsubscribe()
  }, [])


  const { items, total, removeItem, clear } = useBasket()

  return (
    <>
      <div className="w-full bg-[#00243D] text-white">
        <div className="mx-auto max-w-7xl px-4 py-2 text-center sm:px-6">
          <NavLink to="/price-match" className="text-sm font-medium underline-offset-2 hover:underline">
            We'll beat any price from another golf buyback site — or pay you £10 more. Guaranteed.
          </NavLink>
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-3">
            <img src={logo} alt="Sell Your Clubs logo" className="h-[50px] w-auto object-contain -mt-[8px]" />
          </NavLink>

          <nav className="flex items-center gap-3">
            <NavLink to="/quote" className={({ isActive }) => `rounded-[8px] px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-[#00537E] text-white' : 'text-[#00243D] hover:bg-slate-100'}`}>
              Sell
            </NavLink>
            <NavLink to="/blog" className="rounded-[8px] px-4 py-3 text-sm font-semibold text-[#00243D] transition hover:bg-slate-100">
              Guides
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="account"
            onClick={() => navigate(isLoggedIn ? '/account' : '/login')}
            className="rounded-full p-2 text-[#00243D] hover:bg-slate-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25a9 9 0 0115 0" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="basket"
            onClick={() => setIsOpen(true)}
            className="rounded-full bg-[#00537E] px-3 py-2 text-sm font-semibold text-white"
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l3-8H6.4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 13l-1.5 6h13L17 13" />
              </svg>
              <span>{items.length}</span>
            </div>
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-30 flex">
          <div className="flex-1" onClick={() => setIsOpen(false)} />
          <aside className="w-96 max-w-full border-l border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your basket</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-500">Close</button>
            </div>

            <div className="mt-6 space-y-4">
              {items.length ? (
                items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{it.title}</p>
                      <p className="text-sm text-[#1A1A1A]/80">{it.condition} — {it.type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">£{(it.price || 0).toFixed(2)}</div>
                      <button onClick={() => removeItem(it.id)} className="text-sm text-red-600 hover:text-red-800">Remove</button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#1A1A1A]/80">Your basket is empty.</p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-sm text-[#00243D]">Total</p>
                <p className="text-xl font-semibold">£{total.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => clear()} className="rounded-full border px-3 py-2 text-sm">Clear</button>
                <button onClick={() => { setIsOpen(false); navigate('/quote') }} className="rounded-full bg-[#00537E] px-4 py-2 text-sm font-semibold text-white">Checkout</button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </header>
    </>
  )
}
