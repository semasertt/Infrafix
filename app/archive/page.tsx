import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ArchivePanel from '@/components/ArchivePanel'
import './archive.css'

export default async function ArchivePage() {
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

  return (
    <div className="archive-page">
      <div className="container">
        <h1>Arşiv</h1>
        <ArchivePanel />
      </div>
    </div>
  )
}
