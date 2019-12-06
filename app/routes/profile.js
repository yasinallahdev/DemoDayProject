module.exports = (app, db) => {
    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      // this should always be true
      let isLoggedIn = (req.user)?(true):(false);
      db.collection('newsStories').find({}).toArray((err, result) => {
        const featuredStory = result.find( story => story.featured );
        const nonFeatured = result.filter( story => story != featuredStory );
        res.render('profile.ejs', {
          isLoggedIn: isLoggedIn,
          user: req.user,
          featuredStory: featuredStory,
          newsStories: nonFeatured
        });
      });
    });

  // route middleware to ensure user is logged in
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
  }

}