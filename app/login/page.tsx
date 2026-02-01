import LoginForm from '@/components/LoginForm'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import './login.css'

export default async function LoginPage() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // If already logged in, redirect to admin
    if (user) {
      redirect('/admin')
    }
  } catch (error) {
    // Supabase not configured, continue to login page
    console.warn('Supabase not configured:', error)
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2>Admin Girişi</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
