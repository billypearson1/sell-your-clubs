import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    
    if (authError) {
      setLoading(false)
      toast.error(authError.message)
      return
    }

    // Check if user is admin
    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData?.session?.user
    
    if (!user) {
      setLoading(false)
      toast.error('Failed to get session.')
      return
    }

    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    console.log('Admin role check debug:', { userId: user.id, roleData, roleError })
    console.log('Role value from response:', roleData?.role)
    console.log('Role comparison:', roleData?.role, '===', 'admin', '?', roleData?.role === 'admin')

    setLoading(false)

    if (roleError) {
      console.error('Role query error:', roleError)
      toast.error('Error checking admin role.')
      return
    }

    if (!roleData) {
      console.warn('No roleData returned from user_roles table')
      toast.error('No admin role found. Contact your administrator to set up your account.')
      return
    }

    if (roleData.role !== 'admin') {
      console.warn('User role is not admin:', roleData.role)
      toast.error('You do not have admin access. Your role is: ' + roleData.role)
      return
    }

    toast.success('Logged in successfully.')
    navigate('/admin')
  }

  return (
    <section className="mx-auto max-w-2xl rounded-[28px] border border-slate-200 bg-white p-10 shadow-sm">
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin access</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#00243D]">Sign in to your Sell Your Clubs admin panel</h1>
          <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/85">Only approved admin users can manage prices and order status.</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <label className="block text-sm font-semibold text-[#00243D]">
            Email address
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              className="mt-3 w-full rounded-3xl border border-slate-300 bg-[#F9FAFB] px-4 py-4 text-sm text-[#1A1A1A] focus:border-[#00537E] focus:ring-2 focus:ring-[#00537E]/20"
            />
          </label>
          <label className="block text-sm font-semibold text-[#00243D]">
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
              className="mt-3 w-full rounded-3xl border border-slate-300 bg-[#F9FAFB] px-4 py-4 text-sm text-[#1A1A1A] focus:border-[#00537E] focus:ring-2 focus:ring-[#00537E]/20"
            />
          </label>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#00537E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#003f5d] disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </section>
  )
}
