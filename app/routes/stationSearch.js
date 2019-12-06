module.exports = (app, db) => {

    app.get('/stationSearch', (req, res) => {

        db.collection('newsStories').find({}).toArray((err, result) => {
            const featuredStory = result.find( story => story.featured );
            const nonFeatured = result.filter( story => story != featuredStory );
            let isLoggedIn = (req.user)?(true):(false);
            res.render('stationSearch.ejs', {
                isLoggedIn: isLoggedIn,
                featuredStory: featuredStory,
                newsStories: nonFeatured
            })
        });

    })

    app.post('/stationSearch', (req, res) => {

        res.redirect(`/map?station=${req.body.stationName}`);

    })

}