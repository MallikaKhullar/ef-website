// var mongoose = require('mongoose');
// var bcrypt = require('bcrypt-nodejs');

// // define the schema for our user model
// var userSchema = mongoose.Schema({

//     facebook_id: String,
//     facebook_token: String,
//     email: String,
//     name: String,
//     timestamp: { type: Number },
//     google_id: String,
//     google_token: String,

//     //TODO: userID, birthday?
// });

// // methods ======================
// // generating a hash
// userSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// // checking if password is valid
// userSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.local.password);
// };

// // create the model for users and expose it to our app
// module.exports = mongoose.model('User', userSchema);






var mongoose = require('mongoose');

// create the model for users and expose it to our app
var userSchema = mongoose.Schema({
    user_id: { type: String, unique: true, required: true },
    email: { type: String, unique: true },
    facebook_id: String,
    facebook_token: String,
    name: String,
    google_id: String,
    google_token: String,
    hearts: {
        progress: Number,
        target_end_time: Number,
        target_start_time: Number,
        current_week_hearts: Number,
        total_hearts: Number,
        current_cause_id: String,
        donations_till_date: [String]
    }
}, { timestamps: true });


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

    getUserById: function(data, cb) {
        this.findOne({ id: data.id }).lean().exec(cb);
    },

    getUsersByIds: function(data, cb) {
        this.find({ id: { $in: data.users } }).lean().exec(cb);
    },

    getAllUserCount: function(data, cb) {
        this.count({}, cb);
    },

    addDonation: function(data, cb) {
        var user = getUserById(data, cb);
        user.donations_till_date.add(data.donationId);
        this.update({ id: data.id }, user, { upsert: false }).lean().exec(cb);
    }
};

module.exports = mongoose.model('User', userSchema);