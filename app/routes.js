var path = require('path');

var routesToTemplates = {
    "/": "home.ejs",
    "/new-tab": "new-tab.ejs",
    "/terms": "terms.ejs",
    "/login": "login.ejs",
    "/about": "about.ejs"
};

module.exports = function(router, passport) {

    router.get('/', function(req, res) { res.render(routesToTemplates['/']); });

    router.get('/login', continueIfLoggedOut, function(req, res) { res.render(routesToTemplates['/login']); });

    router.get('/about-us', function(req, res) { res.render(routesToTemplates['/about']); });


    //home page with ejs
    router.get('/new-tab', continueIfLoggedIn, function(req, res) {
        //TODO: trigger call to database handler to increase #hearts
        res.render(routesToTemplates['/new-tab'], { user: req.user });
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
};

function continueIfLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

function continueIfLoggedOut(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/login');
    return next();
}