'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import './Footer.css'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Sol Kolon: Logo ve Açıklama */}
          <div className="footer-column">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="footer-brand">InfraFix</h3>
            </div>
            <p className="footer-description">
              {t('footer.description')}
            </p>
          </div>

          {/* Orta Kolon: Hızlı Linkler */}
          <div className="footer-column">
            <h4 className="footer-heading">{t('footer.quickLinks')}</h4>
            <ul className="footer-links">
              <li>
                <button 
                  onClick={() => {
                    const element = document.getElementById('how-it-works')
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                  className="footer-link"
                >
                  {t('footer.howItWorks')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const element = document.getElementById('fault-form')
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                  className="footer-link"
                >
                  {t('footer.reportFault')}
                </button>
              </li>
              <li>
                <Link href="/archive" className="footer-link">
                  {t('footer.allFaults')}
                </Link>
              </li>
              <li>
                <Link href="/documents/privacy" className="footer-link">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/documents/terms" className="footer-link">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Sağ Kolon: Acil Durum */}
          <div className="footer-column">
            <h4 className="footer-heading">{t('footer.emergency')}</h4>
            <div className="emergency-contacts">
              <div className="emergency-item">
                <div className="emergency-info">
                  <span className="emergency-number">153</span>
                  <span className="emergency-label">{t('footer.whiteDesk')}</span>
                </div>
              </div>
              <div className="emergency-item">
                <div className="emergency-info">
                  <span className="emergency-number">112</span>
                  <span className="emergency-label">{t('footer.emergencyCenter')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
