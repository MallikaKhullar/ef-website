var path = require('path');

module.exports = function(router, passport) {

    router.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });


    // route for facebook authentication and login
    router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/new-tab',
            failureRedirect: '/'
        }));

    // route for logging out
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //home page with ejs
    router.get('/new-tab', isLoggedIn, function(req, res) {
        //TODO: trigger call to database handler to increase #hearts
        res.render('new-tab.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    //about page with ejs
    router.get('/about-us', function(req, res) {
        res.render("about.ejs");
    });

    //about page with ejs
    router.get('/home-page', function(req, res) {
        res.render("home");
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}