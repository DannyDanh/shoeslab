// server/config/reset.js
// One-shot script: drops, recreates, and seeds public.shoes on the current DB
import { pool } from './database.js';

async function reset() {
  try {
    console.log('🔧 Dropping table if exists…');
    await pool.query('DROP TABLE IF EXISTS public.shoes;');

    console.log('🧱 Creating table…');
    await pool.query(`
      CREATE TABLE public.shoes (
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

    console.log('🌱 Seeding one row…');
    await pool.query(
      `INSERT INTO public.shoes
       (shoe_name, size_id, brand_id, type_id, color_id, cushion_id, cushion_color_id, lace_color_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`,
      ['My New Daily Runners', 62, 1, 10, 20, 32, 41, 51]
    );

    console.log('✅ Reset complete.');
  } catch (e) {
    console.error('❌ reset failed:', e);
  } finally {
    await pool.end();
    console.log('🔻 DB connection closed.');
  }
}

reset();
