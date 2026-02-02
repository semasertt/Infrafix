'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import '../documents.css'

export default function TermsPage() {
  const { t } = useLanguage()

  return (
    <div className="document-page">
      <div className="container">
        <div className="document-content">
          <h1>{t('documents.terms.title')}</h1>
          <p className="document-date">{t('documents.lastUpdated')}: {new Date().toLocaleDateString('tr-TR')}</p>
          
          <section>
            <h2>{t('documents.terms.section1.title')}</h2>
            <p>{t('documents.terms.section1.content')}</p>
          </section>

          <section>
            <h2>{t('documents.terms.section2.title')}</h2>
            <p>{t('documents.terms.section2.content')}</p>
            <ul>
              <li>{t('documents.terms.section2.item1')}</li>
              <li>{t('documents.terms.section2.item2')}</li>
              <li>{t('documents.terms.section2.item3')}</li>
              <li>{t('documents.terms.section2.item4')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('documents.terms.section3.title')}</h2>
            <p>{t('documents.terms.section3.content')}</p>
          </section>

          <section>
            <h2>{t('documents.terms.section4.title')}</h2>
            <p>{t('documents.terms.section4.content')}</p>
          </section>

          <section>
            <h2>{t('documents.terms.section5.title')}</h2>
            <p>{t('documents.terms.section5.content')}</p>
          </section>

          <section>
            <h2>{t('documents.terms.section6.title')}</h2>
            <p>{t('documents.terms.section6.content')}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
