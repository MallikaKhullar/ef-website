var userController = require('./user');
var donationController = require('./donations');
var causeController = require('./cause');
var projectController = require('./project');
var deferred = require('./../utils/deferred');
var fn = require('./../utils/functions');
var constants = require('./../utils/constants');
var moment = require('moment');
var Utils = require('./../utils');
const prettyMs = require('pretty-ms');

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

function appendProjectDeadlines(data) {

    var hoursToGo = Utils.timePeriodInHours(data.user.project.target_end_time, moment().format('x'));
    var remainingTime = hoursToGo >= 24 ? (hoursToGo / 24 > 1 ? Math.floor(hoursToGo / 24) + " days " : Math.floor(hoursToGo / 24) + " day ") :
        (hoursToGo > 1 ? Math.floor(hoursToGo) + " hours " : "1 hour ");

    var shortRemaining = prettyMs(Math.max(data.user.project.target_end_time - moment().format('x'), 1000), { compact: true });

    return {
        stats: {
            donations: "Rs. " + Utils.getCommaSeparatedMoney(data.numDonations),
            remainingTime: remainingTime,
            shortRemaining: shortRemaining.replace("~", "")
        }
    };
}

function appendProjectProgress(data) {

    if (data.project.weeklyTargetTabs) {
        var progress = Utils.calculateProgress(data.user.project.tabs, data.project.weeklyTargetTabs);
        data.user.progress = progress;
        console.log("progress", progress, "% ", data.user.project.tabs, data.project.weeklyTargetTabs);
    }
    return data;
}

function appendBackgroundImage(newdata) {
    var daysPassed = Utils.timePeriodInDays(moment().format('x'), newdata.user.timestamp);
    newdata.dailyImage = constants.images[Math.round(daysPassed) % constants.images.length];
    return newdata;
}

function v1_constructPayload(data) {
    data = appendProjectProgress(data);

    var newdata = appendProjectDeadlines(data);


    newdata.user = data.user;
    newdata.project = data.project;
    newdata.previousProjet = data.previousProject || {};
    newdata = appendBackgroundImage(newdata);


    newdata.user.first_name = Utils.firstName(newdata.user.name);
    newdata.user.picture = (newdata.user.picture == null || newdata.user.picture == undefined) ? "/image/user.png" : newdata.user.picture;
    if (Utils.hasTimeElapsedSince(data.user.project.target_end_time) && newdata.user.state.includes("week")) {
        userController.setDonatePending(data.user.user_id);
    }

    newdata.project = data.project;

    if (newdata.user.state == "v1_cause_selection_pending") {

        //i've lost details of the current donation that i just made
        //need that data for stuff like "You just donated 5 helpdesks"
        //so i'll need to pull the last project
        return projectController.getProjectDetails({ projectId: newdata.user.project.project_id }).pipe(function(last_proj) {
            try {
                newdata.project.unitsCreated = eval((newdata.user.last_project.tabs) + "" + last_proj.conversionFormula) + 1;
                newdata.project.unitsCreated = newdata.project.unitsCreated.toFixed(1);
                newdata.project.unitrep = (newdata.project.unitsCreated == 1.00 ? last_proj.currentUnitMeasure : last_proj.currentUnitMeasure + "s")
            } catch (err) {
                newdata.project.unitsCreated = 0;
                newdata.project.unitrep = "items";
            }

            return deferred.success(newdata);
        });
    }

    if (newdata.user.state == "v1_donate_pending") {
        try {
            newdata.project.unitsCreated = eval((newdata.user.project.tabs) + "" + data.project.conversionFormula) + 1;
            newdata.project.unitsCreated = newdata.project.unitsCreated.toFixed(1);
            newdata.project.unitrep = (newdata.project.unitsCreated == 1.00 ? data.project.currentUnitMeasure : data.project.currentUnitMeasure + "s")
        } catch (err) {
            newdata.project.unitsCreated = 0;
            newdata.project.unitrep = "items";
        }
    }

    return deferred.success(newdata);
}


exports.render_shiftUsersToV1 = function(user, res) {
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
            console.log("FINAL OBJECT", newdata);
            res.render("move-on.ejs", newdata);
        });
    });
}

exports.render_weekOngoing_v1 = function(req, res, setAsDonatePending) {
    userController.incrementTabsById(req.user.id);
    if (setAsDonatePending) userController.setDonatePending(req.user.user_id);

    var def = {
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount(),
        currentProject: projectController.getProjectDetails({ projectId: req.user.project.project_id })
    };

    deferred.combine(def).pipe(function(data) {
        console.log("2");
        v1_constructPayload({
            user: req.user,
            numDonations: data.donationCount,
            numUsers: data.userCount,
            project: data.currentProject,
            req: req,
        }).pipe(function(result) {
            result.showMissionSelectedPopup = false;
            console.log("FINAL OBJECT", result);
            res.render("project-new-tab.ejs", result);
        });
    });
}

exports.render_weekOngoing_v0 = function(req, res) {

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
            console.log("FINAL OBJECT", result);
            res.render("new-tab.ejs", result);
        });
    });
}

exports.render_autoAssignNewProject = function(req, res, showMissionSelectedPopup) {
    console.log("auoassign");
    userController.incrementTabsById(req.user.id);

    var def = {
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount(),
        currentProject: projectController.getFeaturedProject() //for new users, assign them featured project
    };

    deferred.combine(def).pipe(function(data) {

        var start = moment().format('x');
        var end = Utils.getTwoWeekTime(start);
        userController.setProject(req.user.user_id, data.currentProject.projectId, start, end).pipe(function(proj) {

            // req.user.state = "v1_week_ongoing";

            v1_constructPayload({
                user: req.user,
                numDonations: data.donationCount,
                numUsers: data.userCount,
                project: data.currentProject,
                req: req,
            }).pipe(function(result) {
                result.showMissionSelectedPopup = showMissionSelectedPopup;
                console.log("FINAL OBJECT", result);
                console.log("austosdsds");
                res.render("project-new-tab.ejs", result);
            });
        });
    });
}