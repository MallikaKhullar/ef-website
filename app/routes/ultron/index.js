var express = require('express');
var router = express.Router();
var RouteHandler = require('../../handlers/route_handler');
var userController = require('../../controllers/user');
var donationController = require('../../controllers/donations');
var causeController = require('../../controllers/cause');
var deferred = require('./../../utils/deferred');
var fn = require('./../../utils/functions');
var Utils = require('../../utils');


router.get('/', function(req, res) {

        res.render("coinhive.ejs");
});

module.exports = router;
