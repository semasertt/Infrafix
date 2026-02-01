import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminPanel from '@/components/AdminPanel'
import './admin.css'

export default async function AdminPage() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }

    // Check if admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'admin') {
      redirect('/')
    }
  } catch (error) {
    // Supabase not configured, redirect to home
    redirect('/')
  }

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Admin Panel</h1>
        <AdminPanel />
      </div>
    </div>
  )
}
