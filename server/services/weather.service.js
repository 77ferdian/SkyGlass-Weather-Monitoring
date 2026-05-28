const { mapWeatherCode, getIconColor } = require('../utils/weatherCodes');

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Fetch current weather + 5-day forecast from Open-Meteo
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<object>} - Transformed weather data
 */
/**
 * Helpers for timezone-safe time formatting from Open-Meteo ISO strings
 */
function formatHourString(isoTime, isFirst) {
    if (isFirst) return 'Now';
    const parts = isoTime.split('T');
    if (parts.length < 2) return '--';
    const hourVal = parseInt(parts[1].split(':')[0]);
    const ampm = hourVal >= 12 ? 'PM' : 'AM';
    const displayHour = hourVal % 12 === 0 ? 12 : hourVal % 12;
    return `${displayHour} ${ampm}`;
}

function formatTimeOnly(isoTime) {
    if (!isoTime) return '--';
    const parts = isoTime.split('T');
    if (parts.length < 2) return '--';
    const timeParts = parts[1].split(':');
    const hourVal = parseInt(timeParts[0]);
    const minuteStr = timeParts[1];
    const ampm = hourVal >= 12 ? 'PM' : 'AM';
    const displayHour = hourVal % 12 === 0 ? 12 : hourVal % 12;
    return `${displayHour}:${minuteStr} ${ampm}`;
}

/**
 * Fetch current weather + hourly/daily forecast + AQI from Open-Meteo
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<object>} - Transformed weather data
 */
async function getWeather(lat, lon) {
    const weatherParams = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'weather_code',
            'wind_speed_10m',
            'surface_pressure',
        ].join(','),
        hourly: [
            'temperature_2m',
            'weather_code',
            'precipitation_probability',
            'visibility'
        ].join(','),
        daily: [
            'weather_code',
            'temperature_2m_max',
            'temperature_2m_min',
            'uv_index_max',
            'sunrise',
            'sunset',
            'precipitation_probability_max'
        ].join(','),
        timezone: 'auto',
        forecast_days: '5',
    });

    const aqiParams = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'european_aqi,us_aqi,pm2_5,pm10',
    });

    const [weatherRes, aqiRes] = await Promise.all([
        fetch(`${BASE_URL}?${weatherParams}`),
        fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${aqiParams}`).catch(() => null)
    ]);

    if (!weatherRes.ok) {
        const err = await weatherRes.json().catch(() => ({}));
        throw new Error(err.reason || `Open-Meteo API error: ${weatherRes.status}`);
    }

    const weatherData = await weatherRes.json();
    const aqiData = aqiRes && aqiRes.ok ? await aqiRes.json() : null;

    const currentCode = weatherData.current.weather_code;
    const weatherInfo = mapWeatherCode(currentCode);

    // Calculate current hour index in hourly arrays
    const nowHour = new Date().toISOString().substring(0, 13) + ':00';
    let startIndex = weatherData.hourly.time.findIndex(t => t.startsWith(nowHour));
    if (startIndex === -1) {
        // Fallback: search closest matching hour
        const nowObj = new Date();
        const nowMinutes = nowObj.getMinutes();
        const roundedHour = new Date(nowObj);
        roundedHour.setMinutes(0, 0, 0);
        const roundedIso = roundedHour.toISOString().substring(0, 13) + ':00';
        startIndex = weatherData.hourly.time.findIndex(t => t.startsWith(roundedIso));
    }
    if (startIndex === -1) startIndex = 0;

    // Map 24 hours starting from current hour
    const hourlyList = [];
    for (let i = startIndex; i < startIndex + 24 && i < weatherData.hourly.time.length; i++) {
        const time = weatherData.hourly.time[i];
        const temp = weatherData.hourly.temperature_2m[i];
        const code = weatherData.hourly.weather_code[i];
        const precipProb = weatherData.hourly.precipitation_probability[i];
        const info = mapWeatherCode(code);

        hourlyList.push({
            time: formatHourString(time, i === startIndex),
            temp,
            weatherCode: code,
            label: info.label,
            icon: info.icon,
            iconColor: getIconColor(code),
            precipProb,
        });
    }

    // Current visibility in km
    let currentVisibility = '--';
    if (weatherData.hourly && weatherData.hourly.visibility && weatherData.hourly.visibility[startIndex] !== undefined) {
        currentVisibility = `${(weatherData.hourly.visibility[startIndex] / 1000).toFixed(1)} km`;
    }

    // AQI info
    const currentAqi = aqiData && aqiData.current ? aqiData.current.us_aqi : null;
    const currentPm2_5 = aqiData && aqiData.current ? aqiData.current.pm2_5 : null;
    const currentPm10 = aqiData && aqiData.current ? aqiData.current.pm10 : null;

    let aqiCategory = 'Unknown';
    let aqiColor = 'text-gray-400';
    if (currentAqi !== null) {
        if (currentAqi <= 50) {
            aqiCategory = 'Good';
            aqiColor = 'text-green-500';
        } else if (currentAqi <= 100) {
            aqiCategory = 'Moderate';
            aqiColor = 'text-yellow-500';
        } else if (currentAqi <= 150) {
            aqiCategory = 'Unhealthy for Sensitive Groups';
            aqiColor = 'text-orange-500';
        } else if (currentAqi <= 200) {
            aqiCategory = 'Unhealthy';
            aqiColor = 'text-red-500';
        } else if (currentAqi <= 300) {
            aqiCategory = 'Very Unhealthy';
            aqiColor = 'text-purple-500';
        } else {
            aqiCategory = 'Hazardous';
            aqiColor = 'text-red-900';
        }
    }

    // UV Index info
    const todayUv = weatherData.daily.uv_index_max ? weatherData.daily.uv_index_max[0] : 0;
    let uvCategory = 'Low';
    let uvColor = 'text-green-500';
    if (todayUv >= 11) {
        uvCategory = 'Extreme';
        uvColor = 'text-purple-500';
    } else if (todayUv >= 8) {
        uvCategory = 'Very High';
        uvColor = 'text-red-500';
    } else if (todayUv >= 6) {
        uvCategory = 'High';
        uvColor = 'text-orange-500';
    } else if (todayUv >= 3) {
        uvCategory = 'Moderate';
        uvColor = 'text-yellow-500';
    }

    return {
        current: {
            temp: weatherData.current.temperature_2m,
            feelsLike: weatherData.current.apparent_temperature,
            humidity: weatherData.current.relative_humidity_2m,
            windSpeed: weatherData.current.wind_speed_10m,
            pressure: Math.round(weatherData.current.surface_pressure),
            weatherCode: currentCode,
            label: weatherInfo.label,
            icon: weatherInfo.icon,
            iconColor: getIconColor(currentCode),
            gradientStart: weatherInfo.gradientStart,
            gradientEnd: weatherInfo.gradientEnd,
            visibility: currentVisibility,
            aqi: currentAqi,
            aqiCategory,
            aqiColor,
            pm2_5: currentPm2_5,
            pm10: currentPm10,
            uvIndex: todayUv,
            uvCategory,
            uvColor,
            sunrise: weatherData.daily.sunrise ? formatTimeOnly(weatherData.daily.sunrise[0]) : '--',
            sunset: weatherData.daily.sunset ? formatTimeOnly(weatherData.daily.sunset[0]) : '--',
            precipProb: weatherData.daily.precipitation_probability_max ? weatherData.daily.precipitation_probability_max[0] : 0,
        },
        hourly: hourlyList,
        daily: weatherData.daily.time.map((date, i) => {
            const code = weatherData.daily.weather_code[i];
            const info = mapWeatherCode(code);
            return {
                date,
                dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                tempMax: weatherData.daily.temperature_2m_max[i],
                tempMin: weatherData.daily.temperature_2m_min[i],
                weatherCode: code,
                label: info.label,
                icon: info.icon,
                iconColor: getIconColor(code),
                uvIndexMax: weatherData.daily.uv_index_max[i],
                sunrise: weatherData.daily.sunrise ? formatTimeOnly(weatherData.daily.sunrise[i]) : '--',
                sunset: weatherData.daily.sunset ? formatTimeOnly(weatherData.daily.sunset[i]) : '--',
                precipProbMax: weatherData.daily.precipitation_probability_max[i],
            };
        }),
        timezone: weatherData.timezone,
        units: weatherData.current_units,
    };
}

module.exports = { getWeather };
