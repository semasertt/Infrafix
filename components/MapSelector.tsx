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
      <div className="map-selector map-loading">
        <p>Harita yükleniyor...</p>
      </div>
    )
  }
)

export default function MapSelector({ location, onLocationSelect }: MapSelectorProps) {
  // Unique key to prevent React Strict Mode double-initialization issues
  return <DynamicMap key="map-selector-instance" location={location} onLocationSelect={onLocationSelect} />
}
