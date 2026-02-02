'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapSelector.css'

// Fix for default marker icon
if (typeof window !== 'undefined') {
  delete (L.Icon.Default as any).prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

interface MapClickHandlerProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void
}

function MapClickHandler({ onLocationSelect }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

interface MapComponentProps {
  location: { lat: number; lng: number } | null
  onLocationSelect: (location: { lat: number; lng: number }) => void
}

export default function MapComponent({ location, onLocationSelect }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [shouldRenderMap, setShouldRenderMap] = useState(true)
  const containerIdRef = useRef(`map-container-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    // Sadece client-side'da mount et
    setIsMounted(true)
    
    // Container'ı kontrol et - eğer zaten bir map varsa render etme
    if (containerRef.current) {
      const container = containerRef.current
      if ((container as any)._leaflet_id) {
        setShouldRenderMap(false)
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        try {
          // Container'ı kontrol et - eğer DOM'dan kaldırılmışsa remove çağırma
          const container = mapRef.current.getContainer()
          if (container && container.parentNode) {
            mapRef.current.remove()
          }
        } catch (e) {
          // Map zaten kaldırılmış olabilir
        }
        mapRef.current = null
      }
      setShouldRenderMap(true)
      setIsMounted(false)
    }
  }, [])

  // Client-side'da mount edilene kadar bekle
  if (!isMounted) {
    return (
      <div className="map-selector map-loading">
        <p>Harita yükleniyor...</p>
      </div>
    )
  }

  // Eğer zaten bir map varsa, MapContainer'ı render etme
  if (!shouldRenderMap) {
    return (
      <div className="map-selector" ref={containerRef} id={containerIdRef.current} style={{ height: '500px', width: '100%' }}>
        {/* Map zaten var */}
      </div>
    )
  }

  return (
    <div className="map-selector" ref={containerRef} id={containerIdRef.current}>
      <MapContainer
        key={containerIdRef.current} // Unique key - React Strict Mode için
        center={[39.9334, 32.8597]} // Ankara coordinates
        zoom={13}
        style={{ height: '500px', width: '100%' }}
        whenCreated={(map) => {
          // Container'ı kontrol et - eğer zaten bir map varsa, yenisini kaldır
          const container = map.getContainer()
          if (container && (container as any)._leaflet_id && (container as any)._leaflet_id !== (map as any)._leaflet_id) {
            try {
              map.remove()
            } catch (e) {
              // Map zaten kaldırılmış olabilir
            }
            setShouldRenderMap(false)
            return
          }

          // Eğer zaten bir map varsa, yenisini kaldır
          if (mapRef.current) {
            try {
              map.remove()
            } catch (e) {
              // Map zaten kaldırılmış olabilir
            }
            setShouldRenderMap(false)
            return
          }

          // Map'i kaydet
          mapRef.current = map
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        {location && <Marker position={[location.lat, location.lng]} />}
      </MapContainer>
    </div>
  )
}
