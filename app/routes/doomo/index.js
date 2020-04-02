var express = require('express');
var router = express.Router();
var Utils = require('../../utils');
var deferred = require('./../../utils/deferred');
var fn = require('./../../utils/functions');
var doomoController = require('../../controllers/doomo');
var userController = require('../../controllers/user');
var moment = require('moment');
var config = require('config');

router.post('/levels', function(req, res) {
    console.log("levels");

    var passKey = req.body.key;

    if (!passKey || passKey != config.doomokey) {
        res.status(401).send("Not authorized");
        return;
    }

    doomoController.getAllLevels().pipe(function(data) {
        res.status(200).send({ "levels": data });
    });
});


router.post('/levels_v2', function(req, res) {
    console.log("levels_v2");

    var passKey = req.body.key;

    if (!passKey || passKey != config.doomokey) {
        res.status(401).send("Not authorized");
        return;
    }

    doomoController.getAllLevels().pipe(function(data) {
        res.status(200).send({ "levels": data });
    });
});

router.post('/codes', function(req, res) {
    console.log("codes");

    var passKey = req.body.key;

    if (!passKey || passKey != config.doomokey) {
        res.status(401).send("Not authorized");
        return;
    }

    doomoController.getAllCodes().pipe(function(data) {
        res.status(200).send({ "codes": data });
    });
});
router.post('/randomcode', function(req, res) {
    console.log("randomcode");

    var passKey = req.body.key;

    if (!passKey || passKey != config.doomokey) {
        res.status(401).send("Not authorized");
        return;
    }

    doomoController.getRandomCode().pipe(function(data) {
        res.status(200).send(data);
    });
});

router.post('/preregister', function(req, res) {
    console.log("preregister");

    var passKey = req.body.key;
    var userId = req.body.userId;

    if (!passKey || passKey != config.doomokey) {
        res.status(401).send("Not authorized");
        return;
    }

    doomoController.preRegisterUser(userId).pipe(function(data) {
        res.json({ ok: true });
    });
});

router.post('/total-users', function(req, res) {
    console.log("totalusers");

    var passKey = req.body.key;

    if (!passKey || passKey != config.doomokey) {
        res.status(401).send("Not authorized");
        return;
    }
    userController.getAllUserCount().pipe(function(data) {
        res.status(200).send({ "1": data });
    });
});

module.exports = router;