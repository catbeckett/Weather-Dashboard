const apiKey = '36f0cbd6e9a722edf8afd95a5a140306';

// Function to build a query URL for location name and get coordinates
function getLocationCoordinates(city) {
    const locationURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
    return fetch(locationURL)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const coordinates = {
                    lat: data[0].lat,
                    lon: data[0].lon
                };
                return coordinates;
            } else {
                throw new Error('Location data not found');
            }
        })
        .catch(error => {
            console.error('Error fetching location coordinates:', error);
            throw error;
        });
}

// Function to build a query URL for weather data and get current data
function getCurrentWeather(coordinates) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`;
    return fetch(weatherURL)
        .then(response => response.json());
}

// Function to build an element for current weather data
function createCurrentElement(weatherData) {
    const currentElement = document.createElement('div');
    currentElement.setAttribute('id', 'current-data');

    const cityNameElement = document.createElement('h1');
    cityNameElement.innerText = weatherData.name;
    currentElement.appendChild(cityNameElement);

    const dateElement = document.createElement('p');
    dateElement.innerText = new Date().toLocaleDateString();
    currentElement.appendChild(dateElement);

    const iconElement = document.createElement('img');
    iconElement.setAttribute('src', `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`);
    currentElement.appendChild(iconElement);

    const tempElement = document.createElement('p');
    const tempInCelsius = (weatherData.main.temp - 273.15).toFixed(2);
    tempElement.innerText = `Temperature: ${tempInCelsius}°C`;
    currentElement.appendChild(tempElement);

    const humidityElement = document.createElement('p');
    humidityElement.innerText = `Humidity: ${weatherData.main.humidity}%`;
    currentElement.appendChild(humidityElement);

    const windspeedElement = document.createElement('p');
    windspeedElement.innerText = `Wind Speed: ${weatherData.wind.speed} km/h`;
    currentElement.appendChild(windspeedElement);

    const containerElement = document.getElementById('today');
    containerElement.innerHTML = ''; // Clear existing content
    containerElement.appendChild(currentElement);
}

// Function to build elements for 5-day forecast
function createForecastElements(forecastData) {
    const forecastElement = document.getElementById('forecast');
    forecastElement.innerHTML = ''; // Clear existing content

    forecastData.list.slice(0, 5).forEach(day => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        const dateElement = document.createElement('p');
        dateElement.innerText = new Date(day.dt * 1000).toLocaleDateString();
        cardElement.appendChild(dateElement);

        const iconElement = document.createElement('img');
        iconElement.setAttribute('src', `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`);
        cardElement.appendChild(iconElement);

        const tempElement = document.createElement('p');
        tempElement.innerText = `Temperature: ${day.main.temp}°C`;
        cardElement.appendChild(tempElement);

        const humidityElement = document.createElement('p');
        humidityElement.innerText = `Humidity: ${day.main.humidity}%`;
        cardElement.appendChild(humidityElement);

        forecastElement.appendChild(cardElement);
    });
}

// Function to get 5-day forecast
function getForecast(coordinates) {
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`;
    return fetch(forecastURL)
        .then(response => response.json());
}

// Function to initiate API calls when the button is clicked
function submitSearch() {
    const cityInput = document.getElementById('search-input').value;
    localStorage.setItem('City', cityInput);

    getLocationCoordinates(cityInput)
        .then(coordinates => {
            getCurrentWeather(coordinates)
                .then(currentWeather => createCurrentElement(currentWeather));
            getForecast(coordinates)
                .then(forecastData => createForecastElements(forecastData));
        })
        .catch(error => console.error('Error:', error));
}

// Event listener for the submit button
document.getElementById('search-button').addEventListener('click', function (event) {
    event.preventDefault();
    submitSearch();
});

// Display current data and 5-day forecast on page load
const storedCity = localStorage.getItem('City');
if (storedCity) {
    submitSearch();
}