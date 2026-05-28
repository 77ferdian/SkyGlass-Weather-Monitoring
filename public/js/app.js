/**
 * SkyGlass Frontend API Client & DOM Controller
 * Connects the glassmorphic UI to the Express backend
 */

// ─── State ────────────────────────────────────────────────────────────
const state = {
    isCelsius: true,
    currentWeather: null,
    currentLocation: null,
    isLoading: false,
};

// ─── API Client ───────────────────────────────────────────────────────
const API = {
    async getWeatherByCity(city) {
        const res = await fetch(`/api/weather/${encodeURIComponent(city)}`);
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Failed to fetch weather');
        }
        return res.json();
    },

    async getWeatherByCoords(lat, lon) {
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Failed to fetch weather');
        }
        return res.json();
    },

    async geocode(query) {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Geocode failed');
        return res.json();
    },

    async getRecentSearches() {
        const res = await fetch('/api/searches');
        if (!res.ok) return { searches: [] };
        return res.json();
    },

    async logSearch(entry) {
        await fetch('/api/searches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
        });
    },

    async getPreferences() {
        const res = await fetch('/api/preferences');
        if (!res.ok) return {};
        return res.json();
    },

    async updatePreference(key, value) {
        await fetch(`/api/preferences/${key}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value }),
        });
    },

    async getSavedCities() {
        const res = await fetch('/api/cities');
        if (!res.ok) return { cities: [] };
        return res.json();
    },

    async saveCity(city) {
        const res = await fetch('/api/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(city),
        });
        return res.json();
    },

    async deleteCity(id) {
        await fetch(`/api/cities/${id}`, { method: 'DELETE' });
    },
};

// ─── DOM References ───────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const els = {
    desktopSearch: $('#desktop-search'),
    mobileSearch: $('#mobile-search'),
    desktopAutocomplete: $('#desktop-autocomplete'),
    mobileAutocomplete: $('#mobile-autocomplete'),
    mainTempVal: $('#main-temp-val'),
    mainTempUnit: $('#main-temp-unit'),
    currentCity: $('#current-city'),
    feelsLikeVal: $('#feels-like-val'),
    feelsLikeUnit: $('#feels-like-unit'),
    weatherIcon: $('#weather-icon'),
    weatherIconSvg: $('#weather-icon-svg'),
    humidity: $('#val-humidity'),
    wind: $('#val-wind'),
    visibility: $('#val-visibility'),
    pressure: $('#val-pressure'),
    dateDisplay: $('#date-display'),
    forecastStrip: $('#forecast-strip'),
    recentSearches: $('#recent-searches'),
    btnDetectLocation: $('#btn-detect-location'),
    tempDisplay: $('#temp-display'),
    mainCard: $('#main-card'),
    locationName: $('#location-name'),
    
    // MSN widgets
    hourlyStrip: $('#hourly-strip'),
    aqiVal: $('#aqi-val'),
    aqiCategory: $('#aqi-category'),
    aqiBar: $('#aqi-bar'),
    pm25Val: $('#pm25-val'),
    pm10Val: $('#pm10-val'),
    uvVal: $('#uv-val'),
    uvCategory: $('#uv-category'),
    uvBar: $('#uv-bar'),
    precipVal: $('#precip-val'),
    sunriseVal: $('#sunrise-val'),
    sunsetVal: $('#sunset-val'),
};

// ─── C → F Conversion ────────────────────────────────────────────────
function cToF(c) {
    return Math.round((c * 9) / 5 + 32);
}

function displayTemp(celsius) {
    return state.isCelsius ? Math.round(celsius) : cToF(celsius);
}

// ─── Animated Number ──────────────────────────────────────────────────
function animateValue(el, start, end, duration = 500) {
    let startTime = null;
    const step = (ts) => {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        el.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

// ─── Render Weather Data ──────────────────────────────────────────────
function renderWeather(data) {
    const { weather, location } = data;
    const { current, daily, hourly } = weather;

    state.currentWeather = weather;
    state.currentLocation = location;

    // Main temperature (animated)
    const targetTemp = displayTemp(current.temp);
    const currentVal = parseInt(els.mainTempVal.textContent) || 0;
    animateValue(els.mainTempVal, currentVal, targetTemp);
    els.mainTempUnit.textContent = state.isCelsius ? '°C' : '°F';

    // City name / condition
    els.currentCity.style.opacity = '0';
    setTimeout(() => {
        els.currentCity.textContent = current.label;
        els.currentCity.style.opacity = '1';
    }, 200);

    // Location name
    if (els.locationName) {
        els.locationName.textContent = location
            ? `${location.name}, ${location.country}`
            : '';
    }

    // Feels like
    els.feelsLikeVal.textContent = displayTemp(current.feelsLike);
    els.feelsLikeUnit.textContent = state.isCelsius ? '°C' : '°F';

    // Date
    const now = new Date();
    els.dateDisplay.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    // Stats
    els.humidity.textContent = `${current.humidity}%`;
    els.wind.textContent = `${Math.round(current.windSpeed)} km/h`;
    els.pressure.textContent = `${current.pressure} hPa`;
    if (els.visibility) {
        els.visibility.textContent = current.visibility;
    }

    // Weather icon (material symbol)
    if (els.weatherIcon) {
        els.weatherIcon.textContent = current.icon;
        els.weatherIcon.style.color = current.iconColor;
    }
    // Hide SVG sun, show material icon
    if (els.weatherIconSvg) els.weatherIconSvg.style.display = 'none';
    if (els.weatherIcon) els.weatherIcon.style.display = 'block';

    // Background gradient
    document.documentElement.style.setProperty('--bg-color-start', current.gradientStart);
    document.documentElement.style.setProperty('--bg-color-end', current.gradientEnd);

    // Render Forecast & Hourly & MSN Widgets
    renderForecast(daily);
    renderHourly(hourly);
    renderMsnWidgets(current);
}

// ─── Render Hourly Forecast ───────────────────────────────────────────
function renderHourly(hourly) {
    if (!els.hourlyStrip) return;

    if (!hourly || hourly.length === 0) {
        els.hourlyStrip.innerHTML = '<div class="px-5 py-3 text-sm text-gray-500">No hourly data available</div>';
        return;
    }

    els.hourlyStrip.innerHTML = hourly
        .map(
            (hour) => `
        <div class="min-w-[90px] flex-1 glass-panel-light rounded-2xl py-5 px-3 flex flex-col items-center gap-2 snap-center hover:bg-white/80 hover:-translate-y-0.5 transition-all duration-300 shadow-sm">
            <span class="text-[10px] font-bold text-gray-400/80">${hour.time}</span>
            <span class="material-symbols-outlined text-[26px]" style="color: ${hour.iconColor}">${hour.icon}</span>
            <span class="font-bold text-sm text-brand-dark">${displayTemp(hour.temp)}°</span>
            <div class="flex items-center gap-0.5 mt-0.5 text-[9px] font-bold text-blue-500/80">
                <span class="material-symbols-outlined text-[11px] fill-1">water_drop</span>
                <span>${hour.precipProb}%</span>
            </div>
        </div>
    `
        )
        .join('');
}

// ─── Render MSN Widgets ───────────────────────────────────────────────
function renderMsnWidgets(current) {
    if (els.aqiVal) els.aqiVal.textContent = current.aqi !== null ? current.aqi : '--';
    if (els.aqiCategory) {
        els.aqiCategory.textContent = current.aqiCategory || 'Unknown';
        els.aqiCategory.className = 'font-body-md text-xs font-semibold';
        const colorClassMap = {
            'text-green-500': 'text-green-500',
            'text-yellow-500': 'text-yellow-500',
            'text-orange-500': 'text-orange-500',
            'text-red-500': 'text-red-500',
            'text-purple-500': 'text-purple-500',
            'text-red-900': 'text-red-900',
        };
        const activeColorClass = colorClassMap[current.aqiColor] || 'text-gray-400';
        els.aqiCategory.classList.add(activeColorClass);
    }
    if (els.aqiBar) {
        if (current.aqi !== null) {
            const percent = Math.min(100, (current.aqi / 300) * 100);
            els.aqiBar.style.width = `${percent}%`;
            els.aqiBar.className = 'h-full rounded-full transition-all duration-500';
            if (current.aqi <= 50) els.aqiBar.classList.add('bg-green-500');
            else if (current.aqi <= 100) els.aqiBar.classList.add('bg-yellow-500');
            else if (current.aqi <= 150) els.aqiBar.classList.add('bg-orange-500');
            else if (current.aqi <= 200) els.aqiBar.classList.add('bg-red-500');
            else els.aqiBar.classList.add('bg-purple-500');
        } else {
            els.aqiBar.style.width = '0%';
        }
    }
    if (els.pm25Val) els.pm25Val.textContent = current.pm2_5 !== null ? Math.round(current.pm2_5) : '--';
    if (els.pm10Val) els.pm10Val.textContent = current.pm10 !== null ? Math.round(current.pm10) : '--';

    if (els.uvVal) els.uvVal.textContent = current.uvIndex !== null ? Math.round(current.uvIndex) : '--';
    if (els.uvCategory) {
        els.uvCategory.textContent = current.uvCategory || 'Low';
        els.uvCategory.className = 'font-body-md text-xs font-semibold';
        const colorClassMap = {
            'text-green-500': 'text-green-500',
            'text-yellow-500': 'text-yellow-500',
            'text-orange-500': 'text-orange-500',
            'text-red-500': 'text-red-500',
            'text-purple-500': 'text-purple-500',
        };
        const activeColorClass = colorClassMap[current.uvColor] || 'text-gray-400';
        els.uvCategory.classList.add(activeColorClass);
    }
    if (els.uvBar) {
        if (current.uvIndex !== null) {
            const percent = Math.min(100, (current.uvIndex / 12) * 100);
            els.uvBar.style.width = `${percent}%`;
            els.uvBar.className = 'h-full rounded-full transition-all duration-500';
            if (current.uvIndex <= 2) els.uvBar.classList.add('bg-green-500');
            else if (current.uvIndex <= 5) els.uvBar.classList.add('bg-yellow-500');
            else if (current.uvIndex <= 7) els.uvBar.classList.add('bg-orange-500');
            else if (current.uvIndex <= 10) els.uvBar.classList.add('bg-red-500');
            else els.uvBar.classList.add('bg-purple-500');
        } else {
            els.uvBar.style.width = '0%';
        }
    }
    if (els.precipVal) els.precipVal.textContent = `${current.precipProb}%`;

    if (els.sunriseVal) els.sunriseVal.textContent = current.sunrise;
    if (els.sunsetVal) els.sunsetVal.textContent = current.sunset;
}

// ─── Render Forecast Strip ────────────────────────────────────────────
function renderForecast(daily) {
    if (!els.forecastStrip) return;

    els.forecastStrip.innerHTML = daily
        .map(
            (day) => `
        <div class="min-w-[140px] flex-1 glass-panel-light rounded-2xl py-6 px-4 flex flex-col items-center gap-3 snap-center hover:bg-white/80 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
            <span class="font-medium text-brand-dark">${day.dayName}</span>
            <span class="material-symbols-outlined text-[32px]" style="color: ${day.iconColor}">${day.icon}</span>
            <div class="flex gap-2 items-baseline mt-1">
                <span class="font-bold text-lg text-brand-dark">${displayTemp(day.tempMax)}°</span>
                <span class="font-medium text-gray-400 text-sm">${displayTemp(day.tempMin)}°</span>
            </div>
        </div>
    `
        )
        .join('');
}

// ─── Render Recent Searches ───────────────────────────────────────────
async function renderRecentSearches() {
    if (!els.recentSearches) return;

    const { searches } = await API.getRecentSearches();

    if (searches.length === 0) {
        els.recentSearches.innerHTML = '';
        return;
    }

    els.recentSearches.innerHTML = searches
        .slice(0, 5)
        .map(
            (s) => `
        <div class="recent-search-badge glass-panel-light rounded-full px-6 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-white/90 hover:scale-105 transition-all duration-200"
             data-lat="${s.latitude}" data-lon="${s.longitude}" data-name="${s.resolved_name || s.query}" data-country="${s.country || ''}">
            <span class="material-symbols-outlined text-[18px] text-gray-500">history</span>
            <span class="font-medium text-sm text-brand-dark">${s.resolved_name || s.query}</span>
        </div>
    `
        )
        .join('');

    // Bind click events
    els.recentSearches.querySelectorAll('.recent-search-badge').forEach((badge) => {
        badge.addEventListener('click', async () => {
            const lat = parseFloat(badge.dataset.lat);
            const lon = parseFloat(badge.dataset.lon);
            const name = badge.dataset.name;

            if (!isNaN(lat) && !isNaN(lon)) {
                await fetchWeatherByCoords(lat, lon, name, badge.dataset.country);
            } else {
                await fetchWeatherByCity(name);
            }
        });
    });
}

// ─── Loading State ────────────────────────────────────────────────────
function setLoading(loading) {
    state.isLoading = loading;
    if (els.mainCard) {
        if (loading) {
            els.mainCard.classList.add('opacity-60');
            els.mainCard.style.pointerEvents = 'none';
        } else {
            els.mainCard.classList.remove('opacity-60');
            els.mainCard.style.pointerEvents = '';
        }
    }
}

// ─── Error Display ────────────────────────────────────────────────────
function showError(input, message) {
    // Shake animation
    input.classList.remove('search-error');
    void input.offsetWidth;
    input.classList.add('search-error');

    // Show temporary error text
    const currentCity = els.currentCity;
    const originalText = currentCity.textContent;
    currentCity.textContent = message;
    currentCity.style.color = '#EF4444';
    setTimeout(() => {
        currentCity.textContent = originalText;
        currentCity.style.color = '';
        input.classList.remove('search-error');
    }, 2500);
}

// ─── Fetch Weather (by city name) ─────────────────────────────────────
async function fetchWeatherByCity(city) {
    if (state.isLoading) return;
    setLoading(true);

    try {
        const data = await API.getWeatherByCity(city);
        renderWeather(data);

        // Log the search
        if (data.location) {
            await API.logSearch({
                query: city,
                resolved_name: data.location.name,
                country: data.location.country,
                latitude: data.location.latitude,
                longitude: data.location.longitude,
            });
            await renderRecentSearches();
        }
    } catch (err) {
        const input = els.desktopSearch || els.mobileSearch;
        showError(input, err.message || 'City not found');
    } finally {
        setLoading(false);
    }
}

// ─── Fetch Weather (by coordinates) ───────────────────────────────────
async function fetchWeatherByCoords(lat, lon, name, country) {
    if (state.isLoading) return;
    setLoading(true);

    try {
        const weather = await API.getWeatherByCoords(lat, lon);
        renderWeather({
            weather,
            location: { name: name || 'Current Location', country: country || '', latitude: lat, longitude: lon },
        });

        if (name) {
            await API.logSearch({
                query: name,
                resolved_name: name,
                country: country || '',
                latitude: lat,
                longitude: lon,
            });
            await renderRecentSearches();
        }
    } catch (err) {
        console.error('Weather fetch error:', err);
    } finally {
        setLoading(false);
    }
}

// ─── Search Handler ───────────────────────────────────────────────────
function handleSearch(e) {
    if (e.key === 'Enter') {
        const input = e.target;
        const query = input.value.trim();

        if (!query) {
            showError(input, 'Please enter a city name');
            return;
        }

        if (els.desktopAutocomplete) els.desktopAutocomplete.classList.add('hidden');
        if (els.mobileAutocomplete) els.mobileAutocomplete.classList.add('hidden');

        fetchWeatherByCity(query);
        input.value = '';
    }
}

// ─── Debounce Helper ──────────────────────────────────────────────────
function debounce(func, delay = 300) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

// ─── Autocomplete Input Handler ───────────────────────────────────────
async function handleAutocompleteInput(e, autocompleteEl) {
    const input = e.target;
    const query = input.value.trim();

    if (query.length < 2) {
        autocompleteEl.innerHTML = '';
        autocompleteEl.classList.add('hidden');
        return;
    }

    try {
        const data = await API.geocode(query);
        const results = data.results || [];

        if (results.length === 0) {
            autocompleteEl.innerHTML = '<div class="px-5 py-3 text-sm text-gray-500">No matches found</div>';
            autocompleteEl.classList.remove('hidden');
            return;
        }

        autocompleteEl.innerHTML = results
            .map(
                (item) => `
            <div class="autocomplete-item px-5 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between border-b border-gray-100/50 last:border-0 transition-colors"
                 data-lat="${item.latitude}" 
                 data-lon="${item.longitude}" 
                 data-name="${item.name}" 
                 data-country="${item.country}"
                 data-admin1="${item.admin1 || ''}">
                <div class="flex flex-col">
                    <span class="font-medium text-sm text-brand-dark">${item.name}</span>
                    <span class="text-xs text-gray-400">${item.admin1 ? item.admin1 + ', ' : ''}${item.country}</span>
                </div>
                ${item.countryCode ? `<img src="https://flagcdn.com/16x12/${item.countryCode.toLowerCase()}.png" alt="${item.countryCode}" class="w-4 h-3 rounded-sm opacity-80" onerror="this.style.display='none'">` : ''}
            </div>
        `
            )
            .join('');

        autocompleteEl.classList.remove('hidden');

        // Bind click events
        autocompleteEl.querySelectorAll('.autocomplete-item').forEach((itemEl) => {
            itemEl.addEventListener('click', async () => {
                const lat = parseFloat(itemEl.dataset.lat);
                const lon = parseFloat(itemEl.dataset.lon);
                const name = itemEl.dataset.name;
                const country = itemEl.dataset.country;

                input.value = name;
                autocompleteEl.classList.add('hidden');

                if (!isNaN(lat) && !isNaN(lon)) {
                    await fetchWeatherByCoords(lat, lon, name, country);
                } else {
                    await fetchWeatherByCity(name);
                }
            });
        });
    } catch (err) {
        console.error('Autocomplete error:', err);
    }
}

// ─── Geolocation Handler ─────────────────────────────────────────────
function handleGeolocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    const btn = els.btnDetectLocation;
    btn.classList.add('is-loading');

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                // Reverse geocode to get city name
                const geoData = await API.getWeatherByCoords(latitude, longitude);
                renderWeather({
                    weather: geoData,
                    location: {
                        name: 'Current Location',
                        country: '',
                        latitude,
                        longitude,
                    },
                });
            } catch (err) {
                console.error('Geolocation weather error:', err);
            } finally {
                btn.classList.remove('is-loading');
            }
        },
        (error) => {
            btn.classList.remove('is-loading');
            console.error('Geolocation error:', error.message);
            alert('Unable to detect your location. Please allow location access.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

// ─── C/F Toggle Handler ──────────────────────────────────────────────
function handleTempToggle() {
    state.isCelsius = !state.isCelsius;

    // Save preference
    API.updatePreference('unit', state.isCelsius ? 'celsius' : 'fahrenheit');

    if (state.currentWeather) {
        const { current, daily, hourly } = state.currentWeather;

        // Animate main temp
        const targetTemp = displayTemp(current.temp);
        const currentVal = parseInt(els.mainTempVal.textContent) || 0;
        animateValue(els.mainTempVal, currentVal, targetTemp);
        els.mainTempUnit.textContent = state.isCelsius ? '°C' : '°F';

        // Feels like
        els.feelsLikeVal.textContent = displayTemp(current.feelsLike);
        els.feelsLikeUnit.textContent = state.isCelsius ? '°C' : '°F';

        // Re-render forecast and hourly
        renderForecast(daily);
        renderHourly(hourly);
    }
}

// ─── Init ─────────────────────────────────────────────────────────────
async function init() {
    // Load preferences
    try {
        const prefs = await API.getPreferences();
        if (prefs.unit === 'fahrenheit') {
            state.isCelsius = false;
        }
    } catch (e) {
        // ignore, use default
    }

    // Bind events
    if (els.desktopSearch) els.desktopSearch.addEventListener('keypress', handleSearch);
    if (els.mobileSearch) els.mobileSearch.addEventListener('keypress', handleSearch);
    if (els.btnDetectLocation) els.btnDetectLocation.addEventListener('click', handleGeolocation);
    if (els.tempDisplay) els.tempDisplay.addEventListener('click', handleTempToggle);

    // Bind autocomplete
    const debouncedDesktop = debounce((e) => handleAutocompleteInput(e, els.desktopAutocomplete), 300);
    const debouncedMobile = debounce((e) => handleAutocompleteInput(e, els.mobileAutocomplete), 300);

    if (els.desktopSearch) {
        els.desktopSearch.addEventListener('input', debouncedDesktop);
        els.desktopSearch.addEventListener('focus', (e) => {
            if (e.target.value.trim().length >= 2) {
                els.desktopAutocomplete.classList.remove('hidden');
            }
        });
    }
    if (els.mobileSearch) {
        els.mobileSearch.addEventListener('input', debouncedMobile);
        els.mobileSearch.addEventListener('focus', (e) => {
            if (e.target.value.trim().length >= 2) {
                els.mobileAutocomplete.classList.remove('hidden');
            }
        });
    }

    // Hide autocomplete on click outside
    document.addEventListener('click', (e) => {
        if (els.desktopAutocomplete && !els.desktopSearch.contains(e.target) && !els.desktopAutocomplete.contains(e.target)) {
            els.desktopAutocomplete.classList.add('hidden');
        }
        if (els.mobileAutocomplete && !els.mobileSearch.contains(e.target) && !els.mobileAutocomplete.contains(e.target)) {
            els.mobileAutocomplete.classList.add('hidden');
        }
    });

    // Load recent searches
    await renderRecentSearches();

    // Load default city weather (Jakarta as default)
    await fetchWeatherByCity('Jakarta');
}

// ─── Start ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
