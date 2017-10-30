var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// create the model for users and expose it to our app
module.exports = function(mongoose) {
    var donationDumpSchema = mongoose.Schema({
        id: String,
        timestamp: { type: Number },
        num_hearts: Number,
        cause_id: String,
        ngo_id: String,
        user_id: String
    });

    donationDumpSchema.statics.createDonationForNGO = function(data, cb) {
        //TODO: this should also create a donation in the user table  /                         
        var donation = {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                donation[key] = data[key];
            }
        }
        var timestamp = moment().format('x');
        donation.timestamp = timestamp;
        donation.id = "donation" + timestamp;
        this.create(donation, cb);
    };

    donationDumpSchema.statics.createDonationForCause = function(data, cb) {
        //TODO: this should also create a donation in the user table  /                         
        var donation = {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                donation[key] = data[key];
            }
        }
        var timestamp = moment().format('x');
        donation.timestamp = timestamp;
        donation.id = "donation" + timestamp;
        this.create(donation, cb);
    };

    donationDumpSchema.statics.getAllDonations = function(data, cb) {
        this.find({}).lean().exec(cb);
    };

    donationDumpSchema.statics.getDonationByDonationId = function(data, cb) {
        this.findOne({ id: data.id }).lean().exec(cb);
    };

    donationDumpSchema.statics.getDonationsByCauseId = function(data, cb) {
        this.findOne({ cause_id: data.cause_id }).lean().exec(cb);
    };

    donationDumpSchema.statics.getDonationsByDonationIds = function(data, cb) {
        this.find({ id: { $in: data.donations } }).lean().exec(cb);
    };

    donationDumpSchema.statics.getAllDonationCount = function(params, cb) {
        this.count({}, cb);
    };

    return donationDumpSchema;
};