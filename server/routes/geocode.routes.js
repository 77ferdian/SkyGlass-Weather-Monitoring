const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const geocodeController = require('../controllers/geocode.controller');

// GET /api/geocode?q=&count=
router.get('/', asyncHandler(geocodeController.search));

module.exports = router;
