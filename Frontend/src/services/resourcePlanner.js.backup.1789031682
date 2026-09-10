import { fetchJson } from './api'

export function getResourcePlanners() {
  return fetchJson('/api/ResourcePlanner')
}

export function getResourcePlanner(id) {
  return fetchJson(`/api/ResourcePlanner/${id}`)
}

export function updateResourcePlanner(id, payload) {
  return fetchJson(`/api/ResourcePlanner/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}
