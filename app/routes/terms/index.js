var express = require('express');
var router = express.Router();
var RouteHandler = require('../../handlers/route_handler');

// Top-Apps List
// router.get('/', function(req, res, next) {
//     RouteHandler.renderView( /*insert API module here */ , req, res, next);
// });

router.get('/', function(req, res) { res.render("terms.ejs"); });


module.exports = router;