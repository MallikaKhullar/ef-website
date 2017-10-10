var path = require('path');

var routesToTemplates = {
    "/": "home.ejs",
    "/new-tab": "new-tab.ejs",
    "/terms": "terms.ejs",
    "/login": "login.ejs",
    "/about": "about.ejs",
    "/top-sites": "top-apps.ejs"
};

module.exports = function(router, passport) {

    router.get('/', function(req, res) { res.render(routesToTemplates['/']); });

    router.get('/login', continueIfLoggedOut, function(req, res) { res.render(routesToTemplates['/login']); });

    router.get('/terms', function(req, res) { res.render(routesToTemplates['/terms']); });

    router.get('/top-apps', function(req, res) { res.render(routesToTemplates['/top-sites']); });

    router.get('/about-us', function(req, res) { res.render(routesToTemplates['/about']); });

    //home page with ejs
    router.get('/new-tab', continueIfLoggedIn, function(req, res) {
        //TODO: trigger call to database handler to increase #hearts
        res.render(routesToTemplates['/new-tab'], { user: req.user });
    });


};



function continueIfLoggedOut(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/new-tab');
    return next();
}