var Pr = require('bluebird');
var _ = require('underscore');
var qs = require('qs');
var moment = require('moment');
var MobileDetect = require('mobile-detect');

function Utils() {}

Utils.prototype.secureUrl = function(url) {
    var secureUrl = "";
    if (url && url.length > 0) {
        if (url.indexOf('?') < 0)
            url += "?token=beab79361b893787a3dc19d0af16c0f0&authProvider=tinystep";
        else
            url += "&token=beab79361b893787a3dc19d0af16c0f0&authProvider=tinystep";
        secureUrl = url;
    }
    return secureUrl;
};

Utils.prototype.updateSessionData = function(sessionData, req, callback) {
    req.login(sessionData, function(err) {
        if (err) return console.log("updateSessionData Err: ", err);

        if (callback && typeof callback === 'function') {
            callback();
        }
    });
};

Utils.prototype.updateUserDataInSession = function(updateParams, req) {

    var currentUserData = null;

    if (!req ||
        !req.session ||
        !req.session.passport ||
        !req.session.passport.user ||
        !updateParams
    )
        return Pr.resolve(currentUserData);

    currentUserData = req.session.passport.user;

    var updateRequired = false;

    var toBeUpdatedUser = JSON.parse(JSON.stringify(currentUserData));

    if (updateParams && updateParams.firstName) {
        toBeUpdatedUser.firstName = updateParams.firstName;
        updateRequired = true;
    }

    if (updateParams && updateParams.name) {
        toBeUpdatedUser.name = updateParams.name;
        updateRequired = true;
    }

    if (updateParams && updateParams.uniqueName) {
        toBeUpdatedUser.uniqueName = updateParams.uniqueName;
        updateRequired = true;
    }

    if (updateParams && updateParams.email) {
        toBeUpdatedUser.email = updateParams.email;
        updateRequired = true;
    }

    if (updateParams && updateParams.userId) {
        toBeUpdatedUser.userId = updateParams.userId;
        updateRequired = true;
    }

    if (updateParams && updateParams.profilepic) {
        toBeUpdatedUser.profilepic = updateParams.profilepic;
        updateRequired = true;
    }

    if (updateParams && updateParams.referralCode) {
        toBeUpdatedUser.referralCode = updateParams.referralCode;
        updateRequired = true;
    }

    if (updateParams && updateParams.userType) {
        toBeUpdatedUser.userType = updateParams.userType;
        updateRequired = true;
    }

    if (updateParams && updateParams.isMale) {
        toBeUpdatedUser.isMale = updateParams.isMale;
        updateRequired = true;
    }

    if (typeof updateParams.isRegistrationComplete === "boolean") {
        toBeUpdatedUser.isRegistrationComplete = updateParams.isRegistrationComplete;
        updateRequired = true;
    }

    if (typeof updateParams.isAuthorized === "boolean") {
        toBeUpdatedUser.isAuthorized = updateParams.isAuthorized;
        updateRequired = true;
    }

    if (!updateRequired)
        return Pr.resolve(currentUserData);

    return new Pr(function(resolve, reject) {
        req.login(toBeUpdatedUser, function(err) {
            if (err)
                return reject(err);
            resolve(toBeUpdatedUser);
        });
    });
};

Utils.prototype.retrieveRequestParams = function(req) {

    var requestMethod = req.method.toLowerCase();
    var params = {};

    switch (requestMethod) {

        case 'get':
            params = _.extend(req.params, req.query);
            break;

        case 'post':
            params = _.extend(req.params, req.query);
            params.post = req.body;
            break;

        case 'put':
            params = _.extend(req.params, req.query);
            params.post = req.body;
            break;

        case 'delete':
            params = _.extend(req.params, req.query);
            params.post = req.body;
            break;

        case 'head':
            params = _.extend(req.params, req.query);
            break;
    }

    params.requestMethod = requestMethod;
    params.originalUrl = req.originalUrl;

    var md = new MobileDetect(req.headers['user-agent']);

    params.isMobile = (md.mobile() !== null);
    params.OSType = md.os();

    params.isAndroidOS = (md.os() === 'AndroidOS');
    params.isIOS = (md.os() === 'iOS');

    params.hidden = {
        loggedUser: req.session.passport ? req.session.passport.user : null
    };

    params.isTinystepWebView = req.get("tinystepWebView") ? true : false;

    // Add ip
    var IPs = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    if (IPs) {
        if (Object.prototype.toString.call(IPs) === '[object Array]') {

            if (IPs[0] && validator.isIP(IPs[0]))
                params.IP = IPs[0];

        } else if (Object.prototype.toString.call(IPs) !== '[object String]') {

            if (validator.isIP(IPs))
                params.IP = IPs[0];
        }
    }

    // Location from cookie
    if (req.cookies['location_set'] === 'true') {
        params.location = {
            lat: parseFloat(req.cookies['location_lat']),
            long: parseFloat(req.cookies['location_long']),
            locality: req.cookies['location_locality'],
            localityAddress: req.cookies['location_locality_address'],
            formattedAddress: req.cookies['location_formatted_address']
        };
    }

    // Session Id
    params.sessionId = JSON.parse(JSON.stringify(req.sessionID));
    return params;
};

Utils.prototype.getHumanizedTimestamp = function(milliSeconds, suffix) {

    if (milliSeconds && !isNaN(milliSeconds) && milliSeconds > 0) {
        return moment.duration(moment(milliSeconds, 'x').diff(moment()), 'ms').humanize(typeof suffix !== 'undefined' ? suffix : true);
    }
    return 0;
};

Utils.prototype.removeArrayElemDuplicates = function(originalArr) {

    var result = [];

    if (Object.prototype.toString.call(originalArr) !== '[object Array]' || originalArr.length === 0)
        return result;

    for (var i = 0; i < originalArr.length; i++) {
        if (result.indexOf(originalArr[i]) == -1)
            result.push(originalArr[i]);
    }

    return result;
};

Utils.prototype.capitalize = function(string) {
    string = (string == null) ? '' : (string + '');
    return string && (string.charAt(0).toUpperCase() + string.slice(1));
};

Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};

Utils.prototype.ellipsize = function(string, length) {
    if (string && string.length > length) {
        return string.substr(0, length) + "...";
    }
    return string;
};

function addParamsToPath(path, paramObj) {

    var newPath = path;
    if (path && path.length > 0) {
        for (var prop in paramObj) {
            if (paramObj.hasOwnProperty(prop)) {
                if (newPath.indexOf("?") != -1) {
                    newPath += ("&" + prop + "=" + paramObj[prop]);
                } else {
                    newPath += ("?" + prop + "=" + paramObj[prop]);
                }
            }
        }
    }

    return newPath;
}

Utils.prototype.getCompleteUrl = function(req) {
    return req.method + " " + req.protocol + ':// ' + req.get('host') + " " + req.originalUrl;
};

Utils.prototype.addGETParamsToUrl = function(url, params1, param1Val) {

    if (!url || url.length === 0)
        return url;

    var GETParams = {};
    var urlWithOutGETParams;

    if (url.indexOf('?') != -1) {
        urlWithOutGETParams = url.substr(0, url.indexOf('?'));
        GETParams = qs.parse(url.substr(url.indexOf('?') + 1, url.length));
    } else {
        urlWithOutGETParams = url;
    }

    GETParams[params1] = param1Val;
    return urlWithOutGETParams + '?' + qs.stringify(GETParams);
};

Utils.prototype.convertArrayBasedFilterFirstElemBasedFilter = function(filter) {

    if (!filter)
        return filter;

    filter = JSON.parse(JSON.stringify(filter));

    for (var prop in filter) {
        if (filter.hasOwnProperty(prop)) {
            if (Object.prototype.toString.call(filter[prop]) === '[object Array]') {

                if (filter[prop].length > 0) {
                    filter[prop] = filter[prop][0];
                } else {
                    delete filter[prop];
                }
            }
        }
    }
    return filter;
};

module.exports = new Utils();