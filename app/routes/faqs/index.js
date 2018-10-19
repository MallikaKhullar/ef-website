var express = require('express');
var router = express.Router();
var ngoController = require('../../controllers/ngo');
var userController = require('../../controllers/user');
var donationController = require('../../controllers/donations');
var deferred = require('./../../utils/deferred');
var doomoController = require('../../controllers/doomo');
var fn = require('./../../utils/functions');
var Utils = require('../../utils');


router.get('/', function(req, res) {

    var def = {
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount(),
        doomoUsers: doomoController.getAllUserCount()

    };

    deferred.combine(def).pipe(function(data) {

        var newdata = {
            stats: {
                donations: "Rs. " + Utils.getCommaSeparatedMoney(data.donationCount),
                followers: Utils.getCommaSeparatedNumber(data.userCount + data.doomoUsers)
            }
        };

        res.render("faq-page.ejs", newdata);
    });
});

module.exports = router;