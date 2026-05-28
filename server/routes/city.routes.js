const express = require('express');
const router = express.Router();
const cityController = require('../controllers/city.controller');

// GET /api/cities
router.get('/', cityController.getAll);

// POST /api/cities
router.post('/', cityController.create);

// DELETE /api/cities/:id
router.delete('/:id', cityController.remove);

// PUT /api/cities/:id/order
router.put('/:id/order', cityController.updateOrder);

module.exports = router;
