'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'
import HeroSection from '@/components/HeroSection'
import HowItWorks from '@/components/HowItWorks'
import FaultReportForm from '@/components/FaultReportForm'
import FAQ from '@/components/FAQ'
import UserInfo from '@/components/UserInfo'
import './page.css'

export default function HomePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Admin kontrolü
    const checkAdmin = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()
          setIsAdmin(userData?.role === 'admin')
        }
      } catch (error) {
        setIsAdmin(false)
      }
    }
    checkAdmin()

    // Hash ile gelen istekleri handle et
    const handleHash = () => {
      const hash = window.location.hash
      if (hash) {
        const sectionId = hash.substring(1) // # işaretini kaldır
        setTimeout(() => {
          const element = document.getElementById(sectionId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 300) // Sayfa yüklendikten sonra scroll yap
      }
    }

    // İlk yüklemede kontrol et
    handleHash()

    // Hash değişikliklerini dinle
    window.addEventListener('hashchange', handleHash)
    
    return () => {
      window.removeEventListener('hashchange', handleHash)
    }
  }, [])

  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'not_admin') {
      setErrorMessage('Bu sayfaya erişmek için admin yetkisi gereklidir. Eğer admin rolünüz varsa, lütfen çıkış yapıp tekrar giriş yapın. Rolünüzü kontrol etmek için sağ alttaki "Kullanıcı Bilgileri" kartına bakın.')
      // 15 saniye sonra mesajı kaldır
      setTimeout(() => {
        setErrorMessage(null)
        // URL'den error parametresini kaldır
        window.history.replaceState({}, '', window.location.pathname)
      }, 15000)
    }
  }, [searchParams])

  return (
    <div className="home-page">
      {errorMessage && (
        <div className="container" style={{ paddingTop: '2rem' }}>
          <div className="alert alert-error">
            {errorMessage}
          </div>
        </div>
      )}
      {isAdmin && (
        <div className="container" style={{ paddingTop: '2rem' }}>
          <div className="admin-banner">
            <div className="admin-banner-content">
              <span>👤 {t('admin.banner.text')}</span>
              <button 
                onClick={() => router.push('/admin')}
                className="btn btn-primary btn-sm"
              >
                {t('admin.banner.backToAdmin')}
              </button>
            </div>
          </div>
        </div>
      )}
      <HeroSection />
      <HowItWorks />
      <div id="fault-form" className="fault-form-wrapper">
        <div className="container">
          <FaultReportForm />
        </div>
      </div>
      <FAQ />
      <UserInfo />
    </div>
  )
}
