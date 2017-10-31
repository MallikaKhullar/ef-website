var express = require('express');
var router = express.Router();
var RouteHandler = require('../../handlers/route_handler');
var appController = require('../../controllers/app');

router.get('/', function(req, res) {
    appController.getAllApps().pipe(function(data) {
        res.render("top-apps.ejs", data);
    });
});

module.exports = router;