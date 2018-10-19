var express = require('express');
var router = express.Router();
var RouteHandler = require('../../handlers/route_handler');
var userController = require('../../controllers/user');
var donationController = require('../../controllers/donations');
var doomoController = require('../../controllers/doomo');
var deferred = require('./../../utils/deferred');
var fn = require('./../../utils/functions');
var Utils = require('../../utils');


router.get('/', function(req, res) {

    var def = {
        userCount: userController.getAllUserCount(),
        doomoUsers: doomoController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount()
    };

    deferred.combine(def).pipe(function(data) {

        var newdata = {
            stats: {
                donations: "Rs. " + Utils.getCommaSeparatedMoney(data.donationCount),
                followers: Utils.getCommaSeparatedNumber(data.userCount + data.doomoUsers)
            }
        };

        res.render("terms-conditions.ejs", newdata);
    });
});


module.exports = router;