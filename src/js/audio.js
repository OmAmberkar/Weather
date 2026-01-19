// Map themes to sound files
const SOUND_MAP = {
    'rain': './assets/sounds/rain.mp3',
    'thunderstorm': './assets/sounds/thunder.mp3',
    'mist': './assets/sounds/wind.mp3',
    'autumn': './assets/sounds/wind.mp3',
    'winter': './assets/sounds/wind.mp3',
    'clear': './assets/sounds/birds.mp3', // Optional: nature sounds
    'summer': './assets/sounds/beach.mp3'
};

let currentSound = null;
let currentType = null;

export function playAmbient(theme) {
    // If the theme hasn't changed (e.g. rain -> rain), do nothing
    if (currentType === theme) return;
    currentType = theme;

    const soundFile = SOUND_MAP[theme] || SOUND_MAP['mist']; // Default fallback

    // Fade out old sound
    if (currentSound) {
        const oldSound = currentSound;
        oldSound.fade(0.5, 0, 1500); // 1.5s fade out
        setTimeout(() => oldSound.unload(), 1500);
    }

    // Start new sound
    try {
        currentSound = new Howl({
            src: [soundFile],
            loop: true,
            volume: 0, // Start silent for fade-in
            html5: true // Force HTML5 Audio for large files
        });

        currentSound.play();
        currentSound.fade(0, 0.5, 2000); // 2s fade in
    } catch (e) {
        console.warn("Sound file missing or error", e);
    }
}