# Emmanuel Nemi - Creative Technologist Portfolio

A Nemi RZX styled full-stack portfolio for Emmanuel Nemi, built with a React frontend, Express API, editable project data, uploads, authentication, and an admin dashboard.

## Stack

- Client: Vite, React, React Router, Three.js
- Server: Express, MongoDB/Mongoose, JWT auth with httpOnly cookies
- Admin: `/admin` for projects, site copy, service cards, social links, tech tags, and image uploads

## Quick Start

From this folder:

```bash
npm install
npm run build
npm run dev
```

On Windows PowerShell, if `npm` is blocked by execution policy, use:

```bash
npm.cmd run build
npm.cmd run dev
```

URLs:

- Site: http://localhost:5173
- Admin login: http://localhost:5173/admin/login
- API health: http://localhost:3001/api/health

Default admin from `.env`:

- Email: `admin@nemirzx.com`
- Password: `changeme123`

## Database

The app tries MongoDB first using `MONGODB_URI` from `.env`.

If MongoDB is not running locally, the server automatically falls back to a local JSON development store at `server/data/dev-db.json`. This lets the portfolio and admin dashboard run on this machine without setting up MongoDB first.

For production, use a real MongoDB database and set:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
CLIENT_URL=your_frontend_url
PORT=3001
NODE_ENV=production
```

## Editing Content

Use the admin dashboard:

1. Open `/admin/login`
2. Sign in with the admin credentials
3. Edit projects, hero text, value statement, services, socials, and tech icons
4. Upload project/service images as needed

Uploaded images are stored in `server/uploads/` and served from `/uploads/...`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run API and client together |
| `npm run build` | Build the client and compile the server |
| `npm run seed` | Seed MongoDB when MongoDB is available |
| `npm start` | Run the compiled server |

The active app lives in `client/` and `server/`. The older root `src/` folder is legacy reference code from the original 3D template.
