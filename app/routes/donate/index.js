var express = require('express');
var router = express.Router();
var userController = require('../../controllers/user');
var donationController = require('../../controllers/donations');
var causeController = require('../../controllers/cause');
var ngoController = require('../../controllers/ngo');
var moment = require('moment');

router.get('/', function(req, res) {
    var donation_id = "donation" + moment().format('x');

    if (req.user == undefined || req.user.hearts == undefined) {
        res.send("Donate complete");
        return;
    }

    donationController.createDump(req.user.hearts.current_week_hearts, donation_id, req.user.user_id, req.user.hearts.current_cause_id).pipe(function(data) {
        userController.donate(donation_id, req.user.user_id);
        res.send("Donate complete");
    });
});


module.exports = router;