# Sahil Haq — Portfolio (React + Node.js + MongoDB)

The original single-page portfolio, rebuilt as a full-stack app with **the same design, styles and animations**.

```
sahil-portfolio/
├── backend/                 Node.js + Express + Mongoose API
│   ├── src/server.js        App entry (also serves frontend/dist in production)
│   ├── src/config/db.js     MongoDB connection
│   ├── src/models/          Project, Message, Content (Expertise, SkillGroup, Gig, FiverrProject, Profile)
│   ├── src/controllers/     Route logic
│   ├── src/routes/          /api routes
│   ├── src/middleware/      Admin key check, error handling
│   └── src/data/            content.js (initial data) + seed.js
├── frontend/                React 18 + Vite
│   ├── public/profile.jpg   Portrait photo (extracted from the original page)
│   └── src/
│       ├── index.css        Original stylesheet, unchanged
│       ├── App.jsx
│       ├── components/      Loader, Header, Hero, About, Sections, Projects (+ modal), Contact
│       ├── hooks/           usePortfolio (API data), useReveal (scroll reveal), useMotion (cursor/tilt/parallax)
│       ├── api/client.js    fetch wrapper
│       └── data/fallback.js Content shown if the API is offline
└── docker-compose.yml       Optional local MongoDB
```

## 1. Requirements

- Node.js 18 or newer
- MongoDB — either installed locally, via Docker (`docker compose up -d`), or a free MongoDB Atlas cluster

## 2. Setup

```bash
# install everything
npm run install:all

# configure the backend
cp backend/.env.example backend/.env
#   -> set MONGODB_URI, JWT_SECRET, ADMIN_EMAIL
#   -> generate ADMIN_PASSWORD_HASH with:
cd backend && npm run hash-password -- "your-password"

# load the portfolio content into MongoDB
npm run seed

# run API (port 5000) + React (port 5173) together
npm run dev
```

Open http://localhost:5173. In development Vite forwards `/api/*` to `http://localhost:5000`.

## 3. API

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/health` | public | Server + DB status |
| GET | `/api/portfolio` | public | All page content in one response |
| GET | `/api/projects?category=Data%20Science` | public | Projects (optionally filtered) |
| GET | `/api/projects/:slug` | public | One project |
| POST | `/api/auth/login` | public | Admin login (rate-limited 5 / 15 min, sets httpOnly JWT cookie) |
| POST | `/api/auth/logout` | public | Clear admin session cookie |
| GET | `/api/auth/me` | admin | Check current admin session |
| GET | `/api/admin/stats` | admin | Dashboard counts (projects, messages, unread, last 7 days) |
| GET/PUT | `/api/admin/profile` | admin | Read/update site content, hero, about, education, footer, social links |
| GET | `/api/admin/messages` | admin | List messages (`?search=&read=&page=&limit=`) |
| PATCH/DELETE | `/api/admin/messages/:id` | admin | Mark read/unread or delete message |
| POST | `/api/admin/upload` | admin | Upload image (jpg/png/webp, max 5MB) to `/uploads` |
| GET/POST/PUT/DELETE | `/api/admin/:resource` | admin | CRUD for `projects`, `expertise`, `skill-groups`, `gigs`, `fiverr-projects`, `experience`, `research-interests` |
| PATCH | `/api/admin/:resource/reorder` | admin | Reorder items with `[{ id, order }]` |

Admin dashboard is available at `http://localhost:5173/admin/login`.

## Vercel deployment

The root `vercel.json` builds the Vite frontend and routes `/api/*` to the
serverless Express entry point. Configure these environment variables in the
Vercel project before deploying:

- `MONGODB_URI`
- `CLIENT_ORIGIN` (the deployed frontend URL)
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`

The deployment can be checked at `/api/health`. A healthy function returns
`ok: true`; `database.configured` reports whether `MONGODB_URI` is available to
the deployment.

## 4. Editing content

- **Quick way:** edit `backend/src/data/content.js` and run `npm run seed` again (this replaces content but keeps contact messages).
- **Live way:** edit documents directly in MongoDB (Compass / Atlas UI) or use the admin project endpoints.
- Social links (GitHub, email, LinkedIn, Fiverr, Instagram, X) live in the `profile` collection. Empty links show as faded icons in the "Let’s connect" orbit, exactly as before.
- Text that isn't data (about paragraphs, experience, education) is in `frontend/src/components/`.

## 5. Production

```bash
npm run build     # builds frontend/dist
npm start         # Express serves the API and the built React app on PORT
```

If you host the frontend separately (Vercel/Netlify), set `VITE_API_URL` in `frontend/.env` to your API URL and add the frontend URL to `CLIENT_ORIGIN` in `backend/.env`.
