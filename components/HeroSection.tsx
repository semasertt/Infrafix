'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import cityImage from '@/assets/images/city.jpg'
import './HeroSection.css'

export default function HeroSection() {
  const { t } = useLanguage()
  useEffect(() => {
    // Smooth scroll için event listener ekle
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a[href="#fault-form"]')) {
        e.preventDefault()
        const element = document.getElementById('fault-form')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-subtitle">{t('hero.subtitle')}</span>
            <h1 className="hero-title">{t('hero.title')}</h1>
            <p className="hero-description">
              {t('hero.description')}
            </p>
            <div className="hero-buttons">
              <a href="#fault-form" className="btn btn-primary btn-large">
                {t('hero.reportButton')}
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-placeholder">
              <Image 
                src={cityImage}
                alt="Hero Image" 
                className="hero-image-content"
                fill
                priority
                sizes="(max-width: 968px) 100vw, 600px"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
