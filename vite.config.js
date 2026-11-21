import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'homz-store',
      short_name: 'homz-store',
      description: 'homz-store',
      theme_color: '#000000',
      background_color: '#000000',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        { src: '/homz.jpg', sizes: '192x192', type: 'image/png' },
        { src: '/homz.jpg', sizes: '512x512', type: 'image/png' },
      ],
    },
    workbox: {
      navigateFallback: null,
    },
  })],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        login: resolve(__dirname, 'login.html'),
      },
    },
  },
})
