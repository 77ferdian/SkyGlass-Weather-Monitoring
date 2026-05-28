const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const weatherController = require('../controllers/weather.controller');

// GET /api/weather?lat=&lon=
router.get('/', asyncHandler(weatherController.getByCoords));

// GET /api/weather/:city
router.get('/:city', asyncHandler(weatherController.getByCity));

module.exports = router;
