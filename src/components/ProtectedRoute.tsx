import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkAdmin() {
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData?.session?.user
      if (!user) {
        setAuthorized(false)
        return
      }
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
      console.log('ProtectedRoute admin check:', { userId: user.id, data, error, roleValue: data?.role })
      if (error || !data || data.role !== 'admin') {
        console.warn('ProtectedRoute authorization failed:', { error, hasData: !!data, role: data?.role })
        setAuthorized(false)
        return
      }
      setAuthorized(true)
    }
    checkAdmin()
  }, [])

  if (authorized === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-[#1A1A1A]/80">Checking access…</p>
      </div>
    )
  }

  if (!authorized) {
    return <Navigate to="/login" replace />
  }

  return children
}
