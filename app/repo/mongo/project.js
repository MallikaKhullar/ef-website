var mongoose = require('mongoose');

// define the schema for our user model
var projectSchema = mongoose.Schema({
    projectId: { type: String, unique: true, required: true, index: true },
    projectTitle: String,
    isFeatured: { type: Boolean, default: false },
    showcasePhoto: String,
    secondaryMissionPhoto: String,
    actionTitle: String,
    shortDescription: String,
    homeDescription: String,
    unitIcon: String,
    currentUnits: Number,
    currentUnitMeasure: String,
    primaryMissionPhoto: String,
    ngoId: String
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