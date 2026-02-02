'use client'

import { useState, useEffect, useMemo } from 'react'
import { getFaults, updateFaultStatus, archiveFault, deleteFault } from '@/app/actions/faults'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRouter } from 'next/navigation'
import ArchivePanel from './ArchivePanel'
import electricIcon from '@/assets/icons/electric-ıcon.png'
import waterIcon from '@/assets/icons/water-ıcon.png'
import roadIcon from '@/assets/icons/road-ıcon.png'
import lightIcon from '@/assets/icons/light-ıcon.png'
import parkIcon from '@/assets/icons/pard-ıcon.png'
import otherIcon from '@/assets/icons/other-ıcon.png'
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
  const { t } = useLanguage()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'admin' | 'archive'>('admin')
  const [faults, setFaults] = useState<Fault[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ tur: '', durum: '', kritiklik: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const itemsPerPage = 10

  // Arıza tipi ikonları
  const getFaultTypeIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      'Elektrik': electricIcon,
      'Su & Atık Su': waterIcon,
      'Su': waterIcon,
      'Yol & Kaldırım': roadIcon,
      'Yol': roadIcon,
      'Aydınlatma': lightIcon,
      'Park & Bahçe': parkIcon,
      'Park': parkIcon,
      'Diğer': 'svg', // SVG ikon kullanacağız
      'Çevre': 'svg', // Çevre artık kullanılmıyor, SVG göster
    }
    return iconMap[type] || 'svg'
  }

  // "Diğer" için SVG ikon render et
  const renderOtherIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  )

  useEffect(() => {
    loadFaults()
  }, [filters])

  const loadFaults = async () => {
    try {
      setLoading(true)
      console.log('AdminPanel: Loading faults with filters:', filters)
      const result = await getFaults(filters)
      console.log('AdminPanel: getFaults result:', result)
      if (result.success) {
        console.log('AdminPanel: Faults loaded:', result.data?.length || 0, 'faults')
        setFaults(result.data || [])
      } else {
        console.error('AdminPanel: Failed to load faults:', result.error)
        setMessage({ type: 'error', text: result.error || 'Arızalar yüklenirken bir hata oluştu' })
      }
    } catch (error) {
      console.error('AdminPanel: Exception loading faults:', error)
      setMessage({ type: 'error', text: 'Arızalar yüklenirken bir hata oluştu' })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    const result = await updateFaultStatus(id, newStatus)
    if (result.success) {
      setMessage({ type: 'success', text: t('admin.messages.statusUpdated') })
      loadFaults()
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: 'error', text: result.error || t('admin.messages.statusUpdateError') })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleArchive = async (id: number) => {
    if (window.confirm(t('admin.confirm.archive'))) {
      const result = await archiveFault(id)
      if (result.success) {
        setMessage({ type: 'success', text: t('admin.messages.archived') })
        loadFaults()
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: result.error || t('admin.messages.archiveError') })
        setTimeout(() => setMessage(null), 5000)
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm(t('admin.confirm.delete'))) {
      const result = await deleteFault(id)
      if (result.success) {
        setMessage({ type: 'success', text: t('admin.messages.deleted') })
        loadFaults()
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: result.error || t('admin.messages.deleteError') })
        setTimeout(() => setMessage(null), 5000)
      }
    }
  }

  const handleViewRoute = (fault: Fault) => {
    const { lat, lng } = fault.konum
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank')
  }

  // İstatistikleri hesapla
  const stats = useMemo(() => {
    const pending = faults.filter(f => f.durum === 'Beklemede' || f.durum === 'Pending').length
    const inProgress = faults.filter(f => f.durum === 'İnceleniyor' || f.durum === 'In Progress').length
    const critical = faults.filter(f => f.kritiklik >= 4).length
    const resolved = faults.filter(f => f.durum === 'Çözüldü' || f.durum === 'Resolved').length
    return { pending, inProgress, critical, resolved, total: faults.length }
  }, [faults])

  // Filtrelenmiş ve aranmış arızalar
  const filteredFaults = useMemo(() => {
    let filtered = faults

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(f => 
        f.aciklama.toLowerCase().includes(query) ||
        f.tur.toLowerCase().includes(query) ||
        f.id.toString().includes(query)
      )
    }

    // Type filter
    if (filters.tur) {
      filtered = filtered.filter(f => f.tur === filters.tur)
    }

    // Status filter
    if (filters.durum) {
      filtered = filtered.filter(f => f.durum === filters.durum)
    }

    // Criticality filter
    if (filters.kritiklik) {
      filtered = filtered.filter(f => f.kritiklik === parseInt(filters.kritiklik))
    }

    return filtered
  }, [faults, searchQuery, filters])

  // Pagination
  const totalPages = Math.ceil(filteredFaults.length / itemsPerPage)
  const paginatedFaults = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredFaults.slice(start, start + itemsPerPage)
  }, [filteredFaults, currentPage])

  // Kritiklik etiketi
  const getCriticalityLabel = (level: number) => {
    if (level <= 2) return `${level}-${t('admin.criticality.low')}`
    if (level === 3) return `${level}-${t('admin.criticality.medium')}`
    if (level === 4) return `${level}-${t('admin.criticality.high')}`
    return `${level}-${t('admin.criticality.veryHigh')}`
  }

  // Durum badge rengi
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Beklemede':
      case 'Pending': return 'status-pending'
      case 'İnceleniyor':
      case 'In Progress': return 'status-assigned'
      case 'Çözüldü':
      case 'Resolved': return 'status-completed'
      default: return 'status-default'
    }
  }

  // Tab navigation
  if (activeTab === 'archive') {
    return (
      <div className="admin-panel">
        <div className="tab-navigation" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border-color)' }}>
          <button
            className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              border: 'none', 
              background: 'none', 
              cursor: 'pointer',
              borderBottom: activeTab === 'admin' ? '2px solid var(--primary-color)' : '2px solid transparent',
              color: activeTab === 'admin' ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'admin' ? '600' : '400'
            }}
          >
            {t('nav.adminPanel')}
          </button>
          <button
            className={`tab-btn ${activeTab === 'archive' ? 'active' : ''}`}
            onClick={() => setActiveTab('archive')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              border: 'none', 
              background: 'none', 
              cursor: 'pointer',
              borderBottom: activeTab === 'archive' ? '2px solid var(--primary-color)' : '2px solid transparent',
              color: activeTab === 'archive' ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'archive' ? '600' : '400'
            }}
          >
            {t('nav.archive')}
          </button>
        </div>
        <ArchivePanel />
      </div>
    )
  }

  if (loading && activeTab === 'admin') {
    return (
      <div className="admin-panel">
        <div className="tab-navigation" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border-color)' }}>
          <button
            className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              border: 'none', 
              background: 'none', 
              cursor: 'pointer',
              borderBottom: activeTab === 'admin' ? '2px solid var(--primary-color)' : '2px solid transparent',
              color: activeTab === 'admin' ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'admin' ? '600' : '400'
            }}
          >
            {t('nav.adminPanel')}
          </button>
          <button
            className={`tab-btn ${activeTab === 'archive' ? 'active' : ''}`}
            onClick={() => setActiveTab('archive')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              border: 'none', 
              background: 'none', 
              cursor: 'pointer',
              borderBottom: activeTab === 'archive' ? '2px solid var(--primary-color)' : '2px solid transparent',
              color: activeTab === 'archive' ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'archive' ? '600' : '400'
            }}
          >
            {t('nav.archive')}
          </button>
        </div>
        <div className="loading">{t('admin.loading')}</div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      {message && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: '1rem' }}>
          {message.text}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border-color)' }}>
        <button
          className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            border: 'none', 
            background: 'none', 
            cursor: 'pointer',
            borderBottom: activeTab === 'admin' ? '2px solid var(--primary-color)' : '2px solid transparent',
            color: activeTab === 'admin' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'admin' ? '600' : '400'
          }}
        >
          {t('nav.adminPanel')}
        </button>
        <button
          className={`tab-btn ${activeTab === 'archive' ? 'active' : ''}`}
          onClick={() => setActiveTab('archive')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            border: 'none', 
            background: 'none', 
            cursor: 'pointer',
            borderBottom: activeTab === 'archive' ? '2px solid var(--primary-color)' : '2px solid transparent',
            color: activeTab === 'archive' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'archive' ? '600' : '400'
          }}
        >
          {t('nav.archive')}
        </button>
      </div>

      {/* Overview Section */}
      <div className="overview-section">
        <div className="overview-header">
          <h2>{t('admin.overview')}</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder={t('admin.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="search-input"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">{t('admin.stats.pending')}</div>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-change positive">{t('admin.stats.change')} %2</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">{t('admin.stats.inProgress')}</div>
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-change positive">{t('admin.stats.change')} %5</div>
          </div>
          <div className="stat-card critical">
            <div className="stat-label">{t('admin.stats.critical')}</div>
            <div className="stat-value">{stats.critical}</div>
            <div className="stat-change negative">{t('admin.stats.change')} %10</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">{t('admin.stats.resolved')}</div>
            <div className="stat-value">{stats.resolved}</div>
            <div className="stat-change positive">{t('admin.stats.change')} %12</div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="filters-section">
        <div className="filters-row">
          <button className="filter-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2v2m8-2v2M3 7h18M5 7v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {t('admin.filters.last30Days')}
          </button>
          <select
            className="filter-select"
            value={filters.tur}
            onChange={(e) => {
              setFilters({ ...filters, tur: e.target.value })
              setCurrentPage(1)
            }}
          >
            <option value="">{t('admin.filters.faultType')}</option>
            <option value="Elektrik">{t('form.faultTypes.electricity')}</option>
            <option value="Su">{t('form.faultTypes.water')}</option>
            <option value="Yol">{t('form.faultTypes.road')}</option>
            <option value="Aydınlatma">{t('form.faultTypes.lighting')}</option>
            <option value="Park">{t('form.faultTypes.park')}</option>
            <option value="Diğer">{t('form.faultTypes.other')}</option>
          </select>
          <select
            className="filter-select"
            value={filters.kritiklik}
            onChange={(e) => {
              setFilters({ ...filters, kritiklik: e.target.value })
              setCurrentPage(1)
            }}
          >
            <option value="">{t('admin.filters.criticality')}</option>
            <option value="1">1 - {t('admin.filters.criticality1')}</option>
            <option value="2">2 - {t('admin.filters.criticality2')}</option>
            <option value="3">3 - {t('admin.filters.criticality3')}</option>
            <option value="4">4 - {t('admin.filters.criticality4')}</option>
            <option value="5">5 - {t('admin.filters.criticality5')}</option>
          </select>
          <button 
            className="btn btn-primary new-report-btn"
            onClick={() => setActiveTab('archive')}
          >
            {t('nav.archive')}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-section">
        <table className="faults-table">
          <thead>
            <tr>
              <th>{t('admin.table.reportId')}</th>
              <th>{t('admin.table.type')}</th>
              <th>{t('admin.table.location')}</th>
              <th>{t('admin.table.criticality')}</th>
              <th>{t('admin.table.status')}</th>
              <th>{t('admin.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedFaults.map((fault) => (
              <tr key={fault.id}>
                <td className="report-id">#{fault.id}</td>
                <td>
                  <div className="type-cell">
                    {getFaultTypeIcon(fault.tur) === 'svg' ? (
                      <div className="type-icon-svg">
                        {renderOtherIcon()}
                      </div>
                    ) : (
                      <>
                        <img 
                          src={getFaultTypeIcon(fault.tur).src || getFaultTypeIcon(fault.tur)} 
                          alt={fault.tur}
                          className="type-icon-img"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const placeholder = target.nextElementSibling as HTMLElement
                            if (placeholder) {
                              placeholder.style.display = 'flex'
                            }
                          }}
                        />
                        <span className="type-icon" style={{ display: 'none' }}>{fault.tur.charAt(0)}</span>
                      </>
                    )}
                    {fault.tur}
                  </div>
                </td>
                <td>
                  <a 
                    href={`https://www.google.com/maps?q=${fault.konum.lat},${fault.konum.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="location-link"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {fault.konum.lat.toFixed(4)}, {fault.konum.lng.toFixed(4)}
                  </a>
                </td>
                <td>
                  <span className={`criticality-badge level-${fault.kritiklik}`}>
                    {getCriticalityLabel(fault.kritiklik)}
                  </span>
                </td>
                <td>
                  <select
                    className={`status-select ${getStatusBadgeClass(fault.durum)}`}
                    value={fault.durum}
                    onChange={(e) => handleStatusUpdate(fault.id, e.target.value)}
                  >
                    <option value="Beklemede">{t('admin.status.pending')}</option>
                    <option value="İnceleniyor">{t('admin.status.inProgress')}</option>
                    <option value="Çözüldü">{t('admin.status.resolved')}</option>
                  </select>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn"
                      onClick={() => handleViewRoute(fault)}
                      title={t('admin.actions.route')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleArchive(fault.id)}
                      title={t('admin.actions.archive')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                    <button
                      className="action-btn danger"
                      onClick={() => handleDelete(fault.id)}
                      title={t('admin.actions.delete')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2"/>
                        <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredFaults.length === 0 && (
          <div className="no-data">
            <p>{t('admin.noData')}</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              {t('admin.pagination.previous')}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              {t('admin.pagination.next')}
            </button>
            <span className="pagination-info">
              {filteredFaults.length} {t('admin.pagination.showing')} {((currentPage - 1) * itemsPerPage) + 1}{t('admin.pagination.to')}{Math.min(currentPage * itemsPerPage, filteredFaults.length)} {t('admin.pagination.displayed')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
