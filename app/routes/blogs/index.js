var express = require('express');
var router = express.Router();
var Utils = require('../../utils');
var blogController = require('../../controllers/blog');
var deferred = require('./../../utils/deferred');
var fn = require('./../../utils/functions');
var userController = require('../../controllers/user');
var donationController = require('../../controllers/donations');
var moment = require('moment');

router.get('/', function(req, res) {
    var count = req.query.count || 10;
    var offset = req.query.offset || 0;

    var def1 = {
        all: blogController.getBlogOverviews({}),
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount()
    };


    deferred.combine(def1).pipe(function(data) {
        var newdata = {
            blogs: data.all,
            stats: {
                donations: "Rs. " + Utils.getCommaSeparatedMoney(data.donationCount),
                followers: Utils.getCommaSeparatedNumber(data.userCount)
            }
        };

        res.render("blogs.ejs", newdata);
    });
});


router.get('/:blogId', function(req, res) {
    var blog_id = req.params.blogId;

    var def1 = {
        details: blogController.getBlogDetails({ blog_id }),
        recent: blogController.getBlogOverviews({}),
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount()
    };

    deferred.combine(def1).pipe(function(data) {
        var filterSimilar = {
            filter: { category_id: data.details.category_id },
            count: 5,
            offset: 0,
            sortBy: { 'timestamp': -1 }
        };


        var newdata = {
            details: data.details,
            recent: data.recent,
            stats: {
                donations: "Rs. " + Utils.getCommaSeparatedMoney(data.donationCount),
                followers: Utils.getCommaSeparatedNumber(data.userCount)
            }
        };

        blogController.getBlogOverviews(filterSimilar).pipe(function(similar) {
            newdata.similar = similar;
            res.render("blog-details.ejs", newdata);
        });
    });
});


module.exports = router;