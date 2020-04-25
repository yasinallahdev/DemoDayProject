module.exports = (app, db) => {

    app.get("/alertSubmissions", (req, res) => {

        if(req.user) {
            if(!req.user.isAdministrator) {
                res.status(403).send("Forbidden Error 403: Your account does not have the administrative permissions required to access this page.");
            } else {
                let isLoggedIn = (req.user)?(true):(false);
                db.collection('newsStories').find({}).toArray( (err, result) => {
                    const featuredStory = result.find( story => story.featured );
                    const nonFeatured = result.filter( story => story != featuredStory );
                    res.render('alertSubmissions.ejs', {
                        isLoggedIn: isLoggedIn,
                        user: req.user,
                        featuredStory: featuredStory,
                        newsStories: nonFeatured
                    });
                });
            }
        } else {
            res.status(403).send("Forbidden Error 403: You must be logged into an administrator account to access this page.");
        }

    });

}