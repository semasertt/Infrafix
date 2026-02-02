/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Strict Mode geçici olarak kapatıldı - Leaflet MapContainer ile uyumsuzluk nedeniyle
  // Production'da zaten kapalı, bu sadece development için
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unpkg.com',
      },
    ],
  },
}

module.exports = nextConfig
