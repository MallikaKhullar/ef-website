var express = require('express'),
    app = express(),
    port = 8081,
    database = require('./config/database'), // load the database config    
    mongoose = require('mongoose'), // mongoose for mongodb
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    router = require('./app/routes/index'),
    session = require('express-session'),
    helmet = require('helmet');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var redis   = require("redis");
var client  = redis.createClient();

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

require('./app/repo/passport')(passport);

//use helmet for web protection
app.use(helmet());

// required for passport
app.use(session({
    secret: 'deveshIsSexy',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  60000 * 24 * 30 * 100}),
    cookie: {maxAge: (60000 * 24 * 30 * 100)},
    saveUninitialized: false,
    resave: false
}));

//app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret TODO: where to get this from?
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//view engine is EJS
app.set('view engine', 'ejs');

//connect to the local database
mongoose.connect(database.localUrl);

// static files @ public folder
app.use(express.static(__dirname + '/public'));

require('./app/routes/index')(app, passport); // pass 'app'

//start the server
app.listen(port, function() {
    console.log("Epic Website Started...");
});
