var winston = require('winston');
var Pr = require('bluebird');
var Utils = require('../utils');

function RouteHandler() {}

RouteHandler.renderView = function(apiModule, req, res, next) {

    var params = Utils.retrieveRequestParams(req);
    winston.info("Route Handler called with params =>", convertParamsToServerLogObject(params));

    apiModule(params, res, next).then(function(unhandled) {

        if (unhandled) {
            winston.info("Request unhandled for url: ", Utils.getCompleteUrl(req));
            next();
        }

    }).catch(function(err) {
        //do something with the route handler error
    });
};

RouteHandler.serveActionResponse = function(apiModule, req, res, next) {
    var params = Utils.retrieveRequestParams(req);
    winston.info("API Called with params", convertParamsToServerLogObject(params));
    apiModule(params, res, next, req).then(function(responseObj) {
        res.send({
            status: 'success',
            message: null,
            result: responseObj
        });
    }).catch(function(err) {
        //handle error
    });
};


function convertParamsToServerLogObject(params) {
    var params1 = JSON.parse(JSON.stringify(params));
    if (params1.hidden.loggedUser) {
        params1.hidden.userId = params1.hidden.loggedUser.userId;
        delete params1.hidden.loggedUser;
    }
    return params1;
}

module.exports = RouteHandler;