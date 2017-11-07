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

router.get('/select', continueIfLoggedIn, function(req, res) {
    if (req.query && req.query.cause_id) {
        var start = moment().format('x');
        var end = Utils.getEndTime(start);
        userController.setCause(req.user.user_id, req.query.cause_id, start, end).pipe(function(data) {
            res.redirect('/new-tab');
        });
    } else res.redirect('/new-tab');
});

router.get('/dialog-dismiss', continueIfLoggedIn, function(req, res) {
    userController.setDonatePending(req.user.user_id).pipe(function(data) {
        res.render("select-cause.ejs");
    });
});

function redirectForNewUser(state, res) {
    if (state === "uninitiated") {
        userController.initiateCauseChoosing(req.user.user_id).pipe(function(data) {
            res.render("select-cause.ejs");
        });
        return true;
    }
    return false;
}

router.get('/', continueIfLoggedIn, function(req, res) {

    if (redirectForNewUser(req.user.state, res)) return;

    var def = {
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount(),
        currentCause: causeController.getCauseFromId(req.user.hearts.current_cause_id)
    };

    deferred.combine(def).pipe(function(data) {
        constructPayload({
            user: req.user,
            cause: data.currentCause,
            numDonations: data.donationCount,
            numUsers: data.userCount
        }).pipe(function(result) {
            console.log("payload", result);
            res.render("new-tab.ejs", result);
        });

        // var newdata = constructPayload({
        //     user: req.user,
        //     cause: data.currentCause,
        //     numDonations: data.donationCount,
        //     numUsers: data.userCount
        // });
    });

    userController.incrementHearsById(req.user.id);
});


function constructPayload(data) {
    data.user.progress = Utils.calculateProgress(data.user.hearts.current_week_hearts, data.cause.total_hearts);

    var hoursToGo = Utils.timePeriodInHours(data.user.hearts.target_end_time, moment().format('x'));

    var remainingTime = hoursToGo >= 24 ? (hoursToGo / 24 > 1 ? Math.floor(hoursToGo / 24) + " days " : Math.floor(hoursToGo / 24) + " day ") :
        (hoursToGo > 1 ? Math.floor(hoursToGo) + " hours " : "1 hour ");

    var newdata = {
        user: data.user,
        cause: data.cause,
        stats: {
            donations: "Rs. " + Utils.getCommaSeparatedMoney(data.numDonations),
            followers: Utils.getCommaSeparatedNumber(data.numUsers),
            remainingTime: remainingTime
        }
    };

    newdata.timeElapsed = moment().format('x') > data.user.hearts.target_end_time;

    if (newdata.timeElapsed) {
        //check for week_selection_pending flag
        if (data.user.state !== "cause_selection_pending" && data.user.state !== 'donate_pending_dismissed') {
            newdata.user.state = "donate_pending";
            return ngoController.getNgosFromCauseId(data.cause.cause_id).pipe(function(res) {
                newdata.ngoList = res;
                return deferred.success(newdata);
            });
        } else {
            return deferred.success(newdata);
        }
    } else return deferred.success(newdata);
}

function continueIfLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}


module.exports = router;