const apiKey = "be42a05827546c33087e4c81b7abc7a1"; // Replace with your OpenWeatherMap API key

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.getElementById("loading-page").style.display = "none";
  }, 3000);
});

function changeCountry(city) {
  const rightPanel = document.getElementById("right-panel");
  rightPanel.className = "right-panel";
  rightPanel.classList.add(city.toLowerCase().replace(" ", "-"));
  getWeather(city);
  getHourlyForecast(city);
}

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayWeather(data, city);
  } catch (error) {
    alert("Failed to fetch weather data. Please try again.");
  }
}

function displayWeather(data, city) {
  const cityName = document.getElementById("city-name");
  const temperature = document.getElementById("temperature");
  const description = document.getElementById("description");
  const windSpeed = document.getElementById("wind-speed");
  const timezone = document.getElementById("timezone");
  const weatherIcon = document.getElementById("weather-icon");

  const timezoneOffset = data.timezone / 3600;
  const timezoneString = `UTC ${timezoneOffset >= 0 ? "+" : ""}${timezoneOffset}`;

  cityName.textContent = city;
  temperature.textContent = `Temperature: ${data.main.temp} °C`;
  description.textContent = `Weather: ${data.weather[0].description}`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  timezone.textContent = `Timezone: ${timezoneString}`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

async function getHourlyForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayHourlyForecast(data);
  } catch (error) {
    alert("Failed to fetch hourly forecast data. Please try again.");
  }
}

function displayHourlyForecast(data) {
  const forecastContainer = document.getElementById("forecast-container");
  forecastContainer.innerHTML = ""; // Clear previous forecast

  // Display next 5 hours of forecast
  const hourlyData = data.list.slice(0, 5);

  hourlyData.forEach((hour) => {
    const forecastItem = document.createElement("div");
    forecastItem.className = "forecast-item";

    const time = new Date(hour.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const icon = `https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`;
    const temp = `${hour.main.temp}°C`;

    forecastItem.innerHTML = `
      <p>${time}</p>
      <img src="${icon}" alt="${hour.weather[0].description}" />
      <p>${temp}</p>
    `;

    forecastContainer.appendChild(forecastItem);
  });
}
