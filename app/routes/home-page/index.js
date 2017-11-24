var express = require('express');
var router = express.Router();
var RouteHandler = require('../../handlers/route_handler');
var ngoController = require('../../controllers/ngo');
var userController = require('../../controllers/user');
var donationController = require('../../controllers/donations');
var deferred = require('./../../utils/deferred');
var fn = require('./../../utils/functions');
var Utils = require('../../utils');


router.get('/', function(req, res) {

    var def = {
        ngos: ngoController.getAllNgos(),
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount()
    };

    deferred.combine(def).pipe(function(data) {

        var newdata = {
            ngos: data.ngos,
            stats: {
                donations: "Rs. " + Utils.getCommaSeparatedMoney(data.donationCount),
                followers: Utils.getCommaSeparatedNumber(data.userCount)
            }
        };

        res.render("home.ejs", newdata);
    });
});


module.exports = router;