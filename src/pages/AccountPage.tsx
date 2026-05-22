import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AccountPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        navigate('/login')
        return
      }
      setEmail(data.user.email || null)
    }
    load()
  }, [navigate])

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (!email) return null

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold">Account</h1>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-[#00243D]/80">Signed in as</p>
        <p className="mt-2 font-semibold">{email}</p>
        <div className="mt-6">
          <button onClick={signOut} className="rounded-full bg-[#00537E] px-4 py-2 text-sm font-semibold text-white">Sign out</button>
        </div>
      </div>
    </div>
  )
}
