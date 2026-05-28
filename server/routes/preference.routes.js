const express = require('express');
const router = express.Router();
const prefController = require('../controllers/preference.controller');

// GET /api/preferences
router.get('/', prefController.getAll);

// PUT /api/preferences/:key
router.put('/:key', prefController.update);

module.exports = router;
