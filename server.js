var express = require('express'),
    app = express(),
    port = 8080,
    database = require('./config/database'), // load the database config    
    router = require('./app/routes'),
    mongoose = require('mongoose'); // mongoose for mongodb


//routing the app
app.use('/', router);

//connect to the local database
mongoose.connect(database.localUrl);

// static files @ public folder
app.use(express.static(__dirname + '/public'));

//start the server
app.listen(port, function() {
    console.log("Epic Website Started...");
});