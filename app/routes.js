const apiKeys = require('./../config/api/apiKeys.js');

module.exports = function(app, passport, db, axios) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        let isLoggedIn = (req.user)?(true):(false);
        res.render('index.ejs', {
          isLoggedIn: isLoggedIn,
          user: req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
        
};
