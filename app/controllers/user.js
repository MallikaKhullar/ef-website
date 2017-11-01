const User = require('../repo/mongo/user');
const { wrap: async } = require('co');
var fn = require('./../utils/functions');
var deferred = require('./../utils/deferred.js');

exports.incrementHearsById = async(function*(id) {
    User.findById(id, function(err, user) {
        if (err) { return next(err); }
        user.hearts.current_week_hearts = (user.hearts.current_week_hearts || 0) + 1;
        user.hearts.total_hearts = (user.hearts.total_hearts || 0) + 1;
        user.save((err) => {
            if (err) {
                return next(err);
            }
        });
    });
});

exports.getAllUserCount = function() {
    return fn.defer(fn.bind(User, 'getUserCount'))({}).pipe(function(res) {
        return deferred.success(res);
    });
};