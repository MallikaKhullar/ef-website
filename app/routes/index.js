var config = require('config');
var Utils = require('../utils');

var homePage = require('./home-page');
var topApps = require('./top-apps');
var newTab = require('./new-tab');
var termsAndConditions = require('./terms');
var login = require('./login');



var allRoutes = function(app, passport) {

    // Ping for health check - No HTTPS Check, load balancer sends HTTP only
    app.use('/health', function(req, res) {
        res.sendStatus(200);
    });


    app.all('*', function(req, res, next) {

        if (config.environment !== "Development") {
            // 1 - Non dub dub dub redirects
            if (
                req.headers.host.match(/^www/) === null &&
                req.headers.host.match(/\./g) !== null &&
                req.headers.host.match(/\./g).length == 1
            ) {
                res.redirect(301, 'https://www.' + req.headers.host + req.url);
                return;
            }

            // 2 - Non HTTPS links redirects
            if (req.headers["x-forwarded-proto"] !== "https") {
                res.redirect(301, "https://" + req.headers.host + req.url);
                return;
            }
        }
        next();
    });

    app.use('/', homePage);
    app.use('/home', homePage);
    app.use('/login', login);
    app.use('/top-apps', topApps);
    app.use('/terms', termsAndConditions);
    app.use('/new-tab', newTab);


    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/new-tab',
            failureRedirect: '/'
        }));

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/new-tab',
            failureRedirect: '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

module.exports = allRoutes;