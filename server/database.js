const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'skyglass.db');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Schema Migration ────────────────────────────────────────────────
db.exec(`
    -- Bookmarked/saved cities
    CREATE TABLE IF NOT EXISTS saved_cities (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        name          TEXT    NOT NULL,
        country       TEXT    NOT NULL,
        latitude      REAL    NOT NULL,
        longitude     REAL    NOT NULL,
        timezone      TEXT,
        display_order INTEGER DEFAULT 0,
        created_at    TEXT    DEFAULT CURRENT_TIMESTAMP
    );

    -- Recent search history (max 10, auto-cleanup via service)
    CREATE TABLE IF NOT EXISTS recent_searches (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        query          TEXT    NOT NULL,
        resolved_name  TEXT,
        country        TEXT,
        latitude       REAL,
        longitude      REAL,
        searched_at    TEXT    DEFAULT CURRENT_TIMESTAMP
    );

    -- User preferences (unit, theme, etc.)
    CREATE TABLE IF NOT EXISTS user_preferences (
        id    INTEGER PRIMARY KEY AUTOINCREMENT,
        key   TEXT    UNIQUE NOT NULL,
        value TEXT    NOT NULL
    );

    -- Default preferences
    INSERT OR IGNORE INTO user_preferences (key, value) VALUES ('unit', 'celsius');
    INSERT OR IGNORE INTO user_preferences (key, value) VALUES ('theme', 'auto');
`);

module.exports = db;
