// server/routes/shoes.js
import express from 'express';
import shoesController from '../controllers/shoesController.js';

const router = express.Router();

router.get('/', shoesController.getShoes);
router.get('/:id(\\d+)', shoesController.getShoeById);
router.post('/', shoesController.createShoe);       // ← required
router.patch('/:id(\\d+)', shoesController.updateShoe);
router.delete('/:id(\\d+)', shoesController.deleteShoe);

export default router;
