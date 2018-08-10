var express = require('express');
var router = express.Router();
var Utils = require('../../utils');
var deferred = require('./../../utils/deferred');
var fn = require('./../../utils/functions');
var doomoController = require('../../controllers/doomo');
var userController = require('../../controllers/user');
var moment = require('moment');

router.get('/levels', function(req, res) {
    console.log("levels");
    doomoController.getAllLevels().pipe(function(data) {
        res.status(200).send({ "levels": data });
    });
});
router.get('/codes', function(req, res) {
    console.log("codes");
    doomoController.getAllCodes().pipe(function(data) {
        res.status(200).send({ "codes": data });
    });
});
router.get('/randomcode', function(req, res) {
    console.log("randomcode");
    doomoController.getRandomCode().pipe(function(data) {
        res.status(200).send(data);
    });
});

router.post('/preregister', function(req, res) {
    console.log("preregister");

    var passKey = req.body.key;
    var userId = req.body.userId;

    if (!passKey || passKey != "n30ch3rry5008th") {
        res.status(401).send("Not authorized");
        return;
    }

    doomoController.preRegisterUser(userId).pipe(function(data) {
        res.json({ ok: true });
    });
});

router.get('/totalUsers', function(req, res) {
    console.log("totalusers");

    userController.getAllUserCount().pipe(function(data) {
        res.status(200).send({ "1": data });
    });
});

module.exports = router;