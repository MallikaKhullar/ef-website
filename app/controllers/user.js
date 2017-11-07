const User = require('../repo/mongo/user');
const { wrap: async } = require('co');
var fn = require('./../utils/functions');
var deferred = require('./../utils/deferred.js');

exports.incrementHearsById = async(function*(id) {
    User.findById(id, function(err, user) {
        if (err) { return next(err); }
        user.hearts.current_week_hearts = (user.hearts.current_week_hearts || 0) + 1;
        user.hearts.total_hearts = (user.hearts.total_hearts || 0) + 1;
        user.save((err) => {
            if (err) {
                return next(err);
            }
        });
    });
});

exports.getAllUserCount = function() {
    return fn.defer(fn.bind(User, 'getUserCount'))({}).pipe(function(res) {
        return deferred.success(res);
    });
};

exports.donate = function(donation_id, user_id) {
    //clear current week hearts
    fn.defer(fn.bind(User, 'addDonation'))({ donation_id, user_id }).pipe(function(res) {
        deferred.success(res);
    });
};

exports.initiateCauseChoosing = function(user_id) {
    //clear current week hearts
    return fn.defer(fn.bind(User, 'initiateCauseChoosing'))({ user_id }).pipe(function(res) {
        return deferred.success(res);
    });
};

exports.setDonatePending = function(user_id) {
    //clear current week hearts
    return fn.defer(fn.bind(User, 'setDonatePending'))({ user_id }).pipe(function(res) {
        return deferred.success(res);
    });
};
exports.setCause = function(user_id, cause_id, start, end) {
    //clear current week hearts
    return fn.defer(fn.bind(User, 'setCause'))({ user_id, cause_id, start, end }).pipe(function(res) {
        return deferred.success(res);
    });
};

exports.selectNewCause = function(id, cause_id) {
    //set new current cause
    //new target start and end times
    var def = {
        fn1: fn.bind(User, 'setCurrentCause')({ id, cause_id }),
    };

    deferred.combine(def).pipe(function(data) {
        return deferred.success(data);
    });
};