/**
 * WMO Weather Interpretation Codes (WW)
 * Maps numeric weather codes to human-readable labels, Material icons, and gradient colors.
 * Reference: https://open-meteo.com/en/docs
 */

const weatherCodes = {
    0:  { label: 'Clear Sky',        icon: 'light_mode',        gradientStart: '#FEF2E2', gradientEnd: '#F5CBA5' },
    1:  { label: 'Mainly Clear',     icon: 'light_mode',        gradientStart: '#FEF2E2', gradientEnd: '#F5CBA5' },
    2:  { label: 'Partly Cloudy',    icon: 'partly_cloudy_day', gradientStart: '#F1F5F9', gradientEnd: '#CBD5E1' },
    3:  { label: 'Overcast',         icon: 'cloud',             gradientStart: '#E2E8F0', gradientEnd: '#94A3B8' },
    45: { label: 'Fog',              icon: 'foggy',             gradientStart: '#F8FAFC', gradientEnd: '#CBD5E1' },
    48: { label: 'Rime Fog',         icon: 'foggy',             gradientStart: '#F8FAFC', gradientEnd: '#CBD5E1' },
    51: { label: 'Light Drizzle',    icon: 'rainy',             gradientStart: '#DBEAFE', gradientEnd: '#93C5FD' },
    53: { label: 'Moderate Drizzle', icon: 'rainy',             gradientStart: '#DBEAFE', gradientEnd: '#93C5FD' },
    55: { label: 'Dense Drizzle',    icon: 'rainy',             gradientStart: '#BFDBFE', gradientEnd: '#60A5FA' },
    56: { label: 'Freezing Drizzle', icon: 'weather_snowy',     gradientStart: '#EFF6FF', gradientEnd: '#93C5FD' },
    57: { label: 'Heavy Freezing Drizzle', icon: 'weather_snowy', gradientStart: '#EFF6FF', gradientEnd: '#93C5FD' },
    61: { label: 'Slight Rain',      icon: 'rainy',             gradientStart: '#DBEAFE', gradientEnd: '#93C5FD' },
    63: { label: 'Moderate Rain',    icon: 'rainy',             gradientStart: '#BFDBFE', gradientEnd: '#60A5FA' },
    65: { label: 'Heavy Rain',       icon: 'rainy',             gradientStart: '#BFDBFE', gradientEnd: '#3B82F6' },
    66: { label: 'Light Freezing Rain', icon: 'weather_snowy',  gradientStart: '#EFF6FF', gradientEnd: '#93C5FD' },
    67: { label: 'Heavy Freezing Rain', icon: 'weather_snowy',  gradientStart: '#EFF6FF', gradientEnd: '#60A5FA' },
    71: { label: 'Slight Snow',      icon: 'weather_snowy',     gradientStart: '#F0F9FF', gradientEnd: '#BAE6FD' },
    73: { label: 'Moderate Snow',    icon: 'weather_snowy',     gradientStart: '#F0F9FF', gradientEnd: '#BAE6FD' },
    75: { label: 'Heavy Snow',       icon: 'weather_snowy',     gradientStart: '#E0F2FE', gradientEnd: '#7DD3FC' },
    77: { label: 'Snow Grains',      icon: 'weather_snowy',     gradientStart: '#F0F9FF', gradientEnd: '#BAE6FD' },
    80: { label: 'Slight Rain Showers', icon: 'rainy',          gradientStart: '#BFDBFE', gradientEnd: '#60A5FA' },
    81: { label: 'Moderate Rain Showers', icon: 'rainy',        gradientStart: '#BFDBFE', gradientEnd: '#3B82F6' },
    82: { label: 'Violent Rain Showers', icon: 'rainy',         gradientStart: '#93C5FD', gradientEnd: '#2563EB' },
    85: { label: 'Slight Snow Showers', icon: 'weather_snowy',  gradientStart: '#EFF6FF', gradientEnd: '#7DD3FC' },
    86: { label: 'Heavy Snow Showers', icon: 'weather_snowy',   gradientStart: '#E0F2FE', gradientEnd: '#38BDF8' },
    95: { label: 'Thunderstorm',     icon: 'thunderstorm',      gradientStart: '#1E293B', gradientEnd: '#334155' },
    96: { label: 'Thunderstorm with Hail', icon: 'thunderstorm', gradientStart: '#0F172A', gradientEnd: '#1E293B' },
    99: { label: 'Thunderstorm with Heavy Hail', icon: 'thunderstorm', gradientStart: '#0F172A', gradientEnd: '#1E293B' },
};

// Default fallback
const defaultWeather = {
    label: 'Unknown',
    icon: 'help',
    gradientStart: '#F1F5F9',
    gradientEnd: '#E2E8F0'
};

/**
 * Map a WMO weather code to UI display properties
 * @param {number} code - WMO weather interpretation code
 * @returns {{ label: string, icon: string, gradientStart: string, gradientEnd: string }}
 */
function mapWeatherCode(code) {
    return weatherCodes[code] || defaultWeather;
}

/**
 * Get the icon color class based on weather code
 * @param {number} code
 * @returns {string} - Tailwind-compatible color hint
 */
function getIconColor(code) {
    if (code <= 1) return '#FACC15';       // sunny yellow
    if (code <= 3) return '#9CA3AF';       // gray
    if (code <= 48) return '#9CA3AF';      // fog gray
    if (code <= 67) return '#3B82F6';      // rain blue
    if (code <= 77) return '#7DD3FC';      // snow light blue
    if (code <= 86) return '#3B82F6';      // shower blue
    return '#6366F1';                       // storm indigo
}

module.exports = { mapWeatherCode, getIconColor };
