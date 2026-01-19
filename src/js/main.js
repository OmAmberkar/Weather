import { fetchWeather } from './api.js';
import { UI } from './ui.js';
import { playAmbient } from './audio.js';

// Optimization: Debounce Function
// Prevents the API from being hit 50 times if you type "New York" fast
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

// Core Application Logic
async function app(city) {
    if (!city) return;

    UI.showLoading();

    try {
        // 1. Get Data
        const data = await fetchWeather(city);

        // 2. Update UI
        UI.render(data);
        UI.updateBackground(data.theme);

        // 3. Play Sound
        playAmbient(data.theme);

    } catch (error) {
        UI.showError("City not found or API error");
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const cityInput = document.getElementById('cityInput');

    // Click Event
    searchBtn.addEventListener('click', () => {
        app(cityInput.value.trim());
    });

    // Enter Key Event
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            app(cityInput.value.trim());
        }
    });

    // Optional: Load a default city on start
    app('Mumbai');
});