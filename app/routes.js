const axios = require('axios');
const apiKeys = require('./../config/api/apiKey.js');

module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        let isLoggedIn = (req.user)?(true):(false);
        res.render('index.ejs', {
          isLoggedIn: isLoggedIn,
          user: req.user
        });
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        // this should always be true
        let isLoggedIn = (req.user)?(true):(false);
        res.render('profile.ejs', {
          isLoggedIn: isLoggedIn,
          user: req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', {
              isLoggedIn: false,
              user: req.user, 
              message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { 
              isLoggedIn: false,
              user: req.user,
              message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        app.post('/addFavoriteStation', (request, response) => {
          axios.get(`https://api-v3.mbta.com/stops?route=Red,Blue,Green-B,Green-C,Green-D,Green-E,Orange,Mattapan`)
            .then(apiResponse => {
              console.log(apiResponse.data.data);
              let stationFound = false;
              for(let i = 0; i < apiResponse.data.data.length; i++) {
                if(apiResponse.data.data[i].attributes.name.toLowerCase() === request.body.stationName.toLowerCase()) {
                  stationFound = true;
                  break;
                }
              }
              if(stationFound) {
                db.collection('users').findOneAndUpdate(
                  {'local.email': request.user.local.email}, 
                  { $addToSet: { favoriteStations: { stationName: request.body.stationName }}}
                );
                response.redirect('/profile')
              } else {
                response.status(422);
                response.send(`Error! ${request.body.stationName} is not a valid MBTA Station!`);
              }
            })
            .catch(err => console.log(err));
        });

        app.delete('/deleteFavoriteStation', (request, response) => {
          db.collection('users').findOneAndUpdate(
            {'local.email': request.user.local.email}, 
            { $pull: { favoriteStations: { stationName: request.body.stationName }}}
          );
          response.end();
        })

        app.put('/updateAccessibilityNeeds', (request, response) => {
          db.collection('users').findOneAndUpdate({
              'local.email': request.user.local.email
            }, { 
              $set: { 
                  accessibilityNeeds: {
                    routeTransfer: request.body.wantsRouteTransfer, 
                    wheelchairAccess: request.body.needsWheelchairAccess, 
                    visibility: request.body.needsVisibility 
                  }
                } 
            }
          )
          response.end();
        })
        
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
