// server/controllers/shoesController.js
import { pool } from '../config/database.js';

/**
 * Table: public.shoes
 * Columns:
 *  id SERIAL PRIMARY KEY,
 *  shoe_name VARCHAR(255) NOT NULL,
 *  size_id INT NOT NULL,
 *  brand_id INT NOT NULL,
 *  type_id INT NOT NULL,
 *  color_id INT NOT NULL,
 *  cushion_id INT NOT NULL,
 *  cushion_color_id INT NOT NULL,
 *  lace_color_id INT NOT NULL
 */

// GET /api/shoes
const getShoes = async (_req, res) => {
  try {
    const q = `
      SELECT
        id,
        shoe_name        AS "shoeName",
        size_id          AS "sizeId",
        brand_id         AS "brandId",
        type_id          AS "typeId",
        color_id         AS "colorId",
        cushion_id       AS "cushionId",
        cushion_color_id AS "cushionColorId",
        lace_color_id    AS "laceColorId"
      FROM public.shoes
      ORDER BY id ASC;
    `;
    const { rows } = await pool.query(q);
    res.status(200).json(rows);
  } catch (err) {
    console.error('GET /api/shoes failed:', err);
    res.status(500).json({ error: 'Failed to fetch shoes' });
  }
};

// GET /api/shoes/:id
const getShoeById = async (req, res) => {
  try {
    const { id } = req.params;
    const q = `
      SELECT
        id,
        shoe_name        AS "shoeName",
        size_id          AS "sizeId",
        brand_id         AS "brandId",
        type_id          AS "typeId",
        color_id         AS "colorId",
        cushion_id       AS "cushionId",
        cushion_color_id AS "cushionColorId",
        lace_color_id    AS "laceColorId"
      FROM public.shoes
      WHERE id = $1;
    `;
    const { rows } = await pool.query(q, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Shoe not found' });
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('GET /api/shoes/:id failed:', err);
    res.status(500).json({ error: 'Failed to fetch shoe' });
  }
};

// POST /api/shoes
const createShoe = async (req, res) => {
  try {
    const {
      shoeName,
      sizeId,
      brandId,
      typeId,
      colorId,
      cushionId,
      cushionColorId,
      laceColorId,
    } = req.body || {};

    // basic required validation
    const required = { shoeName, sizeId, brandId, typeId, colorId, cushionId, cushionColorId, laceColorId };
    const missing = Object.entries(required).filter(([, v]) => v === undefined || v === null || v === '');
    if (missing.length) {
      return res.status(400).json({ error: `Missing required fields: ${missing.map(([k]) => k).join(', ')}` });
    }

    const q = `
      INSERT INTO public.shoes
        (shoe_name, size_id, brand_id, type_id, color_id, cushion_id, cushion_color_id, lace_color_id)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING
        id,
        shoe_name        AS "shoeName",
        size_id          AS "sizeId",
        brand_id         AS "brandId",
        type_id          AS "typeId",
        color_id         AS "colorId",
        cushion_id       AS "cushionId",
        cushion_color_id AS "cushionColorId",
        lace_color_id    AS "laceColorId";
    `;
    const vals = [
      String(shoeName),
      Number(sizeId),
      Number(brandId),
      Number(typeId),
      Number(colorId),
      Number(cushionId),
      Number(cushionColorId),
      Number(laceColorId),
    ];
    const { rows } = await pool.query(q, vals);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /api/shoes failed:', err);
    res.status(500).json({ error: 'Failed to create shoe' });
  }
};

// PATCH /api/shoes/:id  (partial update)
const updateShoe = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body || {};

    // map camelCase -> snake_case
    const map = {
      shoeName: 'shoe_name',
      sizeId: 'size_id',
      brandId: 'brand_id',
      typeId: 'type_id',
      colorId: 'color_id',
      cushionId: 'cushion_id',
      cushionColorId: 'cushion_color_id',
      laceColorId: 'lace_color_id',
    };

    const sets = [];
    const values = [];
    let idx = 1;

    for (const [key, col] of Object.entries(map)) {
      if (payload[key] !== undefined) {
        // coerce numbers where appropriate
        const val = /Id$/.test(key) && key !== 'shoeName'
          ? (payload[key] === null ? null : Number(payload[key]))
          : payload[key];
        sets.push(`${col} = $${idx++}`);
        values.push(val);
      }
    }

    if (sets.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const q = `
      UPDATE public.shoes
      SET ${sets.join(', ')}
      WHERE id = $${idx}
      RETURNING
        id,
        shoe_name        AS "shoeName",
        size_id          AS "sizeId",
        brand_id         AS "brandId",
        type_id          AS "typeId",
        color_id         AS "colorId",
        cushion_id       AS "cushionId",
        cushion_color_id AS "cushionColorId",
        lace_color_id    AS "laceColorId";
    `;
    values.push(id);

    const { rows } = await pool.query(q, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Shoe not found' });
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('PATCH /api/shoes/:id failed:', err);
    res.status(500).json({ error: 'Failed to update shoe' });
  }
};

// DELETE /api/shoes/:id
const deleteShoe = async (req, res) => {
  try {
    const { id } = req.params;
    const q = `DELETE FROM public.shoes WHERE id = $1 RETURNING id;`;
    const { rows } = await pool.query(q, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Shoe not found' });
    res.status(204).send(); // No Content
  } catch (err) {
    console.error('DELETE /api/shoes/:id failed:', err);
    res.status(500).json({ error: 'Failed to delete shoe' });
  }
};

export default { getShoes, getShoeById, createShoe, updateShoe, deleteShoe };
