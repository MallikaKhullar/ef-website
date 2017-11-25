var mongoose = require('mongoose');

// define the schema for our user model
var pledgeSchema = mongoose.Schema({
    user_email: String
});


pledgeSchema.statics = {
    getAllPledges: function(cb) {
        this.find({}).lean().exec(cb);
    },
    createPledge: function(pledge, cb) {
        this.create(pledge, cb);
    }
}

module.exports = mongoose.model('Pledge', pledgeSchema);