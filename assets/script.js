const apiKey = '36f0cbd6e9a722edf8afd95a5a140306';

// Function to remove a city from the search history
function removeCityFromSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('SearchHistory')) || [];

    // Remove the city from the search history array
    searchHistory = searchHistory.filter(item => item !== city);

    // Update the search history in local storage
    localStorage.setItem('SearchHistory', JSON.stringify(searchHistory));

    // Update the search history UI
    updateSearchHistoryUI(searchHistory);
}

// Event listener for DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    // Clear the search history in local storage
    localStorage.removeItem('SearchHistory');
    
    // Update the search history UI
    let storedSearchHistory = JSON.parse(localStorage.getItem('SearchHistory')) || [];
    updateSearchHistoryUI(storedSearchHistory);
});


// Function to build a query URL for location name and get coordinates
function getLocationCoordinates(city) {
    const locationURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
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
    currentElement.classList.add('show-border'); // Add class for border

    const cityNameElement = document.createElement('h1');
    cityNameElement.innerText = `${weatherData.name} (${new Date().toLocaleDateString()})`; // Add date next to city name
    currentElement.appendChild(cityNameElement);

    const iconElement = document.createElement('img');
    iconElement.setAttribute('src', `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`);
    currentElement.appendChild(iconElement);

    const tempElement = document.createElement('p');
    const tempInCelsius = (weatherData.main.temp - 273.15).toFixed(2);
    tempElement.innerText = `Temperature: ${tempInCelsius}°C`;
    currentElement.appendChild(tempElement);

    const windspeedElement = document.createElement('p');
    windspeedElement.innerText = `Wind Speed: ${weatherData.wind.speed} km/h`;
    currentElement.appendChild(windspeedElement);

    const humidityElement = document.createElement('p');
    humidityElement.innerText = `Humidity: ${weatherData.main.humidity}%`;
    currentElement.appendChild(humidityElement);

    const containerElement = document.getElementById('today');
    containerElement.innerHTML = ''; // Clear existing content
    containerElement.appendChild(currentElement);
}

function createForecastElements(forecastData) {
    const forecastElement = document.getElementById('forecast');
    forecastElement.innerHTML = ''; // Clear existing content

    // Show the "5-Day Forecast" title
    document.getElementById('forecast-title').style.display = 'block';

    forecastData.list.slice(0, 5).forEach(day => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
    
        const dateElement = document.createElement('p');
        dateElement.classList.add('date'); // Add 'date' class here
        dateElement.innerText = new Date(day.dt * 1000).toLocaleDateString();
        cardElement.appendChild(dateElement);    

        const iconElement = document.createElement('img');
        iconElement.setAttribute('src', `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`);
        cardElement.appendChild(iconElement);

        // Convert temperature from Kelvin to Celsius
        const tempInCelsius = (day.main.temp - 273.15).toFixed(2);
        const tempElement = document.createElement('p');
        tempElement.innerText = `Temperature: ${tempInCelsius}°C`;
        cardElement.appendChild(tempElement);

        // Add wind speed information
        const windSpeedElement = document.createElement('p');
        windSpeedElement.innerText = `Wind Speed: ${day.wind.speed} m/s`;
        cardElement.appendChild(windSpeedElement);

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
function submitSearch(cityInput) {
    getLocationCoordinates(cityInput)
        .then(coordinates => {
            // Fetch current weather and forecast concurrently
            Promise.all([getCurrentWeather(coordinates), getForecast(coordinates)])
                .then(([currentWeather, forecastData]) => {
                    // Create and append current weather element
                    createCurrentElement(currentWeather);

                    // Create and append 5-day forecast elements
                    createForecastElements(forecastData);

                    // Update search history
                    updateSearchHistory(cityInput);

                    // Clear the search input
                    document.getElementById('search-input').value = '';
                })
                .catch(error => console.error('Error fetching weather and forecast:', error));
        })
        .catch(error => console.error('Error fetching location coordinates:', error));
}


// Function to update search history
function updateSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('SearchHistory')) || [];


    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('SearchHistory', JSON.stringify(searchHistory));
        updateSearchHistoryUI(searchHistory);
    }
}

function updateSearchHistoryUI(searchHistory) {
    const searchHistoryElement = document.getElementById('search-history');

    // Clear existing content
    searchHistoryElement.innerHTML = '';

    // Add each city to the search history UI
    searchHistory.forEach(city => {
        const formattedCity = capitalizeCity(city);
        const listItem = document.createElement('button');
        listItem.classList.add('list-group-item', 'list-group-item-action');
        listItem.innerText = formattedCity;
        listItem.addEventListener('click', () => {
            // Handle click on a search history item
            submitSearch(city);
        });
        searchHistoryElement.appendChild(listItem);
    });
}


function capitalizeCity(city) {
    return city.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Event listener for the submit button
document.getElementById('search-button').addEventListener('click', function (event) {
    event.preventDefault();
    const cityInput = document.getElementById('search-input').value;
    submitSearch(cityInput);
});

// Display search history on page load
const storedSearchHistory = JSON.parse(localStorage.getItem('SearchHistory')) || [];
updateSearchHistoryUI(storedSearchHistory);
