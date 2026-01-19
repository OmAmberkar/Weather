import { CONFIG } from './config.js';

const elements = {
    card: document.getElementById('weatherResult'),
    cityInput: document.getElementById('cityInput'),
    bgVideo: document.getElementById('bg-video'),
    overlay: document.querySelector('.overlay')
};

export const UI = {
    // 1. Render the Weather Card
    render(data) {
        // Unhide the card
        elements.card.classList.remove('hidden');

        // Inject HTML
        elements.card.innerHTML = `
            <div class="weather-info">
                <h2 class="city-name">${data.city}, <span class="country">${data.country}</span></h2>

                <div class="main-temp">
                    <span class="temp-value">0</span><span class="unit">°C</span>
                </div>

                <div class="condition">${data.description}</div>

                <div class="details-grid">
                    <div class="detail-item">
                        <span class="label">Humidity</span>
                        <span class="value">${data.humidity}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Wind</span>
                        <span class="value">${data.wind} km/h</span>
                    </div>
                </div>
            </div>
        `;

        this.animateEntry(data.temp);
    },

    // 2. GSAP Animations (The "Cool" Part)
    animateEntry(finalTemp) {
        // A. Slide the card up
        gsap.fromTo(elements.card,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );

        // B. Stagger the text elements inside
        gsap.from(".weather-info > *", {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.2
        });

        // C. Animate the Number counting up (0 -> 25)
        const tempObj = { val: 0 };
        gsap.to(tempObj, {
            val: finalTemp,
            duration: 1.5,
            ease: "power1.out",
            onUpdate: () => {
                const el = document.querySelector('.temp-value');
                if(el) el.innerText = Math.round(tempObj.val);
            }
        });
    },

    // 3. Video Background Switcher
    updateBackground(theme) {
        const videoName = `${theme}.mp4`; // e.g., 'rain.mp4'
        const newSource = `${CONFIG.ASSETS.VIDEO_PATH}${videoName}`;

        // Prevent reloading the same video
        if (elements.bgVideo.getAttribute('src') === newSource) return;

        // Fade out -> Swap -> Fade in
        gsap.to(elements.bgVideo, { opacity: 0, duration: 0.5, onComplete: () => {
            elements.bgVideo.src = newSource;
            elements.bgVideo.load();
            elements.bgVideo.play().catch(e => console.log("Autoplay blocked", e));

            gsap.to(elements.bgVideo, { opacity: 1, duration: 1 });
        }});
    },

    // 4. Loading State
    showLoading() {
        elements.card.classList.remove('hidden');
        elements.card.innerHTML = `<div class="loading-spinner"></div>`;
    },

    showError(message) {
        elements.card.classList.remove('hidden');
        elements.card.innerHTML = `<div class="error-msg">⚠️ ${message}</div>`;
        gsap.fromTo(".error-msg", { x: -10 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true });
    }
};