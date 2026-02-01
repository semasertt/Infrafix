import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'
import './Header.css'

export default async function Header() {
  let user = null
  let isAdmin = false

  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    user = authUser

    // Check if admin
    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      isAdmin = userData?.role === 'admin'
    }
  } catch (error) {
    // Supabase not configured yet, continue without auth
    console.warn('Supabase not configured:', error)
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link href="/" className="logo">
            <h1>InfraFix</h1>
          </Link>
          <nav className="nav">
            <Link href="/">Ana Sayfa</Link>
            {isAdmin && (
              <>
                <Link href="/admin">Admin Panel</Link>
                <Link href="/archive">Arşiv</Link>
              </>
            )}
            {user ? (
              <LogoutButton />
            ) : (
              <Link href="/login" className="btn btn-primary">
                Giriş Yap
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
