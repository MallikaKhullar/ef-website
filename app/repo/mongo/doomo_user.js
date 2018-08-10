var mongoose = require('mongoose');
var moment = require('moment');

var doomoUserSchema = mongoose.Schema({
    name: String,
    id: { type: String, index: true },
    timestamp: Number
});

doomoUserSchema.statics = {
    getAllUsers: function(cb) {
        this.find({}).lean().exec(cb);
    },
    getUserCount: function(cb) {
        console.log("AT DB");
        this.count({}).lean().exec(cb);
    },
    createUser: function(userId, cb) {
        var user = { "id": userId };
        var timestamp = moment().format('x');
        user.timestamp = timestamp;
        this.create(user, cb);
    }
}

module.exports = mongoose.model('DoomoUser', doomoUserSchema);