var adBlocker = require('just-detect-adblock');
var express = require('express');
var router = express.Router();
var RouteHandler = require('../../handlers/route_handler');
var User = require('../../repo/mongo/user');
var Utils = require('../../utils');
var userController = require('../../controllers/user');
var donationController = require('../../controllers/donations');
var causeController = require('../../controllers/cause');
var ngoController = require('../../controllers/ngo');
var deferred = require('./../../utils/deferred');
var fn = require('./../../utils/functions');
var moment = require('moment');

router.get('/', continueIfLoggedIn, function(req, res) {
    //increment hearts every time new page is loaded
    userController.incrementHearsById(req.user.id);

    var def = {
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount(),
        currentCause: causeController.getCauseFromId(req.user.hearts.current_cause_id)
    };

    deferred.combine(def).pipe(function(data) {

        var user = req.user;

        user.progress = Utils.calculateProgress(user.hearts.current_week_hearts, data.currentCause.total_hearts);
        var hoursToGo = Utils.timePeriodInHours(user.hearts.target_start_time, user.hearts.target_end_time);
        var remainingTime = hoursToGo >= 24 ? (hoursToGo / 24 > 1 ? hoursToGo / 24 + " days " : hoursToGo / 24 + " day ") :
            (hoursToGo > 1 ? hoursToGo + " hours " : hoursToGo + " hour ");

        var newdata = constructPayload({
            user: user,
            cause: data.currentCause,
            numDonations: data.donationCount,
            numUsers: data.userCount,
            remainingTime: remainingTime
        });

        newdata.timeElapsed = moment().format('x') > user.hearts.target_end_time;

        if (newdata.timeElapsed) {
            //if the time has elapsed, also send the ngo details related to this cause
            ngoController.getNgosFromCauseId(req.user.hearts.current_cause_id).pipe(function(data) {
                newdata.ngoList = data;
                res.render("new-tab.ejs", newdata);
            });
        } else {
            res.render("new-tab.ejs", newdata);
        }
    });
});


function constructPayload(data) {
    console.log("Params", data);
    return {
        user: data.user,
        cause: data.cause,
        stats: {
            donations: "Rs. " + Utils.getCommaSeparatedMoney(data.numDonations),
            followers: Utils.getCommaSeparatedNumber(data.numUsers),
            remainingTime: data.remainingTime
        }
    };
}

function continueIfLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}


module.exports = router;