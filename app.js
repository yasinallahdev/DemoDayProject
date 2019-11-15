const mongodb = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.listen(8000, () => {
    console.log("Listening on port 8000");
})

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (request, response) => {
    response.render('index.ejs');
})

app.post('/getInformation', (request, response) => {
    console.log(request.body);
})
