# EduNav AI setup
1. `npm install`
2. `cp .env.example .env` and set DATABASE_URL (Neon) and JWT_SECRET. Tables are created on first start.
3. Dev: `npm run dev:api` and `npm run dev:web` (open http://localhost:5173)
4. Prod: `npm run build && npm start` (one Node server serves API + built UI on $PORT)
Deploy the single Node service on Render/Railway/Northflank; on Vercel host the UI and point /api to the Node service.
