const Donation = require('../repo/mongo/donations_dump.js');
const User = require('../repo/mongo/user.js');
const { wrap: async } = require('co');
var fn = require('./../utils/functions');
var deferred = require('./../utils/deferred.js');
var moment = require('moment');


exports.createDonation = function(user_id, cause_id, cb) {
    return fn.defer(fn.bind(Donation, 'createDonation'))({ user_id, cause_id, ngo_id }).pipe(function(res) {
        return deferred.success(res);
    });
};
exports.createDump = function(num_hearts, donation_id, user_id, cause_id) {
    return fn.defer(fn.bind(Donation, 'createDonation'))({ num_hearts, donation_id, user_id, cause_id }).pipe(function(res) {
        return deferred.success(res);
    });
};


exports.createDumpv1 = function(num_tabs, donation_id, user_id, project_id) {
    return fn.defer(fn.bind(Donation, 'createDonation'))({ num_tabs, donation_id, user_id, project_id }).pipe(function(res) {
        return deferred.success(res);
    });
};

exports.getAllDonationCount = function() {
    return fn.defer(fn.bind(User, 'getUserCount'))({}).pipe(function(USER_COUNT) {
        return fn.defer(fn.bind(User, 'getUserById'))("123").pipe(function(user) {
            var currentTime = moment();
            var extra = moment().format('YYYY-MM-DD') + ' ';
            var morn = moment(extra + '00:00');
            var after = moment(extra + '11:00');
            var eve = moment(extra + '19:00');
            var night = moment(extra + '23:59');

            var REV_PER_TAB = 0.07,
                ADBLOCK_DISABLED = 0.35,
                DAU_PER_30D_INSTALLS = 0.7,
                TABS_PER_USER_MIN = 0.011;

            TIME_PASSED = (moment().format('x') - user.timestamp) / (1000 * 60);

            var incremental_rev = REV_PER_TAB * TABS_PER_USER_MIN * USER_COUNT * DAU_PER_30D_INSTALLS * ADBLOCK_DISABLED;
            var total_rev = 11000 + (incremental_rev * TIME_PASSED / 2);

            return deferred.success(total_rev.toFixed(0));
        });
    });
};

exports.getAllStats = function(userId) {
    return fn.defer(fn.bind(Donation, 'getDonationsByUserId'))(userId).pipe(function(data) {
        return deferred.success(data);
    });
};


function getAllDonationsForProject(id) {
    return fn.defer(fn.bind(Donation, 'getDonationsByProjectId'))(id).pipe(function(data) {
        return deferred.success(data);
    });
};


exports.getCurrentProgress = function(id) {
    return getAllDonationsForProject(id).pipe(function(data) {
        return deferred.success(data && data.length > 0 && data[0].sum ? data[0].sum : 0);
    });
};