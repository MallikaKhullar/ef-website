const User = require('../repo/mongo/user');
const Pledge = require('../repo/mongo/pledge');
const { wrap: async } = require('co');
var fn = require('./../utils/functions');
var deferred = require('./../utils/deferred.js');
var moment = require('moment');


exports.incrementHearsById = async(function*(id) {
    User.findById(id, function(err, user) {
        if (err) { return next(err); }
        user.hearts.current_week_hearts = (user.hearts.current_week_hearts || 0) + 1;
        user.hearts.total_hearts = (user.hearts.total_hearts || 0) + 1;
        user.modified_timestamp = moment().format('x');
        user.save((err) => {
            if (err) {
                return next(err);
            }
        });
    });
});

exports.insertPledge = function(pledgeObj) {
    return fn.defer(fn.bind(Pledge, 'createPledge'))({ "user_email": pledgeObj }).pipe(function(res) {
        return deferred.success(res);
    });
};

exports.changeColorTheme = function(id, theme) {
    return fn.defer(fn.bind(User, 'setColorTheme'))({ id, theme }).pipe(function(res) {
        return deferred.success(res);
    });
};

exports.getAllUserCount = function() {
    return fn.defer(fn.bind(User, 'getUserCount'))({}).pipe(function(res) {
        return deferred.success(res);
    });
};

exports.donate = function(donation_id, user_id) {
    fn.defer(fn.bind(User, 'addDonation'))({ donation_id, user_id }).pipe(function(res) {
        deferred.success(res);
    });
};

exports.initiateCauseChoosing = function(user_id) {
    return fn.defer(fn.bind(User, 'initiateCauseChoosing'))({ user_id }).pipe(function(res) {
        return deferred.success(res);
    });
};

exports.setDonatePending = function(user_id) {
    return fn.defer(fn.bind(User, 'setDonatePending'))({ user_id }).pipe(function(res) {
        return deferred.success(res);
    });
};
exports.setCause = function(user_id, cause_id, start, end) {
    return fn.defer(fn.bind(User, 'setCause'))({ user_id, cause_id, start, end }).pipe(function(res) {
        return deferred.success(res);
    });
};

exports.setProject = function(user_id, cause_id, start, end) {
    return fn.defer(fn.bind(User, 'setProject'))({ user_id, cause_id, start, end }).pipe(function(res) {
        console.log("Project has been put into user object=>", res, "\n\n\n");
        return deferred.success(res);
    });
};