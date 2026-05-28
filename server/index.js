const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Static Files (Frontend) ──────────────────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'public')));

// ─── API Routes ───────────────────────────────────────────────────────
app.use('/api/weather',     require('./routes/weather.routes'));
app.use('/api/geocode',     require('./routes/geocode.routes'));
app.use('/api/cities',      require('./routes/city.routes'));
app.use('/api/searches',    require('./routes/search.routes'));
app.use('/api/preferences', require('./routes/preference.routes'));

// ─── SPA Fallback ─────────────────────────────────────────────────────
// For any non-API route, serve the frontend (Express v5 syntax)
app.get('{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ─── Centralized Error Handler ────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.url}:`, err.message);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
});

// ─── Start Server ─────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n  🌤️  SkyGlass server running at http://localhost:${PORT}\n`);
});

module.exports = app;
