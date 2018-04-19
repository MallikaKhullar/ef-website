var adBlocker = require('just-detect-adblock');
var express = require('express');
var router = express.Router();
var RouteHandler = require('../../handlers/route_handler');
var User = require('../../repo/mongo/user');
var ngoController = require('../../controllers/ngo');
var deferred = require('./../../utils/deferred');
var fn = require('./../../utils/functions');
var constants = require('./../../utils/carter_constants');
var moment = require('moment');
const prettyMs = require('pretty-ms');

/**
 *-------------------------------- ROUTES -----------------------------*
 */



//v1 route
router.get('/choose', function(req, res) {
    res.render("carter_choose.ejs", constants.choose);

});

router.get('/login', function(req, res) {
    res.render("carter_login.ejs", constants.login);
});

router.get('/home', function(req, res) {
    res.render("carter_home.ejs", constants.homepage);
});
router.get('/newtab', function(req, res) {
    res.render("carter_newtab.ejs", constants.newtab);
});
router.get('/project', function(req, res) {
    res.render("carter_project.ejs", constants.project);

});
router.get('/moveon', function(req, res) {
    res.render("carter_moveon.ejs", constants.moveon);

});



//v0, v1 route
router.get('/', function(req, res) {});

// //v0, v1 route
// router.get('/theme-toggle', function(req, res) {
//     var theme = req.query.currentTheme.replace(" ", "");
//     var index = constants.themes.indexOf(theme);
//     index++;
//     var newTheme = constants.themes[(index) % constants.themes.length];
//     userController.changeColorTheme(req.user.user_id, newTheme).pipe(function(data) {
//         res.send(newTheme);
//     });
// });

//v0, v1 route
// router.get('/theme-change', function(req, res) {
//     var newTheme = req.query.selectedTheme;
//     userController.changeColorTheme(req.user.user_id, newTheme).pipe(function(data) {
//         res.send(newTheme);
//     });
// });

// //v1 route
// router.get('/mask-search', function(req, res) {
//     userController.hideSearch(req.user.user_id).pipe(function(data) {});
// });

// //v1 route
// router.get('/mask-apps', function(req, res) {
//     userController.hideAppBar(req.user.user_id).pipe(function(data) {});
// });

// //v1 route
// router.get('/unmask-search', function(req, res) {
//     userController.showSearch(req.user.user_id).pipe(function(data) {});
// });

// //v1 route
// router.get('/unmask-apps', function(req, res) {
//     userController.showAppBar(req.user.user_id).pipe(function(data) {});
// });



/**
 *-------------------------------- UTILS -----------------------------*
 */




module.exports = router;