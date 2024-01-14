const apiKey = 'dea958ca793d7639b784b973c04d7c27';

let submitButton = document.getElementById('search-button');

let city; // declare the city variable outside the event handler

submitButton.addEventListener('click', function(event){
    event.preventDefault();

    city = document.getElementById("search-input").value;

    localStorage.setItem("City", city);

    //- build a query url for location name
    let queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

    fetch(queryURL)
     .then(function (response){
        return response.json()
     })
     .then(function(data){
        console.log(data);
        let latLoc = data[0].lat;
        let lonLoc = data[0].lon;

        forecast(latLoc,lonLoc);
     });
});
//    - to get coordinates for the second query
function forecast(lat,lon) {
    let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKEY}`
    
    fetch(forecastWeather)
    .then(function (response){
       return response.json()
    })
    .then(function(data){
       console.log(data);
    })

}

function currentDay(lat,lon){
   let currentDayURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=$[lon}&appid=${apiKEY}`;
}

function createBox(forecastData) {

let currentElement = document.createElement('div');
currentElement.setAttribute('id', 'current-data');

let cityNameElement = document.createElement('h1');
cityNameElement.innerText = forecastData.name;
currentElement.appendChild(cityNameElement);

let dateElement = document.createElement('p');
let currentDate = new Date();
dateElement.innerText = currentDate.toLocaleDateString();
currentElement.appendChild(dateElement);

let iconElement = document.createElement('img');
iconElement.setAttribute('src', forecastData.current.condition.icon);
currentElement.appendChild(iconElement);

let tempElement = document.createElement('p');
tempElement.innerText = `Temperature: ${forecastData.current.temp_c}°C`;
currentElement.appendChild(tempElement);

let humidityElement = document.createElement('p');
humidityElement.innerText = `Humidity: ${forecastData.current.humidity}%`;
currentElement.appendChild(humidityElement);

let windspeedElement = document.createElement('p');
windspeedElement.innerText = `Wind Speed: ${forecastData.current.wind_kph} km/h`;
currentElement.appendChild(windspeedElement);

// Find place in DOM to attach new element
let containerElement = document.getElementById('today');
containerElement.appendChild(currentElement);

// For loop over the weather data from the forecast api
forecastData.forecast.forecastday.forEach((day) => {
   // build elements and append to container
}); }
//- send query to get coordinates


//- build a query url for weather data
//    - use coordinates from previous
//- send query for weather data

//- build an element to hold/show the current data
//    - this could be a header-style element
//        - city name
//                - h1/h2
//            - date
//                - p
//            - icon
//                - img
//            - temp
//                - p
//            - humidity
//                - p
//            - wind speed
//                - p
//- find place in DOM to attach new element
//    - "#today" element

//- for loop over the weather data from the forecast api
//- build elements for 5-day forecast
//    - multiple elements (one per day)
//        - bootstrap card
//            - city name
//                - h1/h2
//            - date
//                - p
//            - icon
//                - img
//            - temp
//                - p
//            - humidity
//                - p
//            - wind speed
//                - p
//        - one row of 5 cards
//- find place in DOM to attach new elements
//    - "#forecast" element
//
//- "submit" function to initiate the api calls when the button is clicked
//    - take value from input
//        - save to localstorage
//        - used in API call for coordinates
//
//- display current data
//    - city name
//    - date
//    - icon
//    - temperature
//    - humidity
//    - wind speed
//- display 5-day forecast
//    - date
//    - icon
//    - temperature
//    - humidity

//- search history
//    - localstorage
//        - an array
//            - just city names
//        - store as json