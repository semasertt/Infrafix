'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import '../documents.css'

export default function PrivacyPage() {
  const { t } = useLanguage()

  return (
    <div className="document-page">
      <div className="container">
        <div className="document-content">
          <h1>{t('documents.privacy.title')}</h1>
          <p className="document-date">{t('documents.lastUpdated')}: {new Date().toLocaleDateString('tr-TR')}</p>
          
          <section>
            <h2>{t('documents.privacy.section1.title')}</h2>
            <p>{t('documents.privacy.section1.content')}</p>
          </section>

          <section>
            <h2>{t('documents.privacy.section2.title')}</h2>
            <p>{t('documents.privacy.section2.content')}</p>
            <ul>
              <li>{t('documents.privacy.section2.item1')}</li>
              <li>{t('documents.privacy.section2.item2')}</li>
              <li>{t('documents.privacy.section2.item3')}</li>
              <li>{t('documents.privacy.section2.item4')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('documents.privacy.section3.title')}</h2>
            <p>{t('documents.privacy.section3.content')}</p>
          </section>

          <section>
            <h2>{t('documents.privacy.section4.title')}</h2>
            <p>{t('documents.privacy.section4.content')}</p>
          </section>

          <section>
            <h2>{t('documents.privacy.section5.title')}</h2>
            <p>{t('documents.privacy.section5.content')}</p>
          </section>

          <section>
            <h2>{t('documents.privacy.section6.title')}</h2>
            <p>{t('documents.privacy.section6.content')}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
