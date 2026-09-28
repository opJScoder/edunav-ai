# PATHFORGE AI — Setup Guide

## Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** v14 or higher (local or cloud)
- **npm** or **yarn**

---

## Step-by-Step Setup

### 1. Install Node.js

Download and install Node.js from [nodejs.org](https://nodejs.org/)

Verify installation:

```bash
node --version
npm --version
```

### 2. Set Up PostgreSQL

#### Option A: Local PostgreSQL

1. Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
2. Start PostgreSQL service
3. Create database:

```sql
CREATE DATABASE pathforge;
```

#### Option B: Cloud PostgreSQL (Recommended for teams)

**Supabase:**

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database → Connection string
4. Copy the connection string

**Neon:**

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

**Railway:**

1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string

### 3. Configure Environment Variables

```bash
cd server
copy .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/pathforge"
PORT=5000
JWT_SECRET="your-super-secret-key-change-this"
JWT_EXPIRES_IN="7d"
CLIENT_URL="http://localhost:5173"
AI_PROVIDER="gemini"
GEMINI_API_KEY="your-gemini-api-key"
OPENAI_API_KEY="your-openai-api-key"
```

### 4. Install Dependencies

```bash
cd server
npm install
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This creates all tables in your PostgreSQL database.

### 7. Seed the Database

```bash
npm run seed
```

This populates the database with realistic demo data.

### 8. Start the Server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

---

## Verification

### Health Check

```bash
curl http://localhost:5000
```

Expected response:

```json
{
  "success": true,
  "message": "PATHFORGE AI API is running",
  "version": "1.0.0"
}
```

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student01@pathforge.demo","password":"password123"}'
```

---

## Demo Credentials

| Email                    | Password    | Role    |
| ------------------------ | ----------- | ------- |
| student01@pathforge.demo | password123 | student |
| student02@pathforge.demo | password123 | student |
| student03@pathforge.demo | password123 | student |
| ...                      | ...         | ...     |
| student20@pathforge.demo | password123 | student |

---

## Prisma Commands

| Command                     | Description                           |
| --------------------------- | ------------------------------------- |
| `npx prisma generate`       | Generate Prisma Client                |
| `npx prisma migrate dev`    | Run migrations                        |
| `npx prisma migrate deploy` | Deploy migrations (production)        |
| `npx prisma studio`         | Open Prisma Studio (database GUI)     |
| `npx prisma db push`        | Push schema changes without migration |
| `npm run seed`              | Seed the database                     |

---

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Seed script
├── src/
│   ├── config/
│   │   └── env.js         # Environment configuration
│   ├── controllers/       # Request handlers
│   ├── routes/            # API route definitions
│   ├── middleware/        # Auth & error handling
│   ├── services/          # Business logic
│   ├── validators/        # Input validation (Zod)
│   └── app.js             # Express app setup
├── server.js              # Entry point
├── package.json
├── .env.example
├── .gitignore
├── DATABASE.md
├── API_DOCUMENTATION.md
└── SETUP.md
```

---

## Troubleshooting

## Vercel Deployment

The repository is configured as a single Vercel project. Vercel builds the React client and exposes `api/index.js` as the Express API function.

Before deploying, move the database from SQLite to a hosted PostgreSQL database such as Neon or Supabase. Vercel functions do not provide persistent storage for the current `file:./dev.db` database. The checked-in migration was generated for SQLite, so regenerate the initial migration for PostgreSQL rather than applying it unchanged.

1. Create a hosted PostgreSQL database and obtain its connection string.
2. Change the Prisma datasource provider in `prisma/schema.prisma` from `sqlite` to `postgresql`.
3. Create and apply a PostgreSQL migration locally:

```bash
npx prisma migrate dev --name postgres_init
npx prisma generate
```

4. Push the project to GitHub and import the repository into Vercel.
5. Keep the project root set to the repository root. The root `vercel.json` handles the client build, API function, and React Router fallback.
6. Add these Vercel environment variables for Production, Preview, and Development:

```env
DATABASE_URL=your-postgresql-connection-string
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-project.vercel.app
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
```

7. Deploy. After deployment, verify `https://your-project.vercel.app/api/` and then log in through the frontend.

Do not run the seed script automatically in the Vercel build. Run it once against the hosted database from a trusted local environment after applying the production migration:

```bash
cd server
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed
```

### PostgreSQL Connection Error

```
Can't reach database server at localhost:5432
```

**Solution:** Make sure PostgreSQL is running and the port is correct.

### Prisma Migration Error

```
Prisma schema is not valid
```

**Solution:** Run `npx prisma validate` to check for errors.

### Port Already in Use

```
EADDRINUSE: address already in use :::5000
```

**Solution:** Change PORT in `.env` or kill the process using port 5000.

### JWT Secret Warning

Make sure to change `JWT_SECRET` in production!

---

## Next Steps for Frontend Team

1. Set `VITE_API_URL=http://localhost:5000/api` in your `.env`
2. Use the demo credentials to test login
3. Store JWT token in localStorage
4. Add `Authorization: Bearer <token>` header to protected requests
5. See `API_DOCUMENTATION.md` for all available endpoints
