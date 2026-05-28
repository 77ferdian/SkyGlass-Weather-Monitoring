const prefService = require('../services/preference.service');

/**
 * GET /api/preferences
 */
function getAll(req, res) {
    const prefs = prefService.getAll();
    res.json(prefs);
}

/**
 * PUT /api/preferences/:key
 * Body: { value: string }
 */
function update(req, res) {
    const { key } = req.params;
    const { value } = req.body;

    if (!value) {
        return res.status(400).json({ error: 'Missing required field: value' });
    }

    const allowedKeys = ['unit', 'theme'];
    if (!allowedKeys.includes(key)) {
        return res.status(400).json({
            error: `Invalid preference key: "${key}". Allowed: ${allowedKeys.join(', ')}`,
        });
    }

    const result = prefService.update(key, value);
    res.json(result);
}

module.exports = { getAll, update };
