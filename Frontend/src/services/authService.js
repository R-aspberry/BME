import { fetchJson } from './api'

export async function login(userName, password) {
  return fetchJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ userName, password })
  })
}

export function me() {
  return fetchJson('/api/auth/me')
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  localStorage.removeItem('role')
}
