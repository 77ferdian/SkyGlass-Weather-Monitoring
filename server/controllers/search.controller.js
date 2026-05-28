const searchService = require('../services/search.service');

/**
 * GET /api/searches
 */
function getRecent(req, res) {
    const searches = searchService.getRecent();
    res.json({ searches });
}

/**
 * POST /api/searches
 * Body: { query, resolved_name?, country?, latitude?, longitude? }
 */
function log(req, res) {
    const { query, resolved_name, country, latitude, longitude } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Missing required field: query' });
    }

    const entry = searchService.log({ query, resolved_name, country, latitude, longitude });
    res.status(201).json(entry);
}

/**
 * DELETE /api/searches
 */
function clearAll(req, res) {
    const result = searchService.clearAll();
    res.json(result);
}

module.exports = { getRecent, log, clearAll };
