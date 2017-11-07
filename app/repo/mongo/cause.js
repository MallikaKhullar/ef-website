var mongoose = require('mongoose');

var causeSchema = mongoose.Schema({
    cause_id: { type: String, index: true },
    cause_name: String,
    img_url: String,
    total_hearts: Number
}, { timestamps: true });


causeSchema.statics = {
    getAllCauses: function(data, cb) {
        this.find({}).lean().exec(cb);
    },

    getCausesByIds: function(data, cb) {
        this.find({ cause_id: { $in: data.ids } }).lean().exec(cb);
    },

    getCauseById: function(data, cb) {
        this.findOne({ cause_id: data.id }).lean().exec(cb);
    }
}

module.exports = mongoose.model('Cause', causeSchema);