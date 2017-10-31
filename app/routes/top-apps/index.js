var express = require('express');
var router = express.Router();
var RouteHandler = require('../../handlers/route_handler');
var appController = require('../../controllers/app');

router.get('/', function(req, res) {
    appController.getAllApps().pipe(function(data) {
        var pagedata = {
            data: data
        };
        res.render("top-apps.ejs", pagedata);
    });
});

module.exports = router;