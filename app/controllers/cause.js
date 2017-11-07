const Cause = require('../repo/mongo/cause.js');
const { wrap: async } = require('co');
var fn = require('./../utils/functions');
var deferred = require('./../utils/deferred.js');

exports.getCauseFromId = function(id) {
    if (id === null) return deferred.success({});

    return fn.defer(fn.bind(Cause, 'getCauseById'))({ id }).pipe(function(res) {
        return deferred.success(res);
    });

};
exports.getAllCauses = function() {
    return fn.defer(fn.bind(Cause, 'getAllCauses'))({}).pipe(function(res) {
        return deferred.success(res);
    });
};