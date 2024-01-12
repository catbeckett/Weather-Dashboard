//- build a query url for location name
//    - to get coordinates for the second query
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