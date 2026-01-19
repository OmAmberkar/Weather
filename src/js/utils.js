/**
 * Determines the "Vibe" of the weather based on data.
 * Priority: Thunder > Snow > Rain > Mist > Autumn > Summer > Clear
 */
export function determineTheme(data) {
    const main = data.weather[0].main.toLowerCase(); // e.g. "rain", "clouds"
    const id = data.weather[0].id; // Detailed weather code
    const temp = data.main.temp;
    const date = new Date();
    const month = date.getMonth(); // 0-11 (Jan is 0)

    // --- PRIORITY 1: HAZARDOUS WEATHER ---
    // Thunderstorm (IDs 200-232)
    if (id >= 200 && id <= 232) return 'thunderstorm';

    // Snow / Freezing (IDs 600-622 OR Temp below 0°C)
    // We check this BEFORE Autumn so Yakutsk becomes Winter, not Autumn
    if ((id >= 600 && id <= 622) || temp < 0) return 'winter';

    // Rain (IDs 500-531)
    if (id >= 500 && id <= 531) return 'rain';

    // Mist / Fog / Haze (IDs 700-781)
    if (id >= 700 && id <= 781) return 'mist';

    // --- PRIORITY 2: SEASONAL VIBES ---
    // Autumn Logic:
    // 1. It is Sep/Oct/Nov
    // 2. OR It is very windy (> 6 m/s)
    // 3. BUT it must NOT be Raining, Snowing, or Thunderstorming
    const isAutumnMonth = (month >= 8 && month <= 10);
    const isWindy = data.wind.speed > 6;

    // We explicitly block 'rain' and 'snow' and 'thunderstorm' keywords just in case
    if ((isAutumnMonth || isWindy) && !main.includes('rain') && !main.includes('snow') && !main.includes('thunder')) {
        return 'autumn';
    }

    // Summer Logic: Clear sky AND Hot (> 25°C)
    if (main === 'clear' && temp > 25) return 'summer';

    // --- PRIORITY 3: DEFAULTS ---
    // If none of the above, return the standard description (e.g., 'clouds', 'clear')
    return main;
}