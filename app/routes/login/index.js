var express = require('express');
var router = express.Router();
var RouteHandler = require('../../handlers/route_handler');

router.get('/', function(req, res) {
    var data = {
        user: req.user,
        stats: {
            donations: "$20730.0",
            followers: "3520"
        }
    };

    res.render("login_epic.ejs", data);
});



module.exports = router;