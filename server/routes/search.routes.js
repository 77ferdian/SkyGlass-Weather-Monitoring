const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

// GET /api/searches
router.get('/', searchController.getRecent);

// POST /api/searches
router.post('/', searchController.log);

// DELETE /api/searches
router.delete('/', searchController.clearAll);

module.exports = router;
