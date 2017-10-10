var express = require('express');
var router = express.Router();
var RouteHandler = require('../../handlers/route_handler');

router.get('/', continueIfLoggedIn, function(req, res) {
    //TODO: Trigger call to database handler to increase #hearts
    res.render("new-tab.ejs", { user: req.user });
});

function continueIfLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

module.exports = router;