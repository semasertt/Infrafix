'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import './MapSelector.css'

interface MapSelectorProps {
  location: { lat: number; lng: number } | null
  onLocationSelect: (location: { lat: number; lng: number }) => void
}

// Dynamic import for entire map (client-side only)
const DynamicMap = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="map-selector" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
        <p>Harita yükleniyor...</p>
      </div>
    )
  }
)

export default function MapSelector({ location, onLocationSelect }: MapSelectorProps) {
  return <DynamicMap location={location} onLocationSelect={onLocationSelect} />
}
