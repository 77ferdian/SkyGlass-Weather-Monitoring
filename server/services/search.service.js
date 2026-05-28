const db = require('../database');

const MAX_RECENT = 10;

// ─── Prepared Statements ──────────────────────────────────────────────
const stmts = {
    getRecent: db.prepare('SELECT * FROM recent_searches ORDER BY searched_at DESC LIMIT ?'),
    insert:    db.prepare(`
        INSERT INTO recent_searches (query, resolved_name, country, latitude, longitude)
        VALUES (@query, @resolved_name, @country, @latitude, @longitude)
    `),
    clearAll:  db.prepare('DELETE FROM recent_searches'),
    cleanup:   db.prepare(`
        DELETE FROM recent_searches WHERE id NOT IN (
            SELECT id FROM recent_searches ORDER BY searched_at DESC LIMIT ?
        )
    `),
    findDupe:  db.prepare(`
        SELECT id FROM recent_searches 
        WHERE resolved_name = ? 
        ORDER BY searched_at DESC LIMIT 1
    `),
    updateTimestamp: db.prepare(`
        UPDATE recent_searches SET searched_at = CURRENT_TIMESTAMP WHERE id = ?
    `),
};

/**
 * Get recent searches (max 10)
 * @param {number} [limit=10]
 * @returns {Array}
 */
function getRecent(limit = MAX_RECENT) {
    return stmts.getRecent.all(limit);
}

/**
 * Log a new search entry. If the same city was recently searched,
 * just bump its timestamp instead of creating a duplicate.
 * Automatically cleans up old entries beyond MAX_RECENT.
 *
 * @param {{ query: string, resolved_name?: string, country?: string, latitude?: number, longitude?: number }} entry
 * @returns {object}
 */
function log(entry) {
    // Check if same resolved_name already exists
    if (entry.resolved_name) {
        const existing = stmts.findDupe.get(entry.resolved_name);
        if (existing) {
            stmts.updateTimestamp.run(existing.id);
            return { ...entry, id: existing.id, updated: true };
        }
    }

    const info = stmts.insert.run({
        query: entry.query,
        resolved_name: entry.resolved_name || null,
        country: entry.country || null,
        latitude: entry.latitude || null,
        longitude: entry.longitude || null,
    });

    // Auto-cleanup: keep only the most recent MAX_RECENT entries
    stmts.cleanup.run(MAX_RECENT);

    return { id: info.lastInsertRowid, ...entry };
}

/**
 * Clear all search history
 * @returns {{ deleted: number }}
 */
function clearAll() {
    const info = stmts.clearAll.run();
    return { deleted: info.changes };
}

module.exports = { getRecent, log, clearAll };
