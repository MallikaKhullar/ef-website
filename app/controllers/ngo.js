const Ngo = require('../repo/mongo/ngo.js');
const { wrap: async } = require('co');
var fn = require('./../utils/functions');
var deferred = require('./../utils/deferred.js');

exports.getNgosFromCauseId = function(id) {
    return fn.defer(fn.bind(Ngo, 'getNGOsWithCauseIds'))({ id }).pipe(function(res) {
        return deferred.success(res);
    });
};

exports.getAllNgos = function() {
    return fn.defer(fn.bind(Ngo, 'getAllNgos'))().pipe(function(res) {
        return deferred.success(res);
    });
}