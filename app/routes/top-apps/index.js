var express = require('express');
var router = express.Router();
var RouteHandler = require('../../handlers/route_handler');

// Top-Apps List
// router.get('/', function(req, res, next) {
//     RouteHandler.renderView( /*insert API module here */ , req, res, next);
// });

router.get('/', function(req, res) {
    //TODO: compile the list of apps from some DB list (with url, image url) and send from this controller
    res.render("top-apps.ejs");
});

module.exports = router;