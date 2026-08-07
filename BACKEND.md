# SykotiCenter Backend

This project includes an Express + MongoDB API for managing SykotiCenter content.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an environment file:

   ```bash
   cp .env.example .env
   ```

3. Set the required values in `.env`:

   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`

4. Create or update the admin account:

   ```bash
   npm run seed:admin
   ```

5. Start the API:

   ```bash
   npm run server
   ```

The API runs on `http://localhost:4001` by default.

## Admin Console

Open:

```text
http://localhost:5173/admin.html
```

or the equivalent Vite dev-server URL.

The admin account can manage:

- Reports
- Articles
- Webinars
- Cyberambassador Fellowship / platform inscriptions
- Support pledges

## Main Endpoints

Public:

- `GET /api/reports`
- `POST /api/reports`
- `GET /api/articles`
- `GET /api/webinars`
- `POST /api/cyberambassador/inscriptions`
- `POST /api/support`

Admin:

- `POST /api/admin/login`
- `GET /api/admin/:resource`
- `POST /api/admin/:resource`
- `PATCH /api/admin/:resource/:id`
- `DELETE /api/admin/:resource/:id`

Valid admin resources:

- `reports`
- `articles`
- `webinars`
- `inscriptions`
- `supports`
