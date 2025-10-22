// server/server.js
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server/.env so PORT (and any others) are available
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import { pool } from './config/database.js';
import shoesRoutes from './routes/shoes.js';

const app = express();
const START_PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// tiny request logger
app.use((req, _res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// --- ensure table exists on boot (and seed if empty) ---
async function ensureShoesTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.shoes (
        id SERIAL PRIMARY KEY,
        shoe_name VARCHAR(255) NOT NULL,
        size_id INT NOT NULL,
        brand_id INT NOT NULL,
        type_id INT NOT NULL,
        color_id INT NOT NULL,
        cushion_id INT NOT NULL,
        cushion_color_id INT NOT NULL,
        lace_color_id INT NOT NULL
      );
    `);
    console.log('✅ Ensured public.shoes table exists');

    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS cnt FROM public.shoes;`
    );
    if (rows[0].cnt === 0) {
      await pool.query(
        `INSERT INTO public.shoes
         (shoe_name, size_id, brand_id, type_id, color_id, cushion_id, cushion_color_id, lace_color_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`,
        ['My New Daily Runners', 62, 1, 10, 20, 32, 41, 51]
      );
      console.log('🌱 Seeded 1 shoe row');
    }
  } catch (e) {
    console.error('❌ ensureShoesTable failed:', e);
  }
}
await ensureShoesTable();

// health
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// DB sanity (doesn’t throw if table is missing—reports state)
app.get('/debug/db', async (_req, res) => {
  try {
    const existsQ = `
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema='public' AND table_name='shoes'
      ) AS exists;
    `;
    const exists = (await pool.query(existsQ)).rows[0].exists;
    let count = null;
    if (exists) {
      count = (await pool.query('SELECT COUNT(*)::int AS cnt FROM public.shoes;')).rows[0].cnt;
    }
    res.json({ tableExists: exists, shoesCount: count });
  } catch (e) {
    console.error('❌ /debug/db error:', e);
    res.status(500).json({ error: e.message });
  }
});

// API (your routes file should expose GET '/' and GET '/:id')
app.use('/api/shoes', shoesRoutes);

// graceful shutdown + port retry
function attachShutdown(server) {
  const shutdown = () => {
    console.log('🔻 Shutting down...');
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

function startServer(port) {
  const server = app
    .listen(port, () => console.log(`✅ server listening on http://localhost:${port}`))
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        const next = port + 1;
        console.warn(`⚠️  Port ${port} in use — trying ${next}...`);
        startServer(next);
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });
  attachShutdown(server);
}
startServer(START_PORT);
