'use client'

import { useState, useEffect } from 'react'
import { getArchivedFaults, restoreFault, deleteArchivedFault } from '@/app/actions/faults'
import './ArchivePanel.css'

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

export default function ArchivePanel() {
  const [archivedFaults, setArchivedFaults] = useState<Fault[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ tur: '' })

  useEffect(() => {
    loadArchivedFaults()
  }, [filters])

  const loadArchivedFaults = async () => {
    try {
      setLoading(true)
      const result = await getArchivedFaults(filters)
      if (result.success) {
        setArchivedFaults(result.data || [])
      }
    } catch (error) {
      console.error('Failed to load archived faults:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (id: number) => {
    if (window.confirm('Bu arızayı geri almak istediğinizden emin misiniz?')) {
      const result = await restoreFault(id)
      if (result.success) {
        loadArchivedFaults()
      }
    }
  }

  const handleDeletePermanent = async (id: number) => {
    if (window.confirm('Bu arızayı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
      const result = await deleteArchivedFault(id)
      if (result.success) {
        loadArchivedFaults()
      }
    }
  }

  if (loading) {
    return <div className="loading">Yükleniyor...</div>
  }

  return (
    <div className="archive-panel">
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
      </div>

      <div className="archived-faults-grid">
        {archivedFaults.map((fault) => (
          <div key={fault.id} className="fault-card archived">
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
              <p><strong>Tarih:</strong> {new Date(fault.tarih).toLocaleDateString('tr-TR')}</p>
            </div>
            <div className="fault-actions">
              <button
                className="btn btn-success"
                onClick={() => handleRestore(fault.id)}
              >
                Geri Al
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeletePermanent(fault.id)}
              >
                Kalıcı Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {archivedFaults.length === 0 && (
        <p className="no-data">Arşivde kayıt bulunamadı</p>
      )}
    </div>
  )
}
