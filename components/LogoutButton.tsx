'use client'

import { logout } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
    router.refresh()
    // Sayfayı yenile ki Header state'i güncellensin
    window.location.href = '/'
  }

  return (
    <button onClick={handleLogout} className="btn btn-secondary">
      Çıkış Yap
    </button>
  )
}
