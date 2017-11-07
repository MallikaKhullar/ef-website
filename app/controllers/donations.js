const Donation = require('../repo/mongo/donations_dump.js');
const { wrap: async } = require('co');
var fn = require('./../utils/functions');
var deferred = require('./../utils/deferred.js');

exports.createDonation = function(user_id, cause_id, cb) {
    return fn.defer(fn.bind(Donation, 'createDonation'))({ user_id, cause_id, ngo_id }).pipe(function(res) {
        return deferred.success(res);
    });
};
exports.createDump = function(donation_id, user_id, cause_id) {
    return fn.defer(fn.bind(Donation, 'createDonation'))({ donation_id, user_id, cause_id }).pipe(function(res) {
        return deferred.success(res);
    });
};

exports.getAllDonationCount = function() {
    return deferred.success(15000);
    //TODO: implement later
    // return fn.defer(fn.bind(Donation, 'getDonationCount'))({}).pipe(function(res) {
    //     return deferred.success(res);
    // });
};