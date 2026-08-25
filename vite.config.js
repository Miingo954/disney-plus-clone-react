import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), {
      name: 'local-tmdb-proxy',
      configureServer(server) {
        server.middlewares.use('/api/tmdb', async (request, response) => {
          const path = new URL(request.url, 'http://localhost').searchParams.get('path')
          if (!path || !/^\/(trending|movie|tv|search|discover)\//.test(path)) { response.statusCode = 400; response.end('Invalid TMDB path'); return }
          const tmdbResponse = await fetch(`https://api.themoviedb.org/3${path}`, { headers: { Authorization: `Bearer ${env.VITE_TMDB_READ_TOKEN}` } })
          response.statusCode = tmdbResponse.status
          response.setHeader('Content-Type', 'application/json')
          response.end(await tmdbResponse.text())
        })
      },
    }],
  }
})
