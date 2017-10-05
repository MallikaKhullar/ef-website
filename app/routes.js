var path = require('path');

module.exports = function(router, passport) {

    router.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });


    router.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    // router.post('/login', do all our passport stuff here);

    router.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // router.post('/signup', do all our passport stuff here);

    router.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    //home page with ejs
    router.get('/new-tab', function(req, res) {
        //TODO: trigger call to database handler to increase #hearts
        res.render(path.join(__dirname, "../new-tab"));
    });

    //about page with ejs
    router.get('/about-us', function(req, res) {
        res.render(path.join(__dirname, "../about"));
    });

    //about page with ejs
    router.get('/home-page', function(req, res) {
        res.render(path.join(__dirname, "../login"));
    });


    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
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