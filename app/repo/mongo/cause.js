var mongoose = require('mongoose');

// define the schema for our user model
var causeSchema = mongoose.Schema({

    cause_id: String,
    cause_name: String,
    timestamp_added: String
});


module.exports = mongoose.model('Cause', causeSchema);