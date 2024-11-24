const apiKey = 'f4a20401f1a5399d5901adc709009341';
const currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const iconLink = "https://openweathermap.org/img/wn/{iconName}@2x.png";

const locationInput = document.getElementById('locationInput');
const checkButton = document.getElementById('checkButton');
const resultsContainer = document.getElementById('weather-results-container');

checkButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        fetchCurrentWeather(location);
        fetchWeatherForecast(location);
    } else {
        resultsContainer.innerHTML = '<p class="error">Please enter a valid location.</p>';
    }
});

// Fetch Current Weather (XMLHttpRequest)
function fetchCurrentWeather(location) {
    const url = `${currentWeatherUrl}?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            displayCurrentWeather(data);
        } else {
            resultsContainer.innerHTML = '<p class="error">Failed to fetch current weather data.</p>';
        }
    };
    xhr.onerror = function () {
        resultsContainer.innerHTML = '<p class="error">An error occurred while fetching current weather data.</p>';
    };
    xhr.send();
    console.log("Current weather request sent.");
}

// Fetch 5-Day Forecast
function fetchWeatherForecast(location) {
    const url = `${forecastUrl}?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch forecast data');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherForecast(data);
        })
        .catch(error => {
            resultsContainer.innerHTML += `<p class="error">${error.message}</p>`;
        });
    console.log("Forecast request sent.");
}

// Display Current Weather
function displayCurrentWeather(data) {
    const { main, weather, name, dt } = data;
    const iconUrl = iconLink.replace('{iconName}', weather[0].icon);
    const date = new Date(dt * 1000);
    const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;

    const currentWeatherHtml = `
        <div class="weather-current">
            <h2>Current Weather in ${name}</h2>
            <p><strong>Date & Time:</strong> ${dateTimeString}</p>
            <img src="${iconUrl}" alt="${weather[0].description}" title="${weather[0].description}" />
            <p><strong>Temperature:</strong> ${main.temp}°C (Feels like: ${main.feels_like}°C)</p>
            <p><strong>Condition:</strong> ${weather[0].description}</p>
        </div>
    `;
    resultsContainer.innerHTML = currentWeatherHtml;
}

// Display 5-Day Forecast (every 3 hours)
function displayWeatherForecast(data) {
    const forecastHtml = data.list
        .slice(0, 40) // Limit to 5 days (maximum 40 entries, as data is available every 3 hours)
        .map((item, index) => {
            const date = new Date(item.dt * 1000);
            const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;
            const iconUrl = iconLink.replace('{iconName}', item.weather[0].icon);

            return `
                <div class="forecast-item">
                    <h3>${dateTimeString}</h3>
                    <img src="${iconUrl}" alt="${item.weather[0].description}" title="${item.weather[0].description}" />
                    <p><strong>Temperature:</strong> ${item.main.temp}°C</p>
                    <p><strong>Condition:</strong> ${item.weather[0].description}</p>
                </div>
            `;
        })
        .join('');
    resultsContainer.innerHTML += `<div class="weather-forecast"><h2>5-Day Forecast (Every 3 Hours)</h2>${forecastHtml}</div>`;
}
