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

## Admin Dashboard

Open `/admin` (production) or `http://localhost:5173/Sykoti-site-web/admin.html` in development.
The dashboard is a Vite entry (`admin.html` + `src/admin/`) and requires signing in.

It lets the admin:

- **Page content** — edit texts, buttons, cards, images and section order of the public pages
  (Home, About, Programmes, Impact, Resources, Get involved, Reports, header & footer) in EN and FR.
  Defaults live in `src/content/siteDefaults.js`; only the differences are saved in the
  `SiteContent` collection. "Restore defaults" deletes a page's overrides.
- **Media library** — upload images/PDFs (resized in the browser to max 2000px). Files are stored
  in MongoDB (`MediaAsset`) and served from `/uploads/media/:id`, so they survive Vercel deployments.
- Create, edit, publish and delete articles, reports, webinars, programmes, cohorts, activities and team members.
- Manage the CyberAmbassador gallery and testimonials.
- Review applications (CyberAmbassador, Scholarships, Guardians Voice), engagements, contact messages and support pledges.

## Main Endpoints

Public:

- `GET /api/site-content` — page content overrides
- `GET /uploads/media/:id` — uploaded files
- `GET /api/reports`
- `POST /api/reports`
- `GET /api/articles`
- `GET /api/webinars`
- `POST /api/cyberambassador/inscriptions`
- `POST /api/support`

Admin:

- `GET /api/admin/overview` — dashboard counters
- `GET /api/admin/site-content`, `PUT|DELETE /api/admin/site-content/:page`
- `GET|POST /api/admin/media`, `PATCH|DELETE /api/admin/media/:id`

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
