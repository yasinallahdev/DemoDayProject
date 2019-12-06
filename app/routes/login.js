module.exports = (app, db, passport) => {
    
    // LOGIN ===============================
    // show the login form
    app.get('/login', function(req, res) {
        db.collection('newsStories').find({}).toArray((err, result) => {
            const featuredStory = result.find( story => story.featured );
            const nonFeatured = result.filter( story => story != featuredStory );
            res.render('login.ejs', {
                isLoggedIn: false,
                user: req.user, 
                message: req.flash('loginMessage'),
                featuredStory: featuredStory,
                newsStories: nonFeatured
            });
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash    : true // allow flash messages
    }));

}