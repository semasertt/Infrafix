'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import './UserInfo.css'

interface UserInfo {
  id: string
  email: string
  role: string | null
}

export default function UserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError) {
          // AuthSessionMissingError normal bir durum - sessizce devam et
          if (authError.message?.includes('Auth session missing') || authError.name === 'AuthSessionMissingError') {
            setUserInfo(null)
            setLoading(false)
            return
          }
          // Diğer hatalar için sessizce devam et
          setUserInfo(null)
          setLoading(false)
          return
        }

        if (!user) {
          setUserInfo(null)
          setLoading(false)
          return
        }

        // Get user role from public.users
        try {
          console.log('UserInfo: Fetching role for user:', { userId: user.id, email: user.email })
          
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role, email')
            .eq('id', user.id)
            .maybeSingle()

          console.log('UserInfo: Query result:', { 
            userData, 
            error: userError?.message, 
            errorCode: userError?.code,
            errorDetails: userError 
          })

          if (userError) {
            console.error('UserInfo: Database error:', {
              code: userError.code,
              message: userError.message,
              details: userError,
              userId: user.id
            })
          }

          const role = userData?.role || null
          console.log('UserInfo: Final role:', role)

          setUserInfo({
            id: user.id,
            email: user.email || '',
            role: role,
          })
        } catch (dbError: any) {
          console.error('UserInfo: Exception caught:', {
            error: dbError,
            message: dbError?.message,
            userId: user.id
          })
          setUserInfo({
            id: user.id,
            email: user.email || '',
            role: null,
          })
        }
      } catch (error: any) {
        // Kritik olmayan hataları sessizce handle et
        if (error?.message && !error.message.includes('Auth session missing')) {
          // Sadece kritik hataları logla
        }
        setUserInfo(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  if (loading) {
    return null
  }

  if (!userInfo) {
    return null
  }

  return (
    <div className="user-info-debug">
      <div className="user-info-content">
        <h3>Kullanıcı Bilgileri</h3>
        <div className="user-info-item">
          <strong>Email:</strong> {userInfo.email}
        </div>
        <div className="user-info-item">
          <strong>Rol:</strong> 
          <span className={`role-badge role-${userInfo.role || 'none'}`}>
            {userInfo.role || 'Rol bulunamadı'}
          </span>
        </div>
        <div className="user-info-item">
          <strong>User ID:</strong> 
          <code className="user-id">{userInfo.id}</code>
        </div>
        {userInfo.role !== 'admin' && (
          <div className="user-info-warning">
            <p>⚠️ Admin sayfasına erişmek için rolünüzün "admin" olması gerekiyor.</p>
            {userInfo.role === null ? (
              <>
                <p><strong>Rol bulunamadı!</strong> Önce Supabase SQL Editor'da şu komutu çalıştırın:</p>
                <pre className="sql-command">
{`UPDATE public.users
SET role = 'admin'
WHERE email = '${userInfo.email}';`}
                </pre>
                <p className="warning-action">✅ SQL komutunu çalıştırdıktan sonra:</p>
                <ol className="warning-steps">
                  <li>Çıkış yapın (sağ üstteki "Çıkış Yap" butonuna tıklayın)</li>
                  <li>Tekrar giriş yapın</li>
                  <li>Admin sayfasına erişebilmelisiniz</li>
                </ol>
              </>
            ) : (
              <>
                <p>Mevcut rolünüz: <strong>{userInfo.role}</strong></p>
                <p>Supabase SQL Editor'da şu komutu çalıştırın:</p>
                <pre className="sql-command">
{`UPDATE public.users
SET role = 'admin'
WHERE email = '${userInfo.email}';`}
                </pre>
                <p className="warning-action">✅ SQL komutunu çalıştırdıktan sonra çıkış yapıp tekrar giriş yapın.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
