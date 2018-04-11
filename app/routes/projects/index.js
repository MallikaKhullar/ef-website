var express = require('express');
var router = express.Router();
var Utils = require('../../utils');
var deferred = require('./../../utils/deferred');
var fn = require('./../../utils/functions');
var projectController = require('../../controllers/project');
var moment = require('moment');
var userController = require('../../controllers/user');
var donationController = require('../../controllers/donations');

router.get('/', function(req, res) {
    var def1 = {
        projects: projectController.getProjectOverviews({}),
        donationCount: donationController.getAllDonationCount()
    };
    deferred.combine(def1).pipe(function(data) {
        var newdata = {
            projects: data.projects,
            stats: {
                donations: "Rs. " + Utils.getCommaSeparatedMoney(data.donationCount),
            }
        };
        res.render("projects.ejs", newdata);
    });
});


router.get('/:projectId', function(req, res) {
    var projectId = req.params.projectId;

    var def1 = {
        details: projectController.getProjectDetails({ projectId }),
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount()
    };

    deferred.combine(def1).pipe(function(data) {
        var newdata = {
            details: data.details,
            stats: {
                donations: "Rs. " + Utils.getCommaSeparatedMoney(data.donationCount),
                followers: Utils.getCommaSeparatedNumber(data.userCount)
            }
        };

        res.render(projectId + ".ejs", newdata);
    });
});


module.exports = router;