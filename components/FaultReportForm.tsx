'use client'

import { useState } from 'react'
import { reportFault } from '@/app/actions/faults'
import MapSelector from './MapSelector'
import './FaultReportForm.css'

export default function FaultReportForm() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [formData, setFormData] = useState({
    tur: '',
    kritiklik: '',
    aciklama: '',
    telefon: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!location) {
      setMessage({ type: 'error', text: 'Lütfen haritadan konum seçin' })
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

    const result = await reportFault(formDataObj)

    if (result.success) {
      setMessage({ type: 'success', text: 'Arıza bildirimi başarıyla gönderildi!' })
      setFormData({
        tur: '',
        kritiklik: '',
        aciklama: '',
        telefon: '',
        email: '',
      })
      setLocation(null)
    } else {
      setMessage({ 
        type: 'error', 
        text: result.error || 'Bir hata oluştu' 
      })
    }

    setLoading(false)
  }

  return (
    <div className="fault-report-form">
      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="form-grid">
        <div className="map-section">
          <h3>Konum Seçin</h3>
          <MapSelector location={location} onLocationSelect={setLocation} />
          {location && (
            <p className="location-info">
              Seçilen konum: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          )}
        </div>

        <div className="form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Arıza Türü</label>
              <select
                className="form-select"
                value={formData.tur}
                onChange={(e) => setFormData({ ...formData, tur: e.target.value })}
                required
              >
                <option value="">Seçiniz</option>
                <option value="Elektrik">Elektrik</option>
                <option value="Su">Su</option>
                <option value="Yol">Yol</option>
                <option value="Çevre">Çevre</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Kritiklik Seviyesi</label>
              <select
                className="form-select"
                value={formData.kritiklik}
                onChange={(e) => setFormData({ ...formData, kritiklik: e.target.value })}
                required
              >
                <option value="">Seçiniz</option>
                <option value="1">1 - Çok Düşük</option>
                <option value="2">2 - Düşük</option>
                <option value="3">3 - Orta</option>
                <option value="4">4 - Yüksek</option>
                <option value="5">5 - Çok Yüksek (Acil)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Açıklama</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={formData.aciklama}
                onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                required
                minLength={10}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Telefon (Opsiyonel)</label>
              <input
                type="tel"
                className="form-input"
                value={formData.telefon}
                onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">E-posta (Opsiyonel)</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading || !location}>
              {loading ? 'Gönderiliyor...' : 'Bildirimi Gönder'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
