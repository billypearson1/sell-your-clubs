import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import HomePage from './pages/HomePage'
import QuotePage from './pages/QuotePage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'

const queryClient = new QueryClient()

const navigation = [
  { label: 'Home', path: '/' },
  { label: 'Quote tool', path: '/quote' },
  { label: 'Admin', path: '/admin' },
]

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-white text-[#1A1A1A]">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
              <div>
                <p className="text-lg font-semibold text-[#00243D]">Sell Your Clubs</p>
                <span className="text-sm text-[#00537E]">Used golf club buyers</span>
              </div>
              <nav className="flex flex-wrap items-center gap-3">
                {navigation.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `rounded-full px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-[#00537E] text-white' : 'text-[#00243D] hover:bg-slate-100'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <NavLink
                  to="/login"
                  className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-[#00243D] transition hover:bg-slate-100"
                >
                  Login
                </NavLink>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quote" element={<QuotePage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <footer className="border-t border-slate-200 bg-[#F4F4F4] py-6">
            <div className="mx-auto max-w-7xl px-4 text-sm text-[#1A1A1A]/70 sm:px-6">
              <p>Sell Your Clubs — Free postage label, trusted PayPal payout, and easy club selling.</p>
            </div>
          </footer>
        </div>
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App
