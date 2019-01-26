var config = require('config');
var Utils = require('../utils');

var homePage = require('./home-page');
var homePageDisable = require('./home-page-disable');
var topApps = require('./top-apps');
var newTab = require('./new-tab');
var termsAndConditions = require('./terms-conditions');
var privacy = require('./privacy');
var login = require('./login');
var faqs = require('./faqs');
var donate = require('./donate');
var ultron = require('./ultron');
var blogs = require('./blogs');
var projects = require('./projects');
var contactPage = require('./contact');
var aboutPage = require('./about-us');
var carter = require('./carter');
var doomo = require('./doomo');

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
    app.use('/contact', contactPage);
    app.use('/aboutUs', aboutPage);
    app.use('/home', homePageDisable);
    app.use('/donate', donate);
    app.use('/login', login);
    app.use('/top-apps', topApps);
    app.use('/privacy', privacy);
    app.use('/terms', termsAndConditions);
    app.use('/new-tab', newTab);
    app.use('/faqs', faqs);
    app.use('/carter', carter);
    app.use('/doomo', doomo);

    app.all("/blog/didn't-teach-me-in-school-maharashtra-farmers", function(req, res, next) {
        res.redirect(301, "http://www.flutur.org/blog/didnt-teach-me-in-school-maharashtra-farmers");
    });

    app.all("/blog/cat1", function(req, res, next) {
        res.redirect(301, "http://www.flutur.org/blog");
    });

    app.all("/blog/mall1", function(req, res, next) {
        res.redirect(301, "http://www.flutur.org/blog");
    });
    app.all("/blog/123tay", function(req, res, next) {
        res.redirect(301, "http://www.flutur.org/blog");
    });
    app.all("/blog/pregnet", function(req, res, next) {
        res.redirect(301, "http://www.flutur.org/blog");
    });
    app.all("/blog/taykath", function(req, res, next) {
        res.redirect(301, "http://www.flutur.org/blog");
    });

    app.use('/blog', blogs);
    app.use('/projects', projects);

    app.get('/robots.txt', function(req, res) {
        res.type('text/plain');
        res.send("User-agent: *\n" +
            "Disallow: /blog/jljl11kj" +
            "\nDisallow: /blog/sophie_1" +
            "\nDisallow: /blog?type=tech_1" +
            "\nDisallow: /blog?type=news" +
            "\nDisallow: /blog?type=tech" +
            "\nDisallow: /blog?type=flutur" +
            "\nDisallow: /blog/jlj" +
            "\nDisallow: /blog/mall" +
            "\nDisallow: /blog/mall1" +
            "\nDisallow: /blog/cat1" +
            "\nDisallow: /blog/taykath" +
            "\nDisallow: /blog/123tay" +
            "\nDisallow: /blog/pregnet" +
            "\nDisallow: /blog/ngos_dog_adoption");
    });


    app.get('/ads.txt', function(req, res) {
        res.type('text/plain');
        res.send("Infolinks.com, 3083843 , DIRECT \nappnexus.com, 3251, RESELLER\nopenx.com, 118151, RESELLER, 6a698e2ec38604c6\nPubmatic.com, 60809,RESELLER,5d62403b186f2ace\nAdtech.com, 11409, Reseller\ngoogle.com, pub-6373315980741255, RESELLER, f08c47fec0942fa0\ngoogle.com, pub-2697483239283649, RESELLER, f08c47fec0942fa0\naol.com, 6202, RESELLER\naol.com, 17744, RESELLER\nlkqd.net, 295, RESELLER, 59c49fa9598a0117\nlkqd.com, 295, RESELLER, 59c49fa9598a0117\nFreewheel.tv, 482337, RESELLER\nFreewheel.tv, 480609, RESELLER\nrevcontent.com, 29124, RESELLER\nappnexus.com, 7666, RESELLER, f5ab79cb980f11d1\nrubiconproject.com, 156042, RESELLER, 0bfd66d529a55807\nrubiconproject.com, 156042, RESELLER, 0bfd66d529a55807\nadvertising.com, 8603, RESELLER\nadvertising.com, 3531, RESELLER\nappnexus.com, 3364, RESELLER\nIndexexchange.com, 183756, RESELLER\nopenx.com, 539154393, RESELLER\nrubiconproject.com, 16698, RESELLER, 0bfd66d529a55807\ngoogle.com, pub-9901099389117290, DIRECT, f08c47fec0942fa0");
    });

    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/new-tab',
            failureRedirect: '/'
        }));

    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

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