const Project = require('../repo/mongo/project.js');
const { wrap: async } = require('co');
var fn = require('./../utils/functions');
var deferred = require('./../utils/deferred.js');
var moment = require('moment');
var Utils = require('./../utils');

exports.getProjectDetails = function(data, cb) {
    return fn.defer(fn.bind(Project, 'getProjectDetails'))({ projectId: data.projectId }).pipe(function(res) {
        res.shortDescription = Utils.trunc(res.shortDescription);
        return deferred.success(res);
    });
}

exports.getProjectOutlinePage = function() {
    return fn.defer(fn.bind(Project, 'getAllProjects'))().pipe(function(res) {
        return deferred.success(res);
    });
};


exports.getProjectOverviews = function() {
    return fn.defer(fn.bind(Project, 'getAllProjects'))().pipe(function(projects) {
        for (i in projects) {
            projects[i] = constructPayload(projects[i]);
        }
        return deferred.success(projects);
    });
};

function constructPayload(project) {
    project.shortDescription = Utils.trunc(project.shortDescription);
    project.unitString = project.currentUnits + " " + (project.currentUnits == 1 ? project.currentUnitMeasure : project.currentUnitMeasure + "s");
    return project;
}