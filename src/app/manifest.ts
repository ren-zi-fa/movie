import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bajakin',
    short_name: 'Bajakin',
    description: 'created by renzi febriandika',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/video-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/video-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}