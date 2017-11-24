var express = require('express');
var router = express.Router();
var userController = require('../../controllers/user');
var donationController = require('../../controllers/donations');
var causeController = require('../../controllers/cause');
var ngoController = require('../../controllers/ngo');
var moment = require('moment');

router.get('/', function(req, res) {
    console.log("Donate endpoint called");
    var donation_id = "donation" + moment().format('x');
    donationController.createDump(req.user.hearts.current_week_hearts, donation_id, req.user.user_id, req.user.hearts.current_cause_id).pipe(function(data) {
        console.log("Dump created, calling user donate ...");
        userController.donate(donation_id, req.user.user_id);
        res.send("Donate complete");
    });
});


module.exports = router;