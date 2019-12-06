module.exports = (app, db) => {

    app.get('/directionSearch', (req, res) => {

        db.collection('newsStories').find({}).toArray((err, result) => {
            const featuredStory = result.find( story => story.featured );
            const nonFeatured = result.filter( story => story != featuredStory );
            let isLoggedIn = (req.user)?(true):(false);
            res.render('directionSearch.ejs', {
                isLoggedIn: isLoggedIn,
                featuredStory: featuredStory,
                newsStories: nonFeatured
            })
        });

    })

    app.post('/directionSearch', (req, res) => {

        res.redirect(`/directions?startStation=${req.body.sourceStation}&destinationStation=${req.body.destinationStation}`);

    })

}