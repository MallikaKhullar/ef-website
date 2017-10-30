const Donation = require('../repo/mongo/donations_dump');
const { wrap: async } = require('co');
var fn = require('./../utils/functions');
var deferred = require('./../utils/deferred.js');


exports.getAllDonationCount = function() {
    return deferred.success(15000);
    //TODO: implement later
    // return fn.defer(fn.bind(Donation, 'getDonationCount'))({}).pipe(function(res) {
    //     return deferred.success(res);
    // });
};