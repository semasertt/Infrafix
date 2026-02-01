'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapSelector.css'

// Fix for default marker icon
delete (L.Icon.Default as any).prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

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

interface MapSelectorProps {
  location: { lat: number; lng: number } | null
  onLocationSelect: (location: { lat: number; lng: number }) => void
}

export default function MapSelector({ location, onLocationSelect }: MapSelectorProps) {
  return (
    <div className="map-selector">
      <MapContainer
        center={[39.9334, 32.8597]} // Ankara coordinates
        zoom={13}
        style={{ height: '500px', width: '100%' }}
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
