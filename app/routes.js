const apiKeys = require('./../config/api/apiKeys.js');

module.exports = function(app, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        let isLoggedIn = (req.user)?(true):(false);
        db.collection('newsStories').find({}).toArray((err, result) => {
            const featuredStory = result.find( story => story.featured );
            const nonFeatured = result.filter( story => story != featuredStory );
            res.render('index.ejs', {
                isLoggedIn: isLoggedIn,
                user: req.user,
                featuredStory: featuredStory,
                newsStories: nonFeatured
            });
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
        
};
