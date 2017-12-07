var mongoose = require('mongoose');
var moment = require('moment');
// create the model for users and expose it to our app
var userSchema = mongoose.Schema({
    user_id: { type: String, unique: true, required: true },
    email: { type: String, unique: true },
    timestamp: Number,
    facebook_id: String,
    facebook_token: String,
    name: String,
    google_id: String,
    google_token: String,
    state: { type: String, enum: ['uninitiated', 'week_ongoing', 'donate_pending', 'cause_selection_pending'] },
    previous_donation: {
        previous_cause_id: String,
        previous_week_hearts: String
    },
    progress: Number,
    hearts: {
        target_end_time: Number,
        target_start_time: Number,
        current_week_hearts: Number,
        total_hearts: Number,
        current_cause_id: String,
        donations_till_date: [String]
    },
    web_version: String
});

userSchema.statics = {
    createUser: function(data, cb) {
        var user = {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                user[key] = data[key];
            }
        }
        var timestamp = moment().format('x');
        user.timestamp = timestamp;
        user.id = "donator" + timestamp;
        this.create(user, cb)
    },

    getAllUsers: function(data, cb) {
        this.find({}).lean().exec(cb);
    },

    setCurrentCause: function(data, cb) {
        this.findOneAndUpdate({ user_id: data.id }, { $set: { 'hearts.current_cause_id': data.cause_id } }, {}, cb);
    },

    getUsersByIds: function(data, cb) {
        this.find({ user_id: { $in: data.users } }).lean().exec(cb);
    },

    getUserById: function(id, cb) {
        this.findOne({ user_id: id }).lean().exec(cb);
    },

    getUserCount: function(data, cb) {
        this.count({}).lean().exec(cb);
    },

    addDonation: function(data, cb) {

        this.findOne({ user_id: data.user_id }, function(err, res) {
            res.previous_donation.previous_week_hearts = res.hearts.current_week_hearts;
            res.previous_donation.previous_cause_id = res.hearts.current_cause_id;
            res.hearts.current_week_hearts = 0;
            res.state = "cause_selection_pending";
            console.log("New user to update", res);
            res.save();
        });
    },

    setCause: function(data, cb) {
        this.findOneAndUpdate({ user_id: data.user_id }, {
            $set: {
                'hearts.current_week_hearts': 0,
                "state": "week_ongoing",
                "hearts.target_start_time": data.start,
                "hearts.target_end_time": data.end,
                "hearts.current_cause_id": data.cause_id,
            }
        }, {}, cb);
    },

    initiateCauseChoosing: function(data, cb) {
        this.findOneAndUpdate({ user_id: data.user_id }, {
            $set: { "state": "cause_selection_pending" }
        }, {}, cb);
    },
    setDonatePending: function(data, cb) {
        this.findOneAndUpdate({ user_id: data.user_id }, {
            $set: { "state": "donate_pending" }
        }, {}, cb);
    }
}

module.exports = mongoose.model('User', userSchema);