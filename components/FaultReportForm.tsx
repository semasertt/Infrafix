'use client'

import { useState, useRef } from 'react'
import { reportFault } from '@/app/actions/faults'
import { useLanguage } from '@/contexts/LanguageContext'
import MapSelector from './MapSelector'
import electricIcon from '@/assets/icons/electric-ıcon.png'
import waterIcon from '@/assets/icons/water-ıcon.png'
import roadIcon from '@/assets/icons/road-ıcon.png'
import lightIcon from '@/assets/icons/light-ıcon.png'
import parkIcon from '@/assets/icons/pard-ıcon.png'
import otherIcon from '@/assets/icons/other-ıcon.png'
import './FaultReportForm.css'

export default function FaultReportForm() {
  const { t } = useLanguage()
  
  const FAULT_TYPES = [
    { id: 'Elektrik', icon: electricIcon, label: t('form.faultTypes.electricity') },
    { id: 'Su', icon: waterIcon, label: t('form.faultTypes.water') },
    { id: 'Yol', icon: roadIcon, label: t('form.faultTypes.road') },
    { id: 'Aydınlatma', icon: lightIcon, label: t('form.faultTypes.lighting') },
    { id: 'Park', icon: parkIcon, label: t('form.faultTypes.park') },
    { id: 'Diğer', icon: otherIcon, label: t('form.faultTypes.other') },
  ]
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [formData, setFormData] = useState({
    tur: '',
    kritiklik: '3',
    aciklama: '',
    telefon: '',
    email: '',
  })
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Fotoğraf boyutu 10MB\'dan küçük olmalıdır' })
        return
      }
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Fotoğraf boyutu 10MB\'dan küçük olmalıdır' })
        return
      }
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!location) {
      setMessage({ type: 'error', text: 'Lütfen haritadan konum seçin' })
      return
    }

    if (!formData.tur) {
      setMessage({ type: 'error', text: 'Lütfen arıza tipi seçin' })
      return
    }

    setLoading(true)
    setMessage(null)

    const formDataObj = new FormData()
    formDataObj.append('konum', JSON.stringify(location))
    formDataObj.append('aciklama', formData.aciklama)
    formDataObj.append('tur', formData.tur)
    formDataObj.append('kritiklik', formData.kritiklik)
    if (formData.telefon) formDataObj.append('telefon', formData.telefon)
    if (formData.email) formDataObj.append('email', formData.email)
    if (photo) formDataObj.append('photo', photo)

    const result = await reportFault(formDataObj)

    if (result.success) {
      setMessage({ type: 'success', text: 'Arıza bildirimi başarıyla gönderildi!' })
      setFormData({
        tur: '',
        kritiklik: '3',
        aciklama: '',
        telefon: '',
        email: '',
      })
      setLocation(null)
      setPhoto(null)
      setPhotoPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } else {
      setMessage({ 
        type: 'error', 
        text: result.error || 'Bir hata oluştu' 
      })
    }

    setLoading(false)
  }

  const getSeverityLabel = (value: string) => {
    const num = parseInt(value)
    if (num <= 2) return { text: t('form.severity.low') }
    if (num <= 3) return { text: t('form.severity.normal') }
    return { text: t('form.severity.critical') }
  }

  return (
    <div className="fault-report-form-container">
      <div className="form-header">
        <h2>Arıza Bildirim Formu</h2>
        <p>Lütfen aşağıdaki adımları takip ederek bildiriminizi oluşturun.</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="fault-form">
        {/* Step 1: Konum İşaretleme */}
        <div className="form-step-card">
          <div className="step-header">
            <span className="step-number">1</span>
            <h3 className="step-title">{t('form.step1.title')}</h3>
          </div>
          <div className="step-content">
            <div className="map-wrapper">
              <MapSelector location={location} onLocationSelect={setLocation} />
              {location && (
                <div className="location-badge">
                  <span>Konumu Buraya Sabitle</span>
                  <span className="badge-count">0-1</span>
                </div>
              )}
            </div>
            {location && (
              <div className="location-address">
                Konum: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Arıza Tipi Seçin */}
        <div className="form-step-card">
          <div className="step-header">
            <span className="step-number">2</span>
            <h3 className="step-title">{t('form.step2.title')}</h3>
          </div>
          <div className="step-content">
            <div className="fault-type-buttons">
              {FAULT_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  className={`fault-type-btn ${formData.tur === type.id ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, tur: type.id })}
                >
                  <div className="fault-type-icon">
                    {type.id === 'Diğer' ? (
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fault-icon-svg">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="8" r="1.5" fill="currentColor"/>
                        <circle cx="16" cy="8" r="1.5" fill="currentColor"/>
                        <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                        <circle cx="16" cy="12" r="1.5" fill="currentColor"/>
                        <circle cx="8" cy="16" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
                        <circle cx="16" cy="16" r="1.5" fill="currentColor"/>
                      </svg>
                    ) : (
                      <>
                        <img 
                          src={typeof type.icon === 'string' ? type.icon : (type.icon as any).src || type.icon} 
                          alt={type.label}
                          className="fault-icon-img"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const placeholder = target.nextElementSibling as HTMLElement
                            if (placeholder) {
                              placeholder.style.display = 'flex'
                            }
                          }}
                          onLoad={(e) => {
                            const target = e.target as HTMLImageElement
                            const placeholder = target.nextElementSibling as HTMLElement
                            if (placeholder) {
                              placeholder.style.display = 'none'
                            }
                          }}
                        />
                        <div className="icon-placeholder" style={{ display: 'none' }}>
                          {type.id.charAt(0)}
                        </div>
                      </>
                    )}
                  </div>
                  <span className="fault-type-label">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Önem Derecesi */}
        <div className="form-step-card">
          <div className="step-header">
            <span className="step-number">3</span>
            <h3 className="step-title">{t('form.step3.title')}</h3>
          </div>
          <div className="step-content">
            <div className="severity-slider-container">
              <div className="severity-slider-wrapper">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.kritiklik}
                  onChange={(e) => setFormData({ ...formData, kritiklik: e.target.value })}
                  className="severity-slider"
                />
                <div className="severity-track">
                  <div 
                    className="severity-track-fill" 
                    style={{ width: `${((parseFloat(formData.kritiklik) - 1) / 4) * 100}%` }}
                  />
                </div>
              </div>
              <div className="severity-labels">
                <span>{t('form.severity.low')}</span>
                <span>{t('form.severity.normal')}</span>
                <span>{t('form.severity.critical')}</span>
              </div>
              <div className="severity-value">
                {t('form.severity.selected')}: <strong>
                  {getSeverityLabel(formData.kritiklik).text} ({formData.kritiklik})
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Açıklama */}
        <div className="form-step-card">
          <div className="step-content">
            <label className="form-label">{t('form.description')}</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={formData.aciklama}
              onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
              placeholder={t('form.descriptionPlaceholder')}
              required
              minLength={10}
            />
          </div>
        </div>

        {/* Step 4: Fotoğraf Ekle */}
        <div className="form-step-card">
          <div className="step-header">
            <span className="step-number">4</span>
            <h3 className="step-title">{t('form.step4.title')}</h3>
          </div>
          <div className="step-content">
            <div
              className="photo-upload-area"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Preview" />
                  <button
                    type="button"
                    className="remove-photo"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPhoto(null)
                      setPhotoPreview(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3.31-2.69 6-6 6s-6-2.69-6-6H5c0 3.31 2.69 6 6 6s6-2.69 6-6h2.3z" fill="currentColor"/>
                  </svg>
                  <p className="upload-text">{t('form.upload.text')}</p>
                  <p className="upload-hint">{t('form.upload.hint')}</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={loading || !location || !formData.tur}>
          {loading ? t('form.submitting') : t('form.submit')}
        </button>
      </form>
    </div>
  )
}
