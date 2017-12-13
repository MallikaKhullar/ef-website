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
    var type = req.query.type || "all";
    var page = req.query.page || 0;
    var count = 9;
    var offset = page * count;

    var def1 = {
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount()
    };

    var params = {
        count: count,
        offset: offset
    };

    if (type !== "all") {
        params.filter = { "category_id": type };
        def1.category = blogController.getCategoryDetails({ category_id: type });
    }

    def1.all = blogController.getBlogOverviews(params);
    def1.blogCount = blogController.getBlogCountForCategory(type);

    deferred.combine(def1).pipe(function(data) {
        var newdata = {
            blogs: data.all,
            stats: {
                donations: "Rs. " + Utils.getCommaSeparatedMoney(data.donationCount),
                followers: Utils.getCommaSeparatedNumber(data.userCount)
            },
            currentPage: page,
            currentCategoryId: type,
            endOfPagination: (data.blogCount <= offset + count)
        };

        if (data.category) newdata.category = data.category;
        console.log(newdata);

        res.render("blogs.ejs", newdata);
    });
});


router.get('/:blogId', function(req, res) {
    var blog_id = req.params.blogId;

    var def1 = {
        details: blogController.getBlogDetails({ blog_id }),
        recent: blogController.getBlogOverviews({ filter: { blog_id: { $nin: [blog_id] } }, count: 3 }),
        userCount: userController.getAllUserCount(),
        donationCount: donationController.getAllDonationCount()
    };


    deferred.combine(def1).pipe(function(data) {
        var filterSimilar = {
            filter: { category_id: data.details.category_id, blog_id: { $nin: [blog_id] } },
            count: 3,
            offset: 0,
            sortBy: { 'timestamp': -1 },
            exclude_id: blog_id
        };

        data.details.timestamp = Utils.getHumanizedTimestamp(data.details.timestamp * 1000);

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