module.exports = (app, db) => {
    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      // this should always be true
      let isLoggedIn = (req.user)?(true):(false);
      db.collection('newsStories').find({}).toArray( (err, result) => {
        const featuredStory = result.find( story => story.featured );
        const nonFeatured = result.filter( story => story != featuredStory );
        db.collection('stationAlerts').find({}).toArray((err2, stationAlerts) => {
          for(const stationData of req.user.favoriteStations) {
            if(stationAlerts.findIndex(alert => alert.stationName === stationData.stationName) !== -1) {
              console.log(`Found alert for ${stationData.stationName}`);
              stationData.hasAlert = true;
            } else {
              console.log(`No alert for ${stationData.stationName}`);
              stationData.hasAlert = false;
            }
            console.log(`${stationData.stationName} Alert Status: ${stationData.hasAlert}`)
          }
          res.render('profile.ejs', {
            isLoggedIn: isLoggedIn,
            user: req.user,
            featuredStory: featuredStory,
            newsStories: nonFeatured
          });
        });
      });
    });

  // route middleware to ensure user is logged in
  function isLoggedIn(req, res, next) {
    console.log(`Next: ${next}`);
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
  }

}