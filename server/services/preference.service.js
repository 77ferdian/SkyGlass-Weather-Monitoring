const db = require('../database');

// ─── Prepared Statements ──────────────────────────────────────────────
const stmts = {
    getAll:  db.prepare('SELECT key, value FROM user_preferences'),
    getByKey: db.prepare('SELECT value FROM user_preferences WHERE key = ?'),
    upsert:  db.prepare(`
        INSERT INTO user_preferences (key, value) VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `),
};

/**
 * Get all preferences as a key-value object
 * @returns {object} - e.g. { unit: 'celsius', theme: 'auto' }
 */
function getAll() {
    const rows = stmts.getAll.all();
    const result = {};
    for (const row of rows) {
        result[row.key] = row.value;
    }
    return result;
}

/**
 * Get a single preference value
 * @param {string} key
 * @returns {string|null}
 */
function get(key) {
    const row = stmts.getByKey.get(key);
    return row ? row.value : null;
}

/**
 * Update (or create) a preference
 * @param {string} key
 * @param {string} value
 * @returns {{ key: string, value: string }}
 */
function update(key, value) {
    stmts.upsert.run(key, value);
    return { key, value };
}

module.exports = { getAll, get, update };
