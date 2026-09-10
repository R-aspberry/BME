import { fetchJson } from './api'

export function getOSEmployees() {
  return fetchJson('/api/OSE')
}

export function createOSE(payload) {
  return fetchJson('/api/OSE', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateOSE(id, payload) {
  return fetchJson(`/api/OSE/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function deleteOSE(id) {
  return fetchJson(`/api/OSE/${id}`, { method: 'DELETE' })
}
