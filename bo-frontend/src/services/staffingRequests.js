import { fetchJson } from './api'

export function getPORequests() { return fetchJson('/api/staffing-requests/po') }
export function getPlannerRequests() { return fetchJson('/api/staffing-requests/planner') }
export function createPlannerRequest(payload) { return fetchJson('/api/staffing-requests/planner', { method: 'POST', body: JSON.stringify(payload) }) }
export function updatePlannerRequestStatus(id, status) { return fetchJson(`/api/staffing-requests/planner/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }) }
