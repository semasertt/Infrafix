'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'
import LogoutButton from './LogoutButton'
import './Header.css'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const lastScrollY = useRef(0)
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    // Scroll davranışı: aşağı giderken navbar kaybolsun, yukarı çıkarken geri gelsin
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 10) {
        // En üstteyse her zaman göster
        setIsScrolled(false)
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Aşağı kaydırılıyor ve 100px'den fazla scroll edildiyse gizle
        setIsScrolled(true)
      } else if (currentScrollY < lastScrollY.current) {
        // Yukarı kaydırılıyorsa göster
        setIsScrolled(false)
      }
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    // Dark mode kontrolü
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    setIsDarkMode(shouldBeDark)
    if (shouldBeDark) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }

    // Language kontrolü LanguageProvider'da yapılıyor

    // User kontrolü ve auth state listener
    const supabase = createClient()
    
    // İlk kullanıcı kontrolü
    const checkUser = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser()
        
        if (error) {
          // AuthSessionMissingError normal bir durum - session henüz hazır olmayabilir
          // Bu durumda sessizce devam et, onAuthStateChange listener zaten session'ı yakalayacak
          if (error.message?.includes('Auth session missing') || error.name === 'AuthSessionMissingError') {
            // Session henüz hazır değil, sessizce devam et
            return
          }
          // Diğer hatalar için log tut ama warning gösterme
          setUser(null)
          setIsAdmin(false)
          return
        }

        setUser(authUser)

        if (authUser) {
          try {
            console.log('Header: Fetching role for user:', { userId: authUser.id, email: authUser.email })
            const { data: userData, error: dbError } = await supabase
              .from('users')
              .select('role, email')
              .eq('id', authUser.id)
              .maybeSingle()
            
            console.log('Header: Role query result:', { 
              userData, 
              error: dbError?.message,
              errorCode: dbError?.code 
            })
            
            if (dbError) {
              console.error('Header: Database error:', {
                code: dbError.code,
                message: dbError.message,
                userId: authUser.id
              })
            }
            
            setIsAdmin(userData?.role === 'admin')
            console.log('Header: Is admin?', userData?.role === 'admin', 'Role:', userData?.role)
          } catch (dbError: any) {
            console.error('Header: Exception:', dbError)
            setIsAdmin(false)
          }
        } else {
          setIsAdmin(false)
        }
      } catch (error: any) {
        // Supabase yapılandırılmamış veya başka bir hata
        // Sadece kritik hataları logla
        if (error?.message && !error.message.includes('Auth session missing')) {
          // Kritik olmayan hataları logla
        }
        setUser(null)
        setIsAdmin(false)
      }
    }

    checkUser()

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'SIGNED_OUT' || !session) {
            setUser(null)
            setIsAdmin(false)
          } else if (event === 'SIGNED_IN' && session?.user) {
            setUser(session.user)
            // Admin kontrolü
            try {
              const { data: userData, error: dbError } = await supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .maybeSingle()
              
              if (dbError && dbError.code !== 'PGRST116') {
                // PGRST116 = No rows returned, bu normal olabilir
                console.warn('User role query error:', dbError)
              }
              
              setIsAdmin(userData?.role === 'admin')
            } catch (error) {
              // Sessizce devam et
              setIsAdmin(false)
            }
          }
        } catch (error) {
          // Auth state change hatası - sessizce devam et
          // onAuthStateChange listener'ındaki hatalar normal olabilir
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('theme', 'light')
    }
  }

  const toggleLanguage = () => {
    const newLang = language === 'tr' ? 'en' : 'tr'
    setLanguage(newLang)
  }

  const scrollToSection = (sectionId: string) => {
    // Eğer ana sayfada değilsek, önce ana sayfaya git (hash ile)
    if (pathname !== '/') {
      router.push(`/#${sectionId}`)
      return
    }

    // Ana sayfadaysak direkt scroll yap
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        // URL'yi güncelle
        window.history.pushState(null, '', `#${sectionId}`)
      }
    }, 50)
  }

  return (
    <header className={`header ${isScrolled ? 'header-hidden' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link href="/" className="logo">
            <h1>InfraFix</h1>
          </Link>
          <nav className="nav">
            {pathname !== '/admin' && (
              <>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="nav-link-btn"
                >
                  {t('nav.howItWorks')}
                </button>
                <button 
                  onClick={() => scrollToSection('fault-form')}
                  className="nav-link-btn"
                >
                  {t('nav.report')}
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="nav-link-btn"
                >
                  {t('nav.faq')}
                </button>
              </>
            )}
            {isAdmin && (
              <>
                <Link href="/admin" className="nav-link-admin">{t('nav.adminPanel')}</Link>
                <Link href="/archive" className="nav-link-admin">{t('nav.archive')}</Link>
              </>
            )}
            <div className="header-actions">
              <button 
                onClick={toggleLanguage}
                className="icon-btn"
                title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'}
                aria-label="Language"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="currentColor"/>
                </svg>
              </button>
              <button 
                onClick={toggleDarkMode}
                className="icon-btn"
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
                  </svg>
                )}
              </button>
            </div>
            {user ? (
              <LogoutButton />
            ) : (
              <Link href="/login" className="btn btn-primary">
                {t('nav.login')}
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
