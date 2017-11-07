var mongoose = require('mongoose');

var donationDumpSchema = mongoose.Schema({
    num_hearts: Number,
    cause_id: String,
    ngo_id: String,
    user_id: String,
    donation_id: String
});

donationDumpSchema.statics = {
    getAllDonations: function(data, cb) {
        this.find({}).lean().exec(cb);
    },

    createDonation: function(donationObj, cb) {
        console.log("Create don repo called with donation", donationObj);
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
    }
};

module.exports = mongoose.model('DonationDump', donationDumpSchema);