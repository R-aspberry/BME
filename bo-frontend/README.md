BO Frontend

This is a lightweight React + Vite frontend for the Business Owner (BO) portal.

Run locally:

```bash
cd bo-frontend
npm install
npm run dev
```

Environment:
- Set `VITE_API_BASE` to the backend base URL if not `http://localhost:5000`.

Notes:
- The backend APIs used: `/api/auth`, `/api/projects`, `/api/bo`.
- File uploads (BRD) are encoded as Data URLs and sent as a string in `BRD` field.
- Notifications, PO feedback fields, and project milestones are not explicitly supported by the backend; the UI approximates these features using `status`, `flag`, `start_date`, and `end_date` fields.
