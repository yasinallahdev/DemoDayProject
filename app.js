// server.js

// set up ======================================================================
// get all the tools we need
const express  = require('express');
const app      = express();
const port     = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');
const TMClient = require('textmagic-rest-client');
const apiKeys = require('./config/api/apiKeys');
const textingClient = new TMClient('yasinallah', apiKeys.TMClient);

const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const axios = require('axios');

var configDB = require('./config/database.js');

let db

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2019a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


async function loadRoutes() {
  // configuration ===============================================================
  await mongoose.connect(configDB.url, (err, database) => {
    if (err) return console.log(err)
      db = database
  }); // connect to our database

  require('./app/routes/addFavoriteStation')(app, db, axios);
  require('./app/routes/deleteFavoriteStation')(app, db);
  require('./app/routes/directions.js')(app, db, axios);
  require('./app/routes/directionSearch.js')(app, db);
  require('./app/routes/mapview.js')(app, db, axios);
  require('./app/routes.js')(app, db);
  require('./config/passport')(passport, textingClient); // pass passport for configuration
  require('./app/routes/login.js')(app, db, passport);
  require('./app/routes/profile.js')(app, db);
  require('./app/routes/signup.js')(app, db, passport);
  require('./app/routes/stationSearch.js')(app, db);
}

// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

loadRoutes();

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

