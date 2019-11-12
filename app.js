const mongodb = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.listen(8000, () => {
    console.log("Listening on port 8000");
})

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
})

app.get('/css/style.css', (request, response) => {
    response.sendFile(__dirname + '/css/style.css');
})

app.get('/js/script.js', (request, response) => {
    response.sendFile(__dirname + '/js/script.js');
})

app.get('/img/south-coast-rail.jpg', (request, response) => {
    response.sendFile(__dirname + '/img/south-coast-rail.jpg');
})

app.post('/getInformation', (request, response) => {
    console.log(request.body);
})
