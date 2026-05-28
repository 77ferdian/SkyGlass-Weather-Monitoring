const weatherService = require('../services/weather.service');
const geocodeService = require('../services/geocode.service');

/**
 * GET /api/weather?lat=&lon=
 * Get weather by coordinates
 */
async function getByCoords(req, res) {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Missing required query parameters: lat, lon' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'lat and lon must be valid numbers' });
    }

    const weather = await weatherService.getWeather(latitude, longitude);
    res.json(weather);
}

/**
 * GET /api/weather/:city
 * Get weather by city name (geocode first, then fetch weather)
 */
async function getByCity(req, res) {
    const { city } = req.params;

    if (!city || city.trim().length < 2) {
        return res.status(400).json({ error: 'City name must be at least 2 characters' });
    }

    // Step 1: Geocode the city name
    const locations = await geocodeService.search(city.trim(), 1);

    if (locations.length === 0) {
        return res.status(404).json({ error: `City not found: "${city}"` });
    }

    const location = locations[0];

    // Step 2: Fetch weather for that location
    const weather = await weatherService.getWeather(location.latitude, location.longitude);

    res.json({
        location,
        weather,
    });
}

module.exports = { getByCoords, getByCity };
