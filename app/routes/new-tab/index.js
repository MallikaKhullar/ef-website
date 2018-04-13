var adBlocker = require('just-detect-adblock');
var express = require('express');
var router = express.Router();
var RouteHandler = require('../../handlers/route_handler');
var User = require('../../repo/mongo/user');
var Utils = require('../../utils');
var userController = require('../../controllers/user');
var donationController = require('../../controllers/donations');
var causeController = require('../../controllers/cause');
var ngoController = require('../../controllers/ngo');
var deferred = require('./../../utils/deferred');
var fn = require('./../../utils/functions');
var constants = require('./../../utils/constants');
var moment = require('moment');
const prettyMs = require('pretty-ms');
var projectController = require('../../controllers/project');

/**
 *-------------------------------- ROUTES -----------------------------*
 */

//v0 route
router.get('/mission-selected', continueIfLoggedIn, function(req, res) {
    if (req.query && req.query.cause_id) {
        var start = moment().format('x'),
            end = Utils.getEndTime(start);
        userController.setCause(req.user.user_id, req.query.cause_id, start, end).pipe(function(data) {
            res.redirect('/new-tab');
        });
    } else res.redirect('/new-tab');
});

//v1 route (replaced the old choose mission)
router.get('/choose-mission', continueIfLoggedIn, function(req, res) {
    projectController.getProjectOverviews({ truncShortDesc: true, truncShort: 200 }).pipe(function(projects) {
        var data = {};
        data = Utils.appendProjects(data, projects);
        data.dailyImage = constants.images[Math.round(0) % constants.images.length];
        renderMoveOnPage(req.user);
    });
});

//v1 route
router.get('/project-selected', continueIfLoggedIn, function(req, res) {
    if (req.query && req.query.project_id) {

        //this call is only required to get info on if the project is featured or not
        //if it IS featured, then end time is TWO weeks, otherwise ONE week
        projectController.getProjectFeaturedDetail(req.query.project_id).pipe(function(proj) {

            var start = moment().format('x');
            var end = proj.isFeatured == true ? Utils.getTwoWeekTime(start) : Utils.getEndTime(start);

            //set project (start, end, project Id) into the user object
            userController.setProject(req.user.user_id, req.query.project_id, start, end).pipe(function(result) {
                res.redirect('/new-tab');
            });
        });
    } else res.redirect('/new-tab');
});

//v0, v1 route
router.get('/', continueIfLoggedIn, function(req, res) {
    if (redirectForNewUser(req.user, res)) return;

    switch (Utils.getUserVersion(req.user)) {
        default:
            case "v0":
            handlev0Users(req, res);
        return;
        case "v1":
                handlev1Users(req, res);
            return;
        case "v2":
                return;
    }
});

//v0, v1 route
router.get('/theme-toggle', function(req, res) {
    var theme = req.query.currentTheme.replace(" ", "");
    var index = constants.themes.indexOf(theme);
    index++;
    var newTheme = constants.themes[(index) % constants.themes.length];
    userController.changeColorTheme(req.user.user_id, newTheme).pipe(function(data) {
        res.send(newTheme);
    });
});

//v0, v1 route
router.get('/theme-change', function(req, res) {
    var newTheme = req.query.selectedTheme;
    userController.changeColorTheme(req.user.user_id, newTheme).pipe(function(data) {
        res.send(newTheme);
    });
});



/**
 *-------------------------------- CONTROLLERS -----------------------------*
 */

function renderMoveOnPage(user, res) {
    var def = {
        projects: projectController.getProjectOverviews({ truncShortDesc: true, truncShort: 70, truncHomeDesc: true, truncHome: 200 }),
        donations: donationController.getAllStats(user.user_id)
    };

    deferred.combine(def).pipe(function(data) {
        var newdata = {};
        newdata = Utils.appendProjects(newdata, data.projects);

        var causesIds = data.donations.map(a => a._id);
        causeController.getAllCausesByIds(causesIds).pipe(function(allCauses) {
            for (i in allCauses) {
                allCauses[i].user_progress = findUserProgress(data.donations, allCauses[i].cause_id);
            }
            newdata.causes = allCauses;
            res.render("move-on.ejs", newdata);
        });
    });
}

function redirectForNewUser(user, res) {
    if (hasExpired(user)) {
        renderMoveOnPage(user, res);
        return true;
    }
    return false;
}

function handlev1Users(req, res) {

    var def = {
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount(),
        currentProject: projectController.getProjectDetails({ projectId: req.user.project.project_id })
    };

    deferred.combine(def).pipe(function(data) {
        v1_constructPayload({
            user: req.user,
            numDonations: data.donationCount,
            numUsers: data.userCount,
            currentProject: data.currentProject,
            req: req
        }).pipe(function(result) {
            res.render("project-new-tab.ejs", result);
        });
    });

    userController.incrementHearsById(req.user.id);
}

function handlev0Users(req, res) {

    var def = {
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount(),
        currentCause: causeController.getCauseFromId(req.user.hearts.current_cause_id),
        previousCause: causeController.getCauseFromId(req.user.previous_donation.previous_cause_id)
    };

    deferred.combine(def).pipe(function(data) {

        v0_constructPayload({
            user: req.user,
            cause: data.currentCause,
            numDonations: data.donationCount,
            numUsers: data.userCount,
            previousCause: data.previousCause,
            req: req,
        }).pipe(function(result) {

            res.render("new-tab.ejs", result);
        });
    });

    userController.incrementHearsById(req.user.id);
}


/**
 *-------------------------------- UTILS -----------------------------*
 */

function findUserProgress(causes, id) {
    for (i in causes) {
        if (causes[i]._id == id) return causes[i].hearts;
    }
}

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

function getFirstAlphabet(str) {
    for (var i = 0; i < str.length; i++) {
        if (str[i] >= 'A' && str[i] <= 'z') return str[i];
    }
    return '*';
}

function constructQuery(query) {
    var mostVisited = [];

    if (query == undefined || !query.hasOwnProperty('urls') || !query.hasOwnProperty('titles') || query.urls.constructor !== Array || query.titles.constructor !== Array) return mostVisited;

    for (i in query.urls) {
        if (i > query.titles.length || query.urls[i] == undefined || query.titles[i] == undefined) return mostVisited;
        mostVisited.push({ "url": query.urls[i], "title": query.titles[i].split('+').join(' ').slice(0, 15) + " ...", "icon": getFirstAlphabet(query.titles[i]) });
    }
    return mostVisited;
}

function v0_constructPayload(data) {
    var redirected = data.req != undefined && data.req.query != undefined && data.req.query.redirect != undefined ? JSON.parse(data.req.query.redirect.toLowerCase()) : false;

    var hoursToGo = Utils.timePeriodInHours(data.user.hearts.target_end_time, moment().format('x'));
    var remainingTime = hoursToGo >= 24 ? (hoursToGo / 24 > 1 ? Math.floor(hoursToGo / 24) + " days " : Math.floor(hoursToGo / 24) + " day ") :
        (hoursToGo > 1 ? Math.floor(hoursToGo) + " hours " : "1 hour ");

    if (data.cause && data.cause.total_hearts) {
        var progress = Utils.calculateProgress(data.user.hearts.current_week_hearts, data.cause.total_hearts);
        data.user.progress = progress;
    }

    var shortRemaining = prettyMs(data.user.hearts.target_end_time - moment().format('x'), { compact: true });

    var newdata = {
        user: data.user,
        cause: data.cause,
        previousCause: data.previousCause || {},
        stats: {
            donations: "Rs. " + Utils.getCommaSeparatedMoney(data.numDonations),
            followers: Utils.getCommaSeparatedNumber(50 + data.numUsers),
            remainingTime: remainingTime,
            shortRemaining: shortRemaining.replace("~", "")
        },
        redirected: redirected
    };


    var total_hearts_text = data.user.hearts.total_hearts == 1 ? " heart" : " hearts";

    var daysPassed = Utils.timePeriodInDays(moment().format('x'), data.user.timestamp);

    newdata.timeElapsed = moment().format('x') > data.user.hearts.target_end_time;
    newdata.dailyImage = constants.images[Math.round(daysPassed) % constants.images.length];
    newdata.user.first_name = Utils.firstName(newdata.user.name);
    newdata.user.picture = (newdata.user.picture == null || newdata.user.picture == undefined) ? "/image/user.png" : newdata.user.picture;
    newdata.user.hearts.total_hearts_text = data.user.hearts.total_hearts + total_hearts_text;


    if (data.user.state == 'cause_selection_pending') {
        return ngoController.getNgosFromCauseId(data.previousCause.cause_id).pipe(function(res) {
            newdata.previousCause.ngoList = res;
            return deferred.success(newdata);
        });
    }

    if (newdata.timeElapsed) {
        newdata.user.state = "donate_pending";
        return ngoController.getNgosFromCauseId(data.cause.cause_id).pipe(function(res) {
            newdata.cause.ngoList = res;
            return deferred.success(newdata);
        });

    } else return deferred.success(newdata);
}

function v1_constructPayload(data) {

    var hoursToGo = Utils.timePeriodInHours(data.user.project.target_end_time, moment().format('x'));
    var remainingTime = hoursToGo >= 24 ? (hoursToGo / 24 > 1 ? Math.floor(hoursToGo / 24) + " days " : Math.floor(hoursToGo / 24) + " day ") :
        (hoursToGo > 1 ? Math.floor(hoursToGo) + " hours " : "1 hour ");

    //TODO - figure this shit out - progress for mission

    // if (data.cause && data.cause.total_hearts) {
    //     var progress = Utils.calculateProgress(data.user.hearts.current_week_hearts, data.cause.total_hearts);
    //     data.user.progress = progress;
    // }

    var shortRemaining = prettyMs(data.user.project.target_end_time - moment().format('x'), { compact: true });

    var newdata = {
        user: data.user,
        project: data.project,
        previousProjet: data.previousProject || {},
        stats: {
            donations: "Rs. " + Utils.getCommaSeparatedMoney(data.numDonations),
            remainingTime: remainingTime,
            shortRemaining: shortRemaining.replace("~", "")
        },
    };

    var daysPassed = Utils.timePeriodInDays(moment().format('x'), data.user.timestamp);
    newdata.dailyImage = constants.images[Math.round(daysPassed) % constants.images.length];

    newdata.timeElapsed = moment().format('x') > data.user.project.target_end_time;
    newdata.user.first_name = Utils.firstName(newdata.user.name);
    newdata.user.picture = (newdata.user.picture == null || newdata.user.picture == undefined) ? "/image/user.png" : newdata.user.picture;
    if (newdata.timeElapsed) newdata.user.state = "v1_donate_pending"; //during v1_week_ongoing, time elapsed

    newdata.project = data.currentProject;

    return deferred.success(newdata);
}

function continueIfLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

function hasExpired(user) {
    if (hasWeekElapsed(user) && Utils.getUserVersion(user) == "v0") return true;
    return false;
}

function hasWeekElapsed(user) {
    if (user.state != "week_ongoing" || //if user is in any other donation state
        moment().format('x') > user.hearts.target_end_time) //or if week is ongoing but time just elapsed
        return true;
    return false;
}

module.exports = router;