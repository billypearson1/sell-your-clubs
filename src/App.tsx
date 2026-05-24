import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Toaster } from 'sonner'
import AboutPage from './pages/AboutPage'
import HowItWorksPage from './pages/HowItWorksPage'
import WhatWeBuyPage from './pages/WhatWeBuyPage'
import FAQPage from './pages/FAQPage'
import ContactPage from './pages/ContactPage'
import TermsPage from './pages/TermsPage'
import HomePage from './pages/HomePage'
import QuotePage from './pages/QuotePage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import AccountPage from './pages/AccountPage'
import BlogPage from './pages/BlogPage'
import PriceMatchPage from './pages/PriceMatchPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import { BasketProvider } from './context/BasketContext'
import CheckoutPage from './pages/CheckoutPage'
import BlogPostPage from './pages/BlogPostPage'

// navigation handled in Navbar component

function App() {
  return (
    <BrowserRouter>
        <BasketProvider>
          <div className="min-h-screen flex flex-col bg-white text-[#1A1A1A]">
            <Navbar />
            <main className="flex-1 w-full bg-white px-4 py-10 sm:px-6">
              <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quote" element={<QuotePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/price-match" element={<PriceMatchPage />} />
              <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/about" element={<AboutPage />} />
<Route path="/how-it-works" element={<HowItWorksPage />} />
<Route path="/what-we-buy" element={<WhatWeBuyPage />} />
<Route path="/faq" element={<FAQPage />} />
<Route path="/contact" element={<ContactPage />} />
<Route path="/terms" element={<TermsPage />} />
            </Routes>
            </main>

            <footer className="mt-auto w-full border-t border-slate-200 bg-[#F4F4F4] text-[#1A1A1A]">
              <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
                <div>
  <p className="font-semibold text-[#00243D]">About</p>
  <ul className="mt-4 space-y-2 text-sm text-[#1A1A1A]/80">
    <li><Link to="/about" className="hover:text-[#00537E]">About Us</Link></li>
    <li><Link to="/how-it-works" className="hover:text-[#00537E]">How It Works</Link></li>
    <li><Link to="/price-match" className="hover:text-[#00537E]">Price Match Guarantee</Link></li>
  </ul>
</div>
<div>
  <p className="font-semibold text-[#00243D]">Sell</p>
  <ul className="mt-4 space-y-2 text-sm text-[#1A1A1A]/80">
    <li><Link to="/quote" className="hover:text-[#00537E]">Get a Quote</Link></li>
    <li><Link to="/blog" className="hover:text-[#00537E]">Guides</Link></li>
    <li><Link to="/what-we-buy" className="hover:text-[#00537E]">What We Buy</Link></li>
  </ul>
</div>
<div>
  <p className="font-semibold text-[#00243D]">Support</p>
  <ul className="mt-4 space-y-2 text-sm text-[#1A1A1A]/80">
    <li><Link to="/faq" className="hover:text-[#00537E]">FAQ</Link></li>
    <li><Link to="/contact" className="hover:text-[#00537E]">Contact Us</Link></li>
    <li><Link to="/terms" className="hover:text-[#00537E]">Terms & Conditions</Link></li>
  </ul>
</div>
              </div>
              <div className="border-t border-slate-200 px-4 py-4 text-center text-sm text-[#1A1A1A]/70 sm:px-6">
                © Copyright sellyourclubs.co.uk 2026
              </div>
            </footer>
          </div>
          <Toaster position="top-right" richColors />
        </BasketProvider>
    </BrowserRouter>
  )
}

export default App
