var mongoose = require('mongoose');

// define the schema for our user model
var projectSchema = mongoose.Schema({
    projectId: { type: String, unique: true, required: true, index: true },
    projectTitle: String,
    isFeatured: { type: Boolean, default: false },
    photoUrl: String
});

projectSchema.statics = {
    getAllProjects: function(cb) {
        this.find({}).lean().exec(cb);
    },

    getProjectDetails: function(data, cb) {
        this.findOne({ projectId: data.projectId }).lean().exec(cb);
    }
}

module.exports = mongoose.model('Project', projectSchema);