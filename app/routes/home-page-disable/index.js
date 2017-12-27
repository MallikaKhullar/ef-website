var express = require('express');
var router = express.Router();
var RouteHandler = require('../../handlers/route_handler');
var ngoController = require('../../controllers/ngo');
var userController = require('../../controllers/user');
var donationController = require('../../controllers/donations');
var blogController = require('../../controllers/blog');
var deferred = require('./../../utils/deferred');
var fn = require('./../../utils/functions');
var Utils = require('../../utils');

router.get('/', function(req, res) {
    res.redirect(301, 'http://www.flutur.org');
});



module.exports = router;