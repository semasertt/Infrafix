import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminPanel from '@/components/AdminPanel'
import './admin.css'

export default async function AdminPage() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('Auth error:', authError)
      redirect('/login?error=not_authenticated')
      return
    }

    // Check if admin - önce kullanıcıyı kontrol et, yoksa ekle
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    // Eğer kullanıcı public.users'da yoksa, ekle
    if (userError && userError.code === 'PGRST116') { // No rows returned
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
          role: 'user',
        })
        .select()
        .single()
      
      if (insertError) {
        console.error('Failed to insert user:', insertError)
        redirect('/login?error=user_not_found')
        return
      }
      
      // Tekrar role'ü al
      const { data: newUserData, error: newUserError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (newUserError || !newUserData) {
        console.error('User query error after insert:', newUserError)
        redirect('/login?error=user_not_found')
        return
      }
      
      userData = newUserData
    } else if (userError) {
      console.error('User query error:', userError)
      redirect('/login?error=user_not_found')
      return
    }

    if (!userData) {
      console.error('User data not found for user:', user.id)
      redirect('/login?error=user_not_found')
      return
    }

    console.log('User role check:', { 
      userId: user.id, 
      email: user.email, 
      role: userData.role,
      userData: userData
    })

    if (userData.role !== 'admin') {
      console.warn('User is not admin. Role:', userData.role, 'User ID:', user.id, 'Email:', user.email)
      redirect('/?error=not_admin')
      return
    }

    console.log('Admin access granted for:', user.email)
  } catch (error) {
    console.error('Admin page error:', error)
    redirect('/login?error=server_error')
    return
  }

  return (
    <div className="admin-page-wrapper">
      <div className="admin-page">
        <div className="container">
          <AdminPanel />
        </div>
      </div>
    </div>
  )
}
