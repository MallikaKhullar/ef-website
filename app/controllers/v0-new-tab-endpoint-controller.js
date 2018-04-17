var userController = require('./user');
var donationController = require('./donations');
var causeController = require('./cause');
var ngoController = require('./ngo');
var deferred = require('./../utils/deferred');
var fn = require('./../utils/functions');
var constants = require('./../utils/constants');
var moment = require('moment');
var Utils = require('./../utils');
const prettyMs = require('pretty-ms');



function constructPayload(data) {
    var redirected = data.req != undefined && data.req.query != undefined && data.req.query.redirect != undefined ? JSON.parse(data.req.query.redirect.toLowerCase()) : false;

    var hoursToGo = Utils.timePeriodInHours(data.user.hearts.target_end_time, moment().format('x'));
    var remainingTime = hoursToGo >= 24 ? (hoursToGo / 24 > 1 ? Math.floor(hoursToGo / 24) + " days " : Math.floor(hoursToGo / 24) + " day ") :
        (hoursToGo > 1 ? Math.floor(hoursToGo) + " hours " : "1 hour ");

    if (data.cause && data.cause.total_hearts) {
        var progress = Utils.calculateProgress(data.user.hearts.current_week_hearts, data.cause.total_hearts);
        data.user.progress = progress;
    }

    var shortRemaining = prettyMs(data.user.hearts.target_end_time - moment().format('x'), { compact: true });

    var newdata = {
        user: data.user,
        cause: data.cause,
        previousCause: data.previousCause || {},
        stats: {
            donations: "Rs. " + Utils.getCommaSeparatedMoney(data.numDonations),
            followers: Utils.getCommaSeparatedNumber(50 + data.numUsers),
            remainingTime: remainingTime,
            shortRemaining: shortRemaining.replace("~", "")
        },
        redirected: redirected
    };

    var total_hearts_text = data.user.hearts.total_hearts == 1 ? " heart" : " hearts";

    var daysPassed = Utils.timePeriodInDays(moment().format('x'), data.user.timestamp);

    newdata.dailyImage = constants.images[Math.round(daysPassed) % constants.images.length];
    newdata.user.first_name = Utils.firstName(newdata.user.name);
    newdata.user.picture = (newdata.user.picture == null || newdata.user.picture == undefined) ? "/image/user.png" : newdata.user.picture;
    newdata.user.hearts.total_hearts_text = data.user.hearts.total_hearts + total_hearts_text;

    if (data.user.state == 'cause_selection_pending') {
        return ngoController.getNgosFromCauseId(data.previousCause.cause_id).pipe(function(res) {
            newdata.previousCause.ngoList = res;
            return deferred.success(newdata);
        });
    }

    if (Utils.hasTimeElapsedSince(data.user.hearts.target_end_time)) {
        newdata.user.state = "donate_pending";
        return ngoController.getNgosFromCauseId(data.cause.cause_id).pipe(function(res) {
            newdata.cause.ngoList = res;
            return deferred.success(newdata);
        });


    } else {
        return deferred.success(newdata);
    }
}

exports.render_weekOngoing_v0 = function(req, res) {
    var def = {
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount(),
        currentCause: causeController.getCauseFromId(req.user.hearts.current_cause_id),
        previousCause: causeController.getCauseFromId(req.user.previous_donation.previous_cause_id)
    };

    deferred.combine(def).pipe(function(data) {

        constructPayload({
            user: req.user,
            cause: data.currentCause,
            numDonations: data.donationCount,
            numUsers: data.userCount,
            previousCause: data.previousCause,
            req: req,
        }).pipe(function(result) {
            res.render("new-tab.ejs", result);
        });
    });
}