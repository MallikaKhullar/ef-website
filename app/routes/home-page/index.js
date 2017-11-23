var express = require('express');
var router = express.Router();
var RouteHandler = require('../../handlers/route_handler');
var ngoController = require('../../controllers/ngo');

router.get('/', function(req, res) {
    ngoController.getAllNgos().pipe(function(data) {
        res.render("home.ejs", { ngos: data });
    });
});

module.exports = router;