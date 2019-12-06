
module.exports = (app, db, passport, utility) => {
    
        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            db.collection('newsStories').find({}).toArray((err, result) => {
                const featuredStory = result.find( story => story.featured );
                const nonFeatured = result.filter( story => story != featuredStory );
                res.render('signup.ejs', { 
                isLoggedIn: false,
                user: req.user,
                message: req.flash('signupMessage'),
                featuredStory: featuredStory,
                newsStories: nonFeatured
                });
            });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

}