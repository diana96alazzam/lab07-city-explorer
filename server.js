'use strict';


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superAgent = require('superagent');

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());

app.get('/', (request, response) => {
    response.status(200).send('Home Page');
});
app.get('/bad', (request, response) => {
    throw new Error('Oh, ERROR!');
});


app.get('/location', (request, response) => {

    const city = request.query.city;
    superAgent(`https://eu1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`)
    
    .then((locationRes)=> {
        const locData = locationRes.body;
        const locationData = new Location(city, locData);
        response.status(200).json(locationData);
    })
    
    .catch ((error) => errorHandler(error, request, response));
    
});



app.get('/weather', (request, response) => {

 superAgent(`https://api.weatherbit.io/v2.0/forecast/daily?city=${request.query.search_query}&key=${process.env.WEATHER_API_KEY}`)

 .then((weatherRes)=> {
     const weatherForecast = weatherRes.body.data.map((dayWeather) => {
         return new Weather(dayWeather);
     });
     response.status(200).json(weatherForecast)
 })
 .catch((err)=> errorHandler(err, request, response));

});

app.use('*', notFoundHandler);

function Location(city, locData) {
    this.search_query = city;
    this.formatted_query = locData[0].display_name;
    this.latitude = locData[0].lat;
    this.longitude = locData[0].lon;
}


function Weather(dayWeather) {
    this.forecast = dayWeather.weather.description;
    this.time = new Date(dayWeather.datetime).toDateString();
}


function notFoundHandler(request, response) {
    response.status(404).send('Not Found');
}

function errorHandler(error, request, response) {
    response.status(500).send(error);
}


app.listen(PORT, () => console.log(`the server is running, PORT: ${PORT}`));
