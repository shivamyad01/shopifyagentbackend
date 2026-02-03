# AIShopify Frontend

## Setup

1. Install dependencies

```bash
npm install
```

2. Configure env

Create `.env`:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

(Reference: `.env.example`)

3. Run

```bash
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

## Routes

- `/login`
- `/register`

Tenant:
- `/app`
- `/app/analytics`
- `/app/connect-store`

Super admin:
- `/admin`
- `/admin/tenants`
- `/admin/stores`

## Notes

- JWT is stored in `localStorage` under key `token`.
- API base URL is controlled via `VITE_API_BASE_URL`.
