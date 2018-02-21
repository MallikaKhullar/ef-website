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

    if (req != undefined && req.user != undefined && req.user.email != undefined) console.log("Login page hit =>", req.user.email);
    else console.log("Login page hit");
    var def = {
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount()
    };

    deferred.combine(def).pipe(function(data) {

        var newdata = {
            stats: {
                donations: "Rs. " + Utils.getCommaSeparatedMoney(data.donationCount),
                followers: Utils.getCommaSeparatedNumber(50 + data.userCount)
            }
        };

        res.render("login_epic.ejs", newdata);
    });
});

module.exports = router;