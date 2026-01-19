import { CONFIG } from './config.js';
import { determineTheme } from './utils.js';

export async function fetchWeather(city) {
    try {
        const url = `${CONFIG.API_BASE_URL}?q=${city}&appid=${CONFIG.API_KEY}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`City not found (${response.status})`);

        const data = await response.json();

        // Process and clean the data immediately
        return {
            city: data.name,
            country: data.sys.country,
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main, // "Rain", "Clouds"
            description: data.weather[0].description, // "light rain"
            humidity: data.main.humidity,
            wind: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
            pressure: data.main.pressure,
            theme: determineTheme(data) // Calculated theme (e.g., 'autumn')
        };
    } catch (error) {
        console.error("API Error:", error);
        throw error; // Pass error to UI to handle
    }
}