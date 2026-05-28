const cityService = require('../services/city.service');

/**
 * GET /api/cities
 */
function getAll(req, res) {
    const cities = cityService.getAll();
    res.json({ cities });
}

/**
 * POST /api/cities
 * Body: { name, country, latitude, longitude, timezone? }
 */
function create(req, res) {
    const { name, country, latitude, longitude, timezone } = req.body;

    if (!name || !country || latitude == null || longitude == null) {
        return res.status(400).json({
            error: 'Missing required fields: name, country, latitude, longitude',
        });
    }

    const city = cityService.create({ name, country, latitude, longitude, timezone });
    res.status(201).json(city);
}

/**
 * DELETE /api/cities/:id
 */
function remove(req, res) {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid city ID' });
    }

    const deleted = cityService.remove(id);

    if (!deleted) {
        return res.status(404).json({ error: 'City not found' });
    }

    res.json({ success: true });
}

/**
 * PUT /api/cities/:id/order
 * Body: { order: number }
 */
function updateOrder(req, res) {
    const id = parseInt(req.params.id);
    const { order } = req.body;

    if (isNaN(id) || order == null) {
        return res.status(400).json({ error: 'Invalid city ID or missing order' });
    }

    const updated = cityService.updateOrder(id, order);

    if (!updated) {
        return res.status(404).json({ error: 'City not found' });
    }

    res.json({ success: true });
}

module.exports = { getAll, create, remove, updateOrder };
