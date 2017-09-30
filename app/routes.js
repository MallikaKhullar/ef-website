var express = require('express');
var path = require('path');
//create the router object
var router = express.Router();

//route for the homepage
router.get("/", function(req, res) {
    res.send("hi");
});

//route for about epic page
router.get("/about-us", function(req, res) {
    res.sendFile(path.join(__dirname, "../about.html"))
});

//route for new-tab page
router.get("/new-tab", function(req, res) {
    res.sendFile(path.join(__dirname, "../new-tab.html"))
});


//route for contact page
router.post("/new-tab", function(req, res) {});

module.exports = router;