// In development, use Vite's existing /api proxy so the browser makes a
// same-origin request and is not blocked by the backend CORS policy.
const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function fetchJson(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  if (res.status === 204) return null
  return res.json()
}
