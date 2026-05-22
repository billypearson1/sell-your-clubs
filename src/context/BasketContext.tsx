import React, { createContext, useContext, useEffect, useState } from 'react'
import type { QuoteItem } from '../lib/types'

type BasketContextValue = {
  items: QuoteItem[]
  addItem: (item: QuoteItem) => void
  removeItem: (id: string) => void
  clear: () => void
  total: number
}

const BasketContext = createContext<BasketContextValue | undefined>(undefined)

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>(() => {
    try {
      const raw = localStorage.getItem('quoteItems')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('quoteItems', JSON.stringify(items))
    } catch (e) {
      // ignore
    }
  }, [items])

  function addItem(item: QuoteItem) {
    setItems((s) => [...s, item])
  }

  function removeItem(id: string) {
    setItems((s) => s.filter((it) => it.id !== id))
  }

  function clear() {
    setItems([])
  }

  const total = items.reduce((s, it) => s + (it.price || 0), 0)

  return (
    <BasketContext.Provider value={{ items, addItem, removeItem, clear, total }}>
      {children}
    </BasketContext.Provider>
  )
}

export function useBasket() {
  const ctx = useContext(BasketContext)
  if (!ctx) throw new Error('useBasket must be used within BasketProvider')
  return ctx
}
