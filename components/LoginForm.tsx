'use client'

import { useState } from 'react'
import { login } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import './LoginForm.css'

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formDataObj = new FormData()
    formDataObj.append('email', formData.email)
    formDataObj.append('password', formData.password)

    const result = await login(formDataObj)

    if (result.success && result.data?.user) {
      // Kullanıcı rolüne göre yönlendir
      const userRole = result.data.user.role || 'user'
      console.log('Login successful:', {
        email: result.data.user.email,
        userId: result.data.user.id,
        role: userRole,
        fullResult: result.data.user
      })
      
      if (userRole === 'admin') {
        // Admin ise admin sayfasına git
        console.log('Redirecting to admin page...')
        window.location.href = '/admin'
      } else {
        // Normal kullanıcı ise ana sayfaya git
        console.log('User is not admin, redirecting to home...')
        router.push('/')
        router.refresh()
      }
    } else {
      console.error('Login failed:', result.error)
      setError(result.error || 'Giriş başarısız')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-group">
        <label className="form-label">E-posta</label>
        <input
          type="email"
          className="form-input"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Şifre</label>
        <input
          type="password"
          className="form-input"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </button>
    </form>
  )
}
