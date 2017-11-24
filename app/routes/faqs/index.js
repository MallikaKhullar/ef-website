var express = require('express');
var router = express.Router();
var ngoController = require('../../controllers/ngo');
var userController = require('../../controllers/user');
var donationController = require('../../controllers/donations');
var deferred = require('./../../utils/deferred');
var fn = require('./../../utils/functions');
var Utils = require('../../utils');


router.get('/', function(req, res) {

    var def = {
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount()
    };

    deferred.combine(def).pipe(function(data) {

        var newdata = {
            stats: {
                donations: "Rs. " + Utils.getCommaSeparatedMoney(data.donationCount),
                followers: Utils.getCommaSeparatedNumber(data.userCount)
            }
        };

        res.render("faq-page.ejs", newdata);
    });
});

module.exports = router;