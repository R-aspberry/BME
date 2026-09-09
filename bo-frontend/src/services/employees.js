import { fetchJson } from './api'

export function getEmployees() {
  return fetchJson('/api/employees')
}
