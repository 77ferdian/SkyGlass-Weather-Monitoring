const geocodeService = require('../services/geocode.service');

/**
 * GET /api/geocode?q=&count=
 * Search for cities by name
 */
async function search(req, res) {
    const { q, count } = req.query;

    if (!q || q.trim().length < 2) {
        return res.status(400).json({ error: 'Query "q" must be at least 2 characters' });
    }

    const requestedCount = Math.min(parseInt(count) || 5, 10);
    const results = await geocodeService.search(q.trim(), 10);

    // Sort by population desc
    results.sort((a, b) => b.population - a.population);

    const finalResults = results.slice(0, requestedCount);

    res.json({ results: finalResults });
}

module.exports = { search };
