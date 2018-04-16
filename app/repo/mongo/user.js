var mongoose = require('mongoose');
var moment = require('moment');
// create the model for users and expose it to our app
var userSchema = mongoose.Schema({
    user_id: { type: String, unique: true, required: true },
    email: { type: String, unique: true },
    timestamp: Number,
    facebook_id: String,
    facebook_token: String,
    modified_timestamp: Number,
    name: String,
    google_id: String,
    google_token: String,
    state: {
        type: String,
        enum: [
            'v1_week_ongoing',
            'v1_uninitiated',
            'v1_donate_pending',
            'v1_cause_selection_pending',
            'uninitiated',
            'week_ongoing',
            'donate_pending',
            'cause_selection_pending'
        ]
    },
    ui_settings: {
        search_visible: { type: Boolean, default: true },
        app_bar: { type: Boolean, default: true }
    },
    color_theme: { type: String, enum: ['white', 'unsplash', 'gradient'] },
    picture: String,
    previous_donation: {
        previous_cause_id: String,
        previous_week_hearts: String
    },
    last_project: {
        tabs: String,
        project_id: String
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
    all_project_donations: [String],
    total_tabs: Number,
    project: {
        tabs: Number,
        target_end_time: Number,
        target_start_time: Number,
        project_id: String
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

    setColorTheme: function(data, cb) {
        this.findOneAndUpdate({ user_id: data.id }, { $set: { 'color_theme': data.theme } }, {}, cb);
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

    //v0 route
    addDonation: function(data, cb) {
        this.findOne({ user_id: data.user_id }, function(err, res) {
            res.previous_donation.previous_week_hearts = res.hearts.current_week_hearts - 1;
            res.previous_donation.previous_cause_id = res.hearts.current_cause_id;
            res.hearts.current_week_hearts = 0;
            res.state = "cause_selection_pending";
            res.save();
        });
    },

    //v1 route
    addProjectDonation: function(data, cb) {
        this.findOne({ user_id: data.user_id }, function(err, res) {
            res.last_project.tabs = res.project.tabs - 1;
            res.last_project.project_id = res.project.last_project;
            res.project.tabs = 0;
            res.state = "v1_cause_selection_pending";
            res.all_project_donations.push(data.donation_id)
            res.save();
        });
    },

    //v0 route
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

    //v1 route
    setProject: function(data, cb) {
        console.log("Reached repo", data);
        this.findOneAndUpdate({ user_id: data.user_id }, {
            $set: {
                'project.tabs': 0,
                "state": "v1_week_ongoing",
                "project.target_start_time": data.start,
                "project.target_end_time": data.end,
                "project.project_id": data.cause_id,
            }
        }, {}, cb);
    },

    initiateCauseChoosing: function(data, cb) {
        this.findOneAndUpdate({ user_id: data.user_id }, {
            $set: { "state": "v1_cause_selection_pending" }
        }, {}, cb);
    },
    setDonatePending: function(data, cb) {
        this.findOneAndUpdate({ user_id: data.user_id }, {
            $set: { "state": "v1_donate_pending" }
        }, {}, cb);
    },
    setV1WeekOngoing: function(data, cb) {
        this.findOneAndUpdate({ user_id: data.user_id }, {
            $set: { "state": "v1_week_ongoing" }
        }, {}, cb);
    },
    hideSearch: function(data, cb) {
        this.findOneAndUpdate({ user_id: data.user_id }, {
            $set: { "ui_settings.search_visible": false }
        }, {}, cb);
    },
    hideAppBar: function(data, cb) {
        this.findOneAndUpdate({ user_id: data.user_id }, {
            $set: { "ui_settings.app_bar": false }
        }, {}, cb);
    },
    showSearch: function(data, cb) {
        this.findOneAndUpdate({ user_id: data.user_id }, {
            $set: { "ui_settings.search_visible": true }
        }, {}, cb);
    },
    showAppBar: function(data, cb) {
        this.findOneAndUpdate({ user_id: data.user_id }, {
            $set: { "ui_settings.app_bar": true }
        }, {}, cb);
    }
}

module.exports = mongoose.model('User', userSchema);