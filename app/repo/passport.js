var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var winston = require('winston');
var passport = require('passport');

var moment = require('moment');
var configAuth = require('config');
var User = require('../repo/mongo/user');


module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // FACEBOOK
    passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: configAuth.facebookAuth.profileFields
        },

        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {

                var findId = (profile.emails == undefined || profile.emails[0] == undefined) ? profile.id : profile.emails[0].value;

                // find the user in the database based on their facebook id / email
                User.findOne({ 'email': findId }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        console.log("FB log in => ", findId);
                        return done(null, user); // user found, return that user
                    } else {
                        console.log("FB Sign up =>", findId);
                        // if there is no user found with that facebook id, create them
                        var newUser = new User();

                        // set all of the facebook information in our user model
                        newUser.facebook_id = profile.id; // set the users facebook id                   
                        newUser.facebook_token = token; // we will save the token that facebook provides to the user                    
                        newUser.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.email = (profile.emails == undefined || profile.emails[0] == undefined) ? profile.id : profile.emails[0].value;
                        newUser.user_id = "user" + moment().format('x');
                        newUser.web_version = "0.0.1";
                        newUser.timestamp = moment().format('x');
                        newUser.state = "v1_uninitiated";
                        newUser.picture = profile.photos ? profile.photos[0].value : '/image/user.png';
                        newUser.color_theme = "unsplash";
                        newUser.hearts = {};
                        newUser.hearts.total_hearts = 0;
                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));


    // GOOGLE
    passport.use(new GoogleStrategy({
            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL,
        },
        function(token, refreshToken, profile, done) {
            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function() {

                // try to find the user based on their google id
                User.findOne({ 'email': profile.emails[0].value }, function(err, user) {

                    if (err) return done(err);

                    if (user) {
                        console.log("G+ Sign in =>", profile.emails[0].value);
                        return done(null, user); //if user exists in DB
                    } else {
                        console.log("G+ Sign up =>", profile.emails[0].value);

                        // if the user isnt in our database, create a new user
                        var newUser = new User();

                        // set all of the relevant information
                        newUser.google_id = profile.id;
                        newUser.google_token = token;
                        newUser.name = profile.displayName;
                        newUser.email = profile.emails[0].value; // pull the first email
                        newUser.timestamp = moment().format('x');
                        newUser.web_version = "0.0.1";
                        newUser.state = "v1_uninitiated";
                        newUser.user_id = "user" + moment().format('x');
                        newUser.color_theme = "unsplash";
                        newUser.picture = profile._json.image.url == null || profile._json.image.url == undefined ? "/image/user.png" : profile._json.image.url;
                        newUser.hearts = {};
                        newUser.hearts.total_hearts = 0;
                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
};