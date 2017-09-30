var express = require('express'),
    app = express(),
    port = 8080,
    router = require('./app/routes');

//routing the app
app.use('/', router);

// static files @ public folder
app.use(express.static(__dirname + '/public'));

//start the server
app.listen(port, function() {
    console.log("Epic Website Started...");
});