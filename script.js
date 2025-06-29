  
    const apiKey = "8949432998a191689c44d732a402da4b";
    const sampleCities = [
      "Mumbai",
      "London", 
      "New York",
      "Tokyo",
      "Paris",
      "Delhi",
    ];

    document.getElementById("cityInput").addEventListener("keypress", function (e) {
      if (e.key === "Enter") getWeather();
    });

    document.getElementById("cityInput").addEventListener("focus", function () {
      if (!this.value) {
        this.placeholder =
          sampleCities[Math.floor(Math.random() * sampleCities.length)];
      }
    });

    async function getWeather() {
      const city = document.getElementById("cityInput").value.trim();
      const resultDiv = document.getElementById("weatherResult");

      if (!city) {
        showResult("Please enter a city name", true);
        return;
      }

      resultDiv.innerHTML =
        '<div class="loading"></div><p style="margin-top: 10px;">Loading weather data...</p>';
      resultDiv.classList.add("show");

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API error");

        const data = await response.json();
        const formattedData = {
          temp: Math.round(data.main.temp),
          desc: data.weather[0].description,
          humidity: data.main.humidity,
          wind: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        };

        showWeatherData(`${data.name}, ${data.sys.country}`, formattedData);
        updateBackground(formattedData);
        
      } catch (error) {
        console.log("API failed, using demo data");
        // Fallback to demo data
        const weatherData = {
          Mumbai: { temp: 32, desc: "partly cloudy", humidity: 78, wind: 12 },
          London: { temp: 18, desc: "overcast", humidity: 65, wind: 8 },
          "New York": { temp: 24, desc: "sunny", humidity: 55, wind: 15 },
          Tokyo: { temp: 28, desc: "light rain", humidity: 82, wind: 6 },
          Paris: { temp: 21, desc: "cloudy", humidity: 60, wind: 10 },
          Delhi: { temp: 35, desc: "clear sky", humidity: 45, wind: 18 },
        };

        const fallback =
          weatherData[city] ||
          weatherData[sampleCities[Math.floor(Math.random() * sampleCities.length)]];
        
        showWeatherData(`${city} (demo)`, fallback);
        updateBackground(fallback);
      }
    }

    function showWeatherData(city, data) {
      const resultDiv = document.getElementById("weatherResult");

      const weatherHTML = `
        <div class="weather-info">
          <h2 style="margin-bottom: 15px; font-size: 1.5rem;">${city}</h2>
          <div class="temperature">🌡 ${data.temp}°C</div>
          <div class="description">🌥 ${data.desc}</div>
          <div class="details">
            <div class="detail-item">
              <div style="font-size: 0.9rem; opacity: 0.8;">💧 Humidity</div>
              <div style="font-weight: bold;">${data.humidity}%</div>
            </div>
            <div class="detail-item">
              <div style="font-size: 0.9rem; opacity: 0.8;">🌬 Wind</div>
              <div style="font-weight: bold;">${data.wind} km/h</div>
            </div>
          </div>
        </div>
      `;

      resultDiv.innerHTML = weatherHTML;
      resultDiv.classList.add("show");
    }

    function showResult(message, isError = false) {
      const resultDiv = document.getElementById("weatherResult");
      const messageClass = isError ? 'class="error-message"' : '';
      resultDiv.innerHTML = `<p ${messageClass}>${message}</p>`;
      resultDiv.classList.add("show");
    }

    function updateBackground(data) {
      // Reset all background classes
      document.body.className = "";
      
      // Apply new background based on weather conditions
      if (data.temp >= 30 || data.desc.toLowerCase().includes("sunny") || data.desc.toLowerCase().includes("clear")) {
        document.body.classList.add("sunny-bg");
      } else if (data.temp <= 10 || data.desc.toLowerCase().includes("snow") || data.desc.toLowerCase().includes("freezing")) {
        document.body.classList.add("snow-bg");
      } else if (data.desc.toLowerCase().includes("rain") || data.desc.toLowerCase().includes("drizzle") || data.desc.toLowerCase().includes("thunderstorm")) {
        document.body.classList.add("rain-bg");
      } else if (data.desc.toLowerCase().includes("cloud") || data.desc.toLowerCase().includes("overcast") || (data.temp > 10 && data.temp < 30)) {
        document.body.classList.add("cloudy-bg");
      }
    }
  