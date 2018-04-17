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
var newTabController_v1 = require('../../controllers/new-tab-endpoint-controller');
var newTabController_v0 = require('../../controllers/v0-new-tab-endpoint-controller');

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

//v0 route 
router.get('/choose-mission', continueIfLoggedIn, function(req, res) {
    projectController.getProjectOverviews({ truncShortDesc: true, truncShort: 200 }).pipe(function(projects) {
        var data = {};
        data = Utils.appendProjects(data, projects);
        data.dailyImage = constants.images[Math.round(0) % constants.images.length];
        newTabController_v1.render_shiftUsersToV1(req.user);
    });
});

//v1 route
router.get('/choose-project', continueIfLoggedIn, function(req, res) {
    projectController.getProjectOverviews({ truncShortDesc: true, truncShort: 200 }).pipe(function(projects) {
        var data = {};
        data = Utils.appendProjects(data, projects);
        data.dailyImage = constants.images[Math.round(0) % constants.images.length];
        res.render("select-cause.ejs", data);
    });
});

//v1 route
router.get('/project-selected', continueIfLoggedIn, function(req, res) {
    if (req.query && req.query.cause_id) {

        //this call is only required to get info on if the project is featured or not
        //if it IS featured, then end time is TWO weeks, otherwise ONE week
        projectController.getProjectFeaturedDetail(req.query.cause_id).pipe(function(proj) {

            var start = moment().format('x');
            var end = proj.isFeatured == true ? Utils.getTwoWeekTime(start) : Utils.getEndTime(start);

            //set project (start, end, project Id) into the user object
            userController.setProject(req.user.user_id, req.query.cause_id, start, end).pipe(function(result) {
                res.redirect('/new-tab');
            });
        });
    } else res.redirect('/new-tab');
});

//v0, v1 route
router.get('/', continueIfLoggedIn, function(req, res) {

    switch (req.user.state) {
        case 'v1_week_ongoing':
            if (moment().format('x') > req.user.project.target_end_time) { //time elapsed
                console.log("*1");
                newTabController_v1.render_weekOngoing_v1(req, res, true); //TODO - also call user controller to change state to donate pending
                return;
            } else {
                console.log("*2");
                newTabController_v1.render_weekOngoing_v1(req, res, false);
                return;
            }

        case 'v1_uninitiated':
        case 'uninitiated':
            console.log("*3");
            newTabController_v1.render_autoAssignNewProject(req, res, true);
            return;

        case 'v1_cause_selection_pending':
        case 'v1_donate_pending':
            if (donatePendingForMoreThanDay(req.user)) {
                console.log("*4");
                newTabController_v1.render_autoAssignNewProject(req, res, false);
                return;
            } else {
                console.log("*5");
                newTabController_v1.render_weekOngoing_v1(req, res, false);
            }
            return true;


        case "week_ongoing":

            if (Utils.hasExpired(req.user)) {
                console.log("*6");
                newTabController_v1.render_shiftUsersToV1(req.user, res);
                return true;
            } else {
                console.log("*7");
                newTabController_v0.render_weekOngoing_v0(req, res);
                return true;
            }

        case 'donate_pending':
        case 'cause_selection_pending':
            console.log("*8");
            newTabController_v1.render_shiftUsersToV1(req.user, res);
            return true;
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

//v1 route
router.get('/mask-search', function(req, res) {
    userController.hideSearch(req.user.user_id).pipe(function(data) {});
});

//v1 route
router.get('/mask-apps', function(req, res) {
    userController.hideAppBar(req.user.user_id).pipe(function(data) {});
});

//v1 route
router.get('/unmask-search', function(req, res) {
    userController.showSearch(req.user.user_id).pipe(function(data) {});
});

//v1 route
router.get('/unmask-apps', function(req, res) {
    userController.showAppBar(req.user.user_id).pipe(function(data) {});
});



/**
 *-------------------------------- UTILS -----------------------------*
 */


function continueIfLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

function donatePendingForMoreThanDay(user) {
    return Utils.isMoreThanDay(moment().format('x'), user.project.target_end_time);
}
module.exports = router;