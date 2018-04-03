const Project = require('../repo/mongo/project.js');
const { wrap: async } = require('co');
var fn = require('./../utils/functions');
var deferred = require('./../utils/deferred.js');
var moment = require('moment');

exports.getProjectDetails = function(data, cb) {
    return fn.defer(fn.bind(Project, 'getProjectDetails'))({ projectId: data.projectId }).pipe(function(res) {
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
        for (var i = 0; i < projects.length; i++) projects[i] = constructPayload(projects[i]);
        return deferred.success(projects);
    });
};

function constructPayload(project) {
    return {
        isFeatured: project.isFeatured,
        projectId: project.projectId,
        projectTitle: project.projectTitle,
        photoUrl: project.photoUrl

        // blog_id: blog.blog_id,
        // blog_title: blog.blog_title,
        // title_photo_url: blog.title_photo_url,
        // blog_short_desc: blog.blog_short_desc
    }
}