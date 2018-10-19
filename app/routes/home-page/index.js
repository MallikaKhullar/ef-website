var express = require('express');
var router = express.Router();
var RouteHandler = require('../../handlers/route_handler');
var ngoController = require('../../controllers/ngo');
var userController = require('../../controllers/user');
var donationController = require('../../controllers/donations');
var blogController = require('../../controllers/blog');
var doomoController = require('../../controllers/doomo');
var deferred = require('./../../utils/deferred');
var fn = require('./../../utils/functions');
var Utils = require('../../utils');
var projectController = require('../../controllers/project');


router.get('/submit-email', function(req, res) {
    if (req.query && req.query.email_id) {
        userController.insertPledge(req.query.email_id).pipe(function(data) {
            res.redirect('/new-tab');
        });
    } else res.redirect('/new-tab');
});


router.get('/', function(req, res) {

    var def = {
        ngos: ngoController.getAllNgos(),
        userCount: userController.getAllUserCount(),
        doomoUsers: doomoController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount(),
        allBlogs: blogController.getBlogOverviews({ count: 9, filter: { starred: true } }),
        projects: projectController.getProjectOverviews({})
    };

    deferred.combine(def).pipe(function(data) {

        var newdata = {
            ngos: data.ngos,
            stats: {
                donations: "Rs. " + Utils.getCommaSeparatedMoney(data.donationCount),
                followers: Utils.getCommaSeparatedNumber((data.userCount + data.doomoUsers))
            },
            blogs: data.allBlogs
        };

        newdata = Utils.appendProjects(newdata, data.projects);
        res.render("home.ejs", newdata);
    });
});




module.exports = router;