const weatherCodes = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Depositing rime fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Dense drizzle",
  61: "Slight rain", 63: "Rain", 65: "Heavy rain",
  71: "Slight snow", 73: "Snow", 75: "Heavy snow",
  80: "Rain showers", 81: "Rain showers", 82: "Violent rain showers",
  95: "Thunderstorm", 96: "Thunderstorm w/ hail", 99: "Thunderstorm w/ heavy hail"
};

function setStatus(msg) {
  document.getElementById("status").innerText = msg;
}

async function fetchWeather(lat, lon, label) {
  setStatus("Loading weather...");
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`;
    const res = await fetch(url);
    const data = await res.json();
    const c = data.current;

    document.getElementById("city").innerText = label;
    document.getElementById("temp").innerText = `${Math.round(c.temperature_2m)}°C`;
    document.getElementById("desc").innerText = weatherCodes[c.weather_code] || "Unknown";
    document.getElementById("feels").innerText = `${Math.round(c.apparent_temperature)}°C`;
    document.getElementById("humidity").innerText = `${c.relative_humidity_2m}%`;
    document.getElementById("wind").innerText = `${c.wind_speed_10m} km/h`;
    setStatus("");
  } catch (err) {
    setStatus("Failed to fetch weather. Try again.");
  }
}

async function searchCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return setStatus("Enter a city name.");
  setStatus("Finding city...");
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      return setStatus("City not found.");
    }
    const { latitude, longitude, name, country } = geoData.results[0];
    fetchWeather(latitude, longitude, `${name}, ${country}`);
  } catch (err) {
    setStatus("Search failed. Try again.");
  }
}

function useMyLocation() {
  if (!navigator.geolocation) {
    return setStatus("Geolocation not supported.");
  }
  setStatus("Getting your location...");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      fetchWeather(latitude, longitude, "Your Location");
    },
    () => setStatus("Location access denied.")
  );
}

// Default: Hyderabad on load
fetchWeather(17.385, 78.4867, "Hyderabad, IN");
