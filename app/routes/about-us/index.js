var express = require('express');
var router = express.Router();
var Utils = require('../../utils');
var deferred = require('./../../utils/deferred');
var fn = require('./../../utils/functions');
var userController = require('../../controllers/user');
var donationController = require('../../controllers/donations');
var moment = require('moment');

router.get('/', function(req, res) {
    var def1 = {
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount()
    };

    deferred.combine(def1).pipe(function(data) {
        var newdata = {
            stats: {
                donations: "Rs. " + Utils.getCommaSeparatedMoney(data.donationCount),
                followers: Utils.getCommaSeparatedNumber(data.userCount)
            }
        };

        res.render("about-us.ejs", newdata);
    });
});


module.exports = router;