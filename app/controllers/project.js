const Project = require('../repo/mongo/project.js');
const { wrap: async } = require('co');
var fn = require('./../utils/functions');
var deferred = require('./../utils/deferred.js');
var moment = require('moment');
var Utils = require('./../utils');

exports.getProjectDetails = function(data) {
    if (data == null || data.projectId == null) return deferred.success({});
    return fn.defer(fn.bind(Project, 'getProjectDetails'))({ projectId: data.projectId }).pipe(function(res) {
        res.shortDescription = Utils.trunc(res.shortDescription);
        return deferred.success(res);
    });
}
exports.getFeaturedProject = function() {
    return fn.defer(fn.bind(Project, 'getFeaturedProject'))().pipe(function(res) {
        res.shortDescription = Utils.trunc(res.shortDescription);
        return deferred.success(res);
    });
}

exports.getProjectOutlinePage = function() {
    return fn.defer(fn.bind(Project, 'getAllProjects'))().pipe(function(res) {
        return deferred.success(res);
    });
};


exports.getProjectOverviews = function(filters) {
    return fn.defer(fn.bind(Project, 'getAllProjects'))().pipe(function(projects) {
        for (i in projects) {
            projects[i] = constructPayload(projects[i], filters);
        }
        return deferred.success(projects);
    });
};

exports.getProjectFeaturedOverviews = function(filters) {
    return fn.defer(fn.bind(Project, 'getAllProjects'))().pipe(function(projects) {
        for (i in projects) {
            projects[i] = constructFeaturedPayload(projects[i]);
        }
        return deferred.success(projects);
    });
};



exports.getProjectFeaturedDetail = function(projectId) {
    return fn.defer(fn.bind(Project, 'getProjectDetails'))({ projectId: projectId }).pipe(function(proj) {
        return deferred.success(constructFeaturedPayload(proj));
    });
};

function constructPayload(project, filters) {
    if (filters.truncShortDesc) project.shortDescription = Utils.trunc(project.shortDescription, filters.truncShort);
    if (filters.truncHomeDesc) project.homeDescription = Utils.trunc(project.homeDescription, filters.truncHome);

    project.unitString = project.currentUnits + " " + (project.currentUnits == 1 ? project.currentUnitMeasure : project.currentUnitMeasure + "s");
    return project;
}

function constructFeaturedPayload(project) {
    var proj = {};
    proj.projectId = project.projectId;
    proj.isFeatured = project.isFeatured;
    return proj;
}