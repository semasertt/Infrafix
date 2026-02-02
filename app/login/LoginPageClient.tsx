'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import './login.css'

export default function LoginPageClient() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      switch (error) {
        case 'not_authenticated':
          setErrorMessage('Giriş yapmanız gerekiyor')
          break
        case 'user_not_found':
          setErrorMessage('Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.')
          break
        case 'not_admin':
          setErrorMessage('Bu sayfaya erişmek için admin yetkisi gereklidir')
          break
        case 'server_error':
          setErrorMessage('Sunucu hatası. Lütfen tekrar deneyin.')
          break
        default:
          setErrorMessage('Bir hata oluştu')
      }
    }
  }, [searchParams])

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2>Admin Girişi</h2>
          {errorMessage && (
            <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
              {errorMessage}
            </div>
          )}
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
