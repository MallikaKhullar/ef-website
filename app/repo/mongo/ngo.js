var mongoose = require('mongoose');

// define the schema for our user model
var ngoSchema = mongoose.Schema({
    ngo_id: String,
    ngo_name: String,
    cause_id: { type: String, index: true },
    logo_url: String,
});


ngoSchema.statics = {
    getAllNgos: function(cb) {
        this.find({}).lean().exec(cb);
    },

    getNGOsWithCauseIds: function(data, cb) {
        this.find({ cause_id: data.id }).lean().exec(cb);
    },

    getNgoById: function(data, cb) {
        this.findOne({ ngo_id: data.id }).lean().exec(cb);
    }
}

module.exports = mongoose.model('NGO', ngoSchema);