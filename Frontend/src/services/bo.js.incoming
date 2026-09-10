import { fetchJson } from './api'

export function getBOS() {
  return fetchJson('/api/bo')
}

export function getBO(id) {
  return fetchJson(`/api/bo/${id}`)
}

export function updateBO(id, payload) {
  return fetchJson(`/api/bo/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function createBO(payload) {
  return fetchJson('/api/bo', { method: 'POST', body: JSON.stringify(payload) })
}
