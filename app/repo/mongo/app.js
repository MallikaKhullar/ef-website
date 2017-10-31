var mongoose = require('mongoose');

var appsSchema = mongoose.Schema({
    app_name: String,
    app_redirect: String,
    img_url: String,
    category: { type: String, enum: ['Work', 'Google', 'Other'], index: true },
});


appsSchema.statics = {
    getAllApps: function(data, cb) {
        this.find({}).sort({ category: 1 }).lean().exec(cb);
    },

}

module.exports = mongoose.model('App', appsSchema);