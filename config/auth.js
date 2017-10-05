// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth': {
        'clientID': '197971190828325', // your App ID
        'clientSecret': 'c1eb191f545f918fcae838da89e432b1', // your App Secret
        'callbackURL': 'http://localhost:8080/auth/facebook/callback',
        'profileFields': ['emails', 'birthday', 'name', 'gender', 'location']
    },

    'googleAuth': {
        'clientID': 'your-secret-clientID-here',
        'clientSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:8080/auth/google/callback'
    }
};