import { fetchJson } from './api'

export function getProjects() {
  return fetchJson('/api/projects')
}

export function getMyProjects() {
  return fetchJson('/api/projects/mine')
}

export function getProject(id) {
  return fetchJson(`/api/projects/${id}`)
}

export function createProject(payload) {
  return fetchJson('/api/projects', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateProject(id, payload) {
  return fetchJson(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function deleteProject(id) {
  return fetchJson(`/api/projects/${id}`, { method: 'DELETE' })
}
