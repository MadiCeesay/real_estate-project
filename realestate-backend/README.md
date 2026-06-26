# Real Estate Platform — Backend

Node.js + Express + MongoDB backend for the Real Estate Property Management Platform.

## Project Structure

```
src/
├── config/
│   ├── env.js          # Loads & validates all environment variables
│   ├── database.js     # MongoDB Atlas connection
│   └── cloudinary.js   # Cloudinary SDK config
│
├── middleware/
│   ├── security.js     # Helmet, CORS, rate limiters
│   ├── auth.js         # JWT protect(), authorize(), optionalAuth()
│   ├── validate.js     # Zod schema validation wrapper
│   └── errorHandler.js # Global error handler + AppError class
│
├── models/
│   └── User.js         # User schema (buyer / agent / admin roles)
│
├── controllers/        # Route handlers (built in Phase 2+)
├── routes/             # Express routers (built in Phase 2+)
├── services/           # Business logic (AI, email, etc.)
├── validators/         # Zod schemas for each route
├── utils/
│   └── apiResponse.js  # Standardized response helpers
│
├── app.js              # Express app setup (middleware + routes)
└── server.js           # Entry point: DB connect → app.listen
```

## Security Layers

| Layer | Tool | What it does |
|-------|------|-------------|
| HTTP headers | Helmet | CSP, XSS, clickjacking protection |
| CORS | cors | Only your Vercel domain can call the API |
| Rate limiting | express-rate-limit | 100 req/15min global, 10 req/15min for auth |
| Authentication | JWT (access + refresh) | 15min access tokens, 7-day refresh rotation |
| Authorization | RBAC middleware | buyer / agent / admin roles per route |
| Input validation | Zod | All request bodies validated before controllers |
| Password storage | bcrypt (12 rounds) | Passwords hashed, never stored plain |
| Secrets | Render env vars | Keys never in source code or Git |

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in all values in .env
```

### 3. Run in development
```bash
npm run dev
```

### 4. Health check
```
GET http://localhost:5000/health
```

## Deployment (Render)

1. Create a new **Web Service** on Render
2. Connect your GitHub repo
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add all environment variables from `.env.example` in Render's dashboard
6. **Never** set environment variables in your code or commit `.env`

## Environment Variables

See `.env.example` for the full list with descriptions. Required:
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — 64-byte random hex strings
- `CLOUDINARY_*` — From your Cloudinary dashboard
- `GOOGLE_MAPS_API_KEY` — From Google Cloud Console
- `ANTHROPIC_API_KEY` — From Anthropic Console
- `EMAIL_*` — SMTP credentials (Gmail App Password recommended)
- `FRONTEND_URL` — Your Vercel deployment URL

## What's Next

- **Phase 2**: Auth routes (register, login, refresh, logout, password reset)
- **Phase 3**: Property model + CRUD routes + search
- **Phase 4**: Bookings + Favorites
- **Phase 5**: Image upload (Multer + Cloudinary)
- **Phase 6**: Google Maps proxy + AI recommendations
- **Phase 7**: Agent dashboard routes + analytics
