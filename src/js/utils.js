export function determineTheme(data) {

    const main = data.weather[0].main.toLowerCase();
    const id = data.weather[0].id;
    const temp = data.main.temp;
    const date = new Date();
    const month = date.getMonth();


    if (id >= 200 && id <= 232) return 'thunderstorm';

    if (id >= 300 && id <= 531) return 'rain';

    if ((id >= 600 && id <= 622) || temp < 0) return 'winter';

    if (temp <= 5) return 'winter';

    if (temp > 22) return 'summer';

    if (id >= 700 && id <= 781) return 'mist';

    const isAutumnMonth = (month >= 8 && month <= 10);
    const isWindy = data.wind.speed > 5.5;

    if (isAutumnMonth || isWindy)  return 'autumn';

    if (main === 'clear') return 'summer';
    if (main === 'clouds') return 'clouds';

    return 'clear';
}