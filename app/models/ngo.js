var mongoose = require('mongoose');

// define the schema for our user model
var ngoSchem = mongoose.Schema({

    ngo_id: String,
    ngo_name: String,
    timestamp_added: String
});


module.exports = mongoose.model('Ngo', ngoSchema);