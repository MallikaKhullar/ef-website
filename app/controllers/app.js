const App = require('../repo/mongo/app.js');
var fn = require('./../utils/functions');
var deferred = require('./../utils/deferred.js');

exports.getAllApps = function(id) {
    return fn.defer(fn.bind(App, 'getAllApps'))({}).pipe(function(res) {
        console.log(res);
        return deferred.success(res);
    });
};