'use client'

import { useState, useEffect } from 'react'
import { getFaults, updateFaultStatus, archiveFault, deleteFault } from '@/app/actions/faults'
import './AdminPanel.css'

interface Fault {
  id: number
  konum: { lat: number; lng: number }
  aciklama: string
  tur: string
  kritiklik: number
  durum: string
  telefon: string | null
  email: string | null
  tarih: string
}

export default function AdminPanel() {
  const [faults, setFaults] = useState<Fault[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ tur: '', durum: '' })

  useEffect(() => {
    loadFaults()
  }, [filters])

  const loadFaults = async () => {
    try {
      setLoading(true)
      const result = await getFaults(filters)
      if (result.success) {
        setFaults(result.data || [])
      }
    } catch (error) {
      console.error('Failed to load faults:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    const result = await updateFaultStatus(id, newStatus)
    if (result.success) {
      loadFaults()
    }
  }

  const handleArchive = async (id: number) => {
    if (window.confirm('Bu arızayı arşivlemek istediğinizden emin misiniz?')) {
      const result = await archiveFault(id)
      if (result.success) {
        loadFaults()
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu arızayı silmek istediğinizden emin misiniz?')) {
      const result = await deleteFault(id)
      if (result.success) {
        loadFaults()
      }
    }
  }

  const handleViewRoute = (fault: Fault) => {
    const { lat, lng } = fault.konum
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank')
  }

  if (loading) {
    return <div className="loading">Yükleniyor...</div>
  }

  return (
    <div className="admin-panel">
      <div className="filters">
        <div className="form-group">
          <label className="form-label">Türe Göre Filtrele</label>
          <select
            className="form-select"
            value={filters.tur}
            onChange={(e) => setFilters({ ...filters, tur: e.target.value })}
          >
            <option value="">Tümü</option>
            <option value="Elektrik">Elektrik</option>
            <option value="Su">Su</option>
            <option value="Yol">Yol</option>
            <option value="Çevre">Çevre</option>
            <option value="Diğer">Diğer</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Duruma Göre Filtrele</label>
          <select
            className="form-select"
            value={filters.durum}
            onChange={(e) => setFilters({ ...filters, durum: e.target.value })}
          >
            <option value="">Tümü</option>
            <option value="Beklemede">Beklemede</option>
            <option value="İnceleniyor">İnceleniyor</option>
            <option value="Çözüldü">Çözüldü</option>
          </select>
        </div>
      </div>

      <div className="faults-grid">
        {faults.map((fault) => (
          <div key={fault.id} className="fault-card">
            <div className="fault-header">
              <h3>{fault.tur}</h3>
              <span className={`criticality-badge level-${fault.kritiklik}`}>
                {fault.kritiklik}
              </span>
            </div>
            <p className="fault-description">{fault.aciklama}</p>
            <div className="fault-info">
              <p><strong>Durum:</strong> {fault.durum}</p>
              {fault.telefon && <p><strong>Telefon:</strong> {fault.telefon}</p>}
              {fault.email && <p><strong>E-posta:</strong> {fault.email}</p>}
            </div>
            <div className="fault-actions">
              <select
                className="form-select"
                value={fault.durum}
                onChange={(e) => handleStatusUpdate(fault.id, e.target.value)}
              >
                <option value="Beklemede">Beklemede</option>
                <option value="İnceleniyor">İnceleniyor</option>
                <option value="Çözüldü">Çözüldü</option>
              </select>
              <button
                className="btn btn-primary"
                onClick={() => handleViewRoute(fault)}
              >
                Yol Tarifi
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleArchive(fault.id)}
              >
                Arşivle
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(fault.id)}
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {faults.length === 0 && (
        <p className="no-data">Henüz arıza kaydı bulunmamaktadır</p>
      )}
    </div>
  )
}
