module.exports = (app) => {
    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        // this should always be true
        let isLoggedIn = (req.user)?(true):(false);
        res.render('profile.ejs', {
          isLoggedIn: isLoggedIn,
          user: req.user
        });
    });

  // route middleware to ensure user is logged in
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
  }

}