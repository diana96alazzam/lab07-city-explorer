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
        console.errorHandler(error, request, response);
    }
});

// Request URL: http://localhost:8000/location?city=london

// search_query=london&formatted_query=Lynnwood%2C%20Snohomish%20County%2C%20Washington%2C%20USA&latitude=47.8278656&longitude=-122.3053932



app.get('/weather', (request, response) => {

    try {
        const darkskyData = require('./data/darksky.json');
        // const reqCity = request.query.search_query;
        // const reqFormat = response.query.formatted_query;
        // const reqLat = request.query.latitude;
        // const reqLon = request.query.longitude;
        let weatherD = [];
        for (let i = 0; i < 9; i++) {
            const weatherData = new Weather(darkskyData.data[i]);
            weatherD.push(weatherData);
        }
        response.status(200).json(weatherD);

    }
    catch (error) {
        console.errorHandler(error, request, response);
    }
});

app.use('*', notFoundHandler);

function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weeknames = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];


function Weather(x,time) {
    this.forecast = x.weather.description;

    
    let date1 = (x.datetime).split('-');
    let day = weeknames[parseInt(date1[2]-4)];
    let month = monthNames[parseInt(date1[1])-1];
    let date2 = `${day} ${month} ${date1[2]} ${date1[0]}`;
    this.time = date2;


}


//  2020-04-05 to Sun Apr 05 2020

// Weather.prototype.timeFormat = function (x){
//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     let dateD = x.datetime;
//     let date1 = dateD.split('-');

//     let month = monthNames[parseInt(date1[1])];
//     this.time = `${month} ${date1[2]} ${date1[0]}`;
// }



function notFoundHandler(request, response) {
    response.status(404).send('Not Found');
}

function errorHandler(error, request, response) {
    response.status(500).send(error);
}


app.listen(PORT, () => console.log(`the server is running, PORT: ${PORT}`));
