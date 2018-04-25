var mongoose = require('mongoose');

// define the schema for our user model
var projectSchema = mongoose.Schema({
    projectId: { type: String, unique: true, required: true, index: true },
    projectTitle: String,
    isFeatured: { type: Boolean, default: false },
    showcasePhoto: String,
    secondaryMissionPhoto: String,
    playPhoto: String,
    actionTitle: String,
    shortDescription: String,
    forByLine: String,
    homeDescription: String,
    unitIcon: String,
    tabsForSingleUnit: Number,
    autoActionMessage: String,
    donateThanks: String,
    fullFeaturePhoto: String,
    currentUnitMeasure: String,
    cardStyle: String,
    primaryMissionPhoto: String,
    weeklyTargetTabs: Number,
    ngo: { //older ngos table is deprecated in v1
        ngoName: String,
        ngoUrl: String,
        ngoPhotoUrl: String
    },
    donateFTUE: {
        title: String,
        info: String
    }
});

projectSchema.statics = {
    getAllProjects: function(cb) {
        this.find({}).lean().exec(cb);
    },

    getProjectDetails: function(data, cb) {
        this.findOne({ projectId: data.projectId }).lean().exec(cb);
    },
    getFeaturedProject: function(cb) {
        this.findOne({ isFeatured: true }).lean().exec(cb);
    }
}

module.exports = mongoose.model('Project', projectSchema);