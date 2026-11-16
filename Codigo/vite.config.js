
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'

const proxyOptions = {
  '/api': 'http://localhost:3000',
}

export default defineConfig(({ command }) => {
  const esDesarrollo = command === 'serve'

  const httpsOptions = esDesarrollo
    ? {
        key: fs.readFileSync('./certs/vendix-key.pem'),
        cert: fs.readFileSync('./certs/vendix-cert.pem'),
      }
    : undefined

  return {
    plugins: [react()],

    server: {
      host: '0.0.0.0',
      port: 5173,
      ...(httpsOptions ? { https: httpsOptions } : {}),
      proxy: proxyOptions,
    },

    preview: {
      host: '0.0.0.0',
      port: 4173,
      ...(httpsOptions ? { https: httpsOptions } : {}),
      proxy: proxyOptions,
    },
  }
})
