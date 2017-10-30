var adBlocker = require('just-detect-adblock');
var express = require('express');
var router = express.Router();
var RouteHandler = require('../../handlers/route_handler');
var User = require('../../repo/mongo/user');
var Utils = require('../../utils');
var userController = require('../../controllers/user');
var donationController = require('../../controllers/donations');
var deferred = require('./../../utils/deferred');
var fn = require('./../../utils/functions');


router.get('/', continueIfLoggedIn, function(req, res) {
    console.log("Before calling def");
    userController.incrementHearsById(req.user.id);
    var def = {
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount()
    };
    deferred.combine(def).pipe(function(data) {
        console.log("Reached here =", data);
        var newdata = {
            user: req.user,
            stats: {
                donations: "Rs. " + Utils.getCommaSeparatedMoney(data.donationCount),
                followers: Utils.getCommaSeparatedNumber(data.userCount)
            }
        };
        res.render("new-tab.ejs", newdata);
    });


    // userController.getAllUserCount(function(totalUsers) {
    //     var data = {
    //         user: req.user,
    //         stats: {
    //             donations: "Rs. " + Utils.getCommaSeparatedMoney(totalUsers),
    //             followers: Utils.getCommaSeparatedNumber(totalUsers)
    //         }
    //     };
    //     res.render("new-tab.ejs", data);
    // });
});

function continueIfLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

module.exports = router;