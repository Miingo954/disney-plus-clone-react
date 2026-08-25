export default async function handler(request, response) {
  const path = request.query.path
  if (!path || !/^\/(trending|movie|tv|search|discover)\//.test(path)) return response.status(400).json({ error: 'Invalid TMDB path' })
  const tmdbResponse = await fetch(`https://api.themoviedb.org/3${path}`, { headers: { Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`, accept: 'application/json' } })
  const data = await tmdbResponse.json()
  return response.status(tmdbResponse.status).json(data)
}
