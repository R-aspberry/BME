# Migration map: bo-frontend → Frontend

Generated: 2026-09-10

Summary: A safe snapshot of `bo-frontend/src` was copied to `Frontend/src/migration/bo-frontend` for review. Most files have equivalents in `Frontend/src` and therefore require manual reconciliation. Below is a file-by-file mapping indicating whether a likely counterpart exists in the current `Frontend` codebase.

Rules used:
- "Match" indicates a Frontend file with the same basename was found (may be different path).
- "No match" indicates no obvious file with the same basename exists in `Frontend`.
- Conflicts require manual diff & merge; safe files can be adopted into production folders.

## File mappings

Services

- `bo-frontend/src/services/bo.js` → Match: `Frontend/src/services/boService.js` (conflict)
- `bo-frontend/src/services/api.js` → Match: `Frontend/src/services/api.js` (conflict)
- `bo-frontend/src/services/ose.js` → Match: `Frontend/src/services/oseService.js` (conflict)
- `bo-frontend/src/services/employees.js` → Match: `Frontend/src/services/employeeService.js` (conflict)
- `bo-frontend/src/services/resourcePlanner.js` → Match: `Frontend/src/services/resourcePlannerService.js` (conflict)
- `bo-frontend/src/services/projects.js` → Match: `Frontend/src/services/projectService.js` (conflict)
- `bo-frontend/src/services/staffingRequests.js` → Likely match: `Frontend/src/services/resourceService.js` (manual review)
- `bo-frontend/src/services/auth.js` → Match: `Frontend/src/services/authService.js` (conflict)

Pages / Role pages

- `bo-frontend/src/pages/BusinessOwner/BOLayout.jsx` → Related: `Frontend/src/pages/bo/*` (conflict)
- `bo-frontend/src/pages/BusinessOwner/Dashboard/BODashboard.jsx` → Match: `Frontend/src/pages/bo/BODashboard.jsx` (conflict)
- `bo-frontend/src/pages/BusinessOwner/Projects/BOProjectList.jsx` → Related: `Frontend/src/pages/bo/MyProjects.jsx` (manual diff)
- `bo-frontend/src/pages/ProjectDetail.jsx` → Match: `Frontend/src/pages/bo/ProjectDetails.jsx` (conflict)
- `bo-frontend/src/pages/Login.jsx` → Match: `Frontend/src/pages/auth/Login.jsx` (conflict)

Employee pages

- `bo-frontend/src/pages/Employee/*` → Matches exist under `Frontend/src/pages/employee/*` (conflicts)

Resource Planner pages

- `bo-frontend/src/pages/ResourcePlanner/*` → Matches exist under `Frontend/src/pages/resourcePlanner/*` (conflicts)

Root / App

- `bo-frontend/src/App.jsx` → Match: `Frontend/src/App.jsx` (conflict)
- `bo-frontend/src/main.jsx` → Match: `Frontend/src/main.jsx` (conflict)

Components, styles, assets

- `bo-frontend/src/components/Header.jsx` → Related: `Frontend/src/components/layout/Header.jsx` (manual review)
- `bo-frontend/src/components/Sidebar.jsx` → Related: `Frontend/src/components/layout/Sidebar.jsx` (manual review)
- `bo-frontend/src/styles.css` → Related: `Frontend/src/styles/*` (manual merge required)
- Images `image_99c163.png`, `image_99c1c0.png` → Match: `Frontend/src/assets/images/` (conflict or duplicate)

Other files

- `bo-frontend/index.html`, `vite.config.js`, `package.json` — environment/build files; do not overwrite `Frontend` equivalents without review.

## Recommendation / next steps

1. Review `Frontend/src/migration/bo-frontend` snapshot for feature-by-feature diffs.
2. For every conflict, open a three-way diff against `Frontend` file and `bo-frontend` snapshot and decide which implementation to keep or merge.
3. If you'd like, I can generate per-file diffs for the top-priority files (start with `services/api.js`, `services/auth.js`, and BO pages). Approve which files to auto-copy/overwrite.

---
Migration snapshot location: `Frontend/src/migration/bo-frontend`

## Actions performed

- Copied all files from `Frontend/src/migration/bo-frontend` into `Frontend/src` for files that did not already exist (non-destructive). New files added directly into their target locations.
- For files that already existed in `Frontend/src`, created incoming copies with the `.incoming` suffix (e.g. `Frontend/src/services/api.js.incoming`) so nothing was overwritten.
- Committed these changes in a single commit `chore(migration): import bo-frontend snapshot (non-destructive), add incoming copies for conflicts`.

## Conflicts (incoming copies created)

The following files existed in `Frontend/src` and therefore were preserved; the incoming copies were placed alongside for manual review and merge:

<listed below>

styles.css
image_99c163.png
components/Header.jsx
components/Sidebar.jsx
main.jsx
App.jsx
image_99c1c0.png
pages/Profile.jsx
pages/ProjectCreate.jsx
pages/Dashboard.jsx
pages/Login.jsx
pages/Projects.jsx
pages/ResourcePlanner/PlannerRequests.jsx
pages/ResourcePlanner/PlannerPortfolio.jsx
pages/ResourcePlanner/PlannerSidebar.jsx
pages/ResourcePlanner/PlannerEmployees.jsx
pages/ResourcePlanner/PlannerHeader.jsx
pages/ResourcePlanner/PlannerDashboard.jsx
pages/ResourcePlanner/PlannerLayout.jsx
pages/Employee/EmployeePortfolios.jsx
pages/Employee/EmployeeDashboard.jsx
pages/Employee/EmployeeCalendar.jsx
pages/Employee/EmployeeSidebar.jsx
pages/Employee/EmployeeHeader.jsx
pages/Employee/EmployeeLayout.jsx
pages/Employee/EmployeeNotifications.jsx
pages/Employee/EmployeeProjects.jsx
pages/Employee/EmployeeProfile.jsx
pages/ProjectDetail.jsx
pages/BusinessOwner/Projects/BOProjectList.jsx
pages/BusinessOwner/Dashboard/BODashboard.jsx
pages/BusinessOwner/components/bo/BOHeader.jsx
pages/BusinessOwner/components/bo/BOSidebar.jsx
pages/BusinessOwner/BOLayout.jsx
services/auth.js
services/staffingRequests.js
services/projects.js
services/resourcePlanner.js
services/employees.js
services/ose.js
services/api.js
services/bo.js
