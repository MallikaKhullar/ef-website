var mongoose = require('mongoose');
var moment = require('moment');

var donationDumpSchema = mongoose.Schema({
    num_hearts: Number,
    cause_id: String,
    ngo_id: String,
    user_id: String,
    donation_id: String,
    timestamp: Number
});

donationDumpSchema.statics = {
    getAllDonations: function(data, cb) {
        this.find({}).lean().exec(cb);
    },

    createDonation: function(donationObj, cb) {
        donationObj.timestamp = moment().format('x');
        this.create(donationObj, cb);
    },

    getNGOsWithCauseIds: function(data, cb) {
        this.find({ cause_id: data.id }).lean().exec(cb);
    },

    getDonationByDonationId: function(data, cb) {
        this.findOne({ donation_id: data.id }).lean().exec(cb);
    },

    getDonationsByCauseId: function(data, cb) {
        this.findOne({ cause_id: data.cause_id }).lean().exec(cb);
    },
    getDonationsByUserId: function(id, cb) {
        this.aggregate([
            { $match: { user_id: id } },
            {
                $group: { _id: "$cause_id", hearts: { $sum: "$num_hearts" } }
            }
        ], cb);

    }
};

module.exports = mongoose.model('DonationDump', donationDumpSchema);