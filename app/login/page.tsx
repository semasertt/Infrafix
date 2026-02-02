import { Suspense } from 'react'
import LoginForm from '@/components/LoginForm'
import LoginPageClient from './LoginPageClient'
import './login.css'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <h2>Admin Girişi</h2>
            <LoginForm />
          </div>
        </div>
      </div>
    }>
      <LoginPageClient />
    </Suspense>
  )
}
