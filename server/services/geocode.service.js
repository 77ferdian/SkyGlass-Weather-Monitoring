const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Search for cities by name using Open-Meteo Geocoding API
 * @param {string} query - City name or zip code
 * @param {number} [count=5] - Max results
 * @returns {Promise<Array>} - Array of matching locations
 */
async function search(query, count = 5) {
    const params = new URLSearchParams({
        name: query,
        count: count.toString(),
        language: 'en',
        format: 'json',
    });

    const res = await fetch(`${GEO_URL}?${params}`);

    if (!res.ok) {
        throw new Error(`Geocoding API error: ${res.status}`);
    }

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
        return [];
    }

    return data.results.map((r) => ({
        name: r.name,
        country: r.country || '',
        countryCode: r.country_code || '',
        latitude: r.latitude,
        longitude: r.longitude,
        timezone: r.timezone || '',
        admin1: r.admin1 || '', // State/Province
        population: r.population || 0,
    }));
}

module.exports = { search };
