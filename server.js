'use strict';


require('dotenv').config();
const express = require('express');
const cors = require('cors');

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
    try {
        const geoData = require('./data/geo.json');
        const city = request.query.city;
        const locationData = new Location(city, geoData);
        response.status(200).json(locationData);
    }
    catch (error) {
        errorHandler(error, request, response);
    }
});



app.get('/weather', (request, response) => {

    try {
        const darkskyData = require('./data/darksky.json');
        
        const weatherForecast = darkskyData.data.map((dayWeather) => {
            return new Weather(dayWeather);
        });

        response.status(200).json(weatherForecast);

    }
    catch (error) {
        errorHandler(error, request, response);
    }
});

app.use('*', notFoundHandler);

function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
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
