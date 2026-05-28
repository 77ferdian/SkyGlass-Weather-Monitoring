const db = require('../database');

// ─── Prepared Statements ──────────────────────────────────────────────
const stmts = {
    getAll:    db.prepare('SELECT * FROM saved_cities ORDER BY display_order ASC, created_at DESC'),
    getById:   db.prepare('SELECT * FROM saved_cities WHERE id = ?'),
    findDupe:  db.prepare('SELECT * FROM saved_cities WHERE latitude = ? AND longitude = ?'),
    insert:    db.prepare(`
        INSERT INTO saved_cities (name, country, latitude, longitude, timezone, display_order)
        VALUES (@name, @country, @latitude, @longitude, @timezone, @display_order)
    `),
    delete:    db.prepare('DELETE FROM saved_cities WHERE id = ?'),
    updateOrder: db.prepare('UPDATE saved_cities SET display_order = ? WHERE id = ?'),
};

/**
 * Get all saved cities
 * @returns {Array}
 */
function getAll() {
    return stmts.getAll.all();
}

/**
 * Get a saved city by ID
 * @param {number} id
 * @returns {object|undefined}
 */
function getById(id) {
    return stmts.getById.get(id);
}

/**
 * Save a new city (prevents duplicates by lat/lon)
 * @param {{ name: string, country: string, latitude: number, longitude: number, timezone?: string }} city
 * @returns {object} - The created city
 */
function create(city) {
    // Check for duplicate
    const existing = stmts.findDupe.get(city.latitude, city.longitude);
    if (existing) {
        return existing;
    }

    const maxOrder = db.prepare('SELECT COALESCE(MAX(display_order), 0) AS max_order FROM saved_cities').get();

    const info = stmts.insert.run({
        name: city.name,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone || null,
        display_order: maxOrder.max_order + 1,
    });

    return stmts.getById.get(info.lastInsertRowid);
}

/**
 * Delete a saved city by ID
 * @param {number} id
 * @returns {boolean} - True if deleted
 */
function remove(id) {
    const info = stmts.delete.run(id);
    return info.changes > 0;
}

/**
 * Update display order for a city
 * @param {number} id
 * @param {number} order
 * @returns {boolean}
 */
function updateOrder(id, order) {
    const info = stmts.updateOrder.run(order, id);
    return info.changes > 0;
}

module.exports = { getAll, getById, create, remove, updateOrder };
