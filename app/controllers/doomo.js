const DoomoUser = require('../repo/mongo/doomo_user');
const DoomoCode = require('../repo/mongo/doomo_code');
const Puzzle = require('../repo/mongo/doomo_levels');
const { wrap: async } = require('co');
var fn = require('./../utils/functions');
var deferred = require('./../utils/deferred.js');
var moment = require('moment');

exports.getAllLevels = function() {
    return fn.defer(fn.bind(Puzzle, 'getAllPuzzles'))().pipe(function(res) {
        return deferred.success(res);
    });
}

exports.preRegisterUser = function(userId) {
    return fn.defer(fn.bind(DoomoUser, 'createUser'))(userId).pipe(function(res) {
        console.log("Control" + res);
        return deferred.success(res);
    });
}

exports.getAllUserCount = function() {
    return fn.defer(fn.bind(DoomoUser, 'getUserCount'))().pipe(function(res) {
        return deferred.success(res);
    });
};

exports.getRandomCode = function(userId) {
    return fn.defer(fn.bind(DoomoCode, 'getAllCodes'))().pipe(function(res) {
        return deferred.success(res[Math.floor(Math.random() * res.length)]);
    });
}

exports.getAllCodes = function() {
    return fn.defer(fn.bind(DoomoCode, 'getAllCodes'))().pipe(function(res) {
        return deferred.success(res);
    });
}