var express = require('express');
var path = require('path');
//create the router object
var router = express.Router();

//home page with ejs
router.get('/new-tab', function(req, res) {
    //TODO: trigger call to database handler to increase #hearts
    res.render(path.join(__dirname, "../new-tab"));
});

//about page with ejs
router.get('/about-us', function(req, res) {
    res.render(path.join(__dirname, "../about"));
});

module.exports = router;