const Blog = require('../repo/mongo/blog.js');
const { wrap: async } = require('co');
var fn = require('./../utils/functions');
var deferred = require('./../utils/deferred.js');
var moment = require('moment');

exports.getBlogDetails = function(data, cb) {
    return fn.defer(fn.bind(Blog, 'getBlogDetails'))({ blog_id: data.blog_id }).pipe(function(res) {
        return deferred.success(res);
    });
}

exports.getBlogOutlinePage = function(filter) {
    return fn.defer(fn.bind(Blog, 'getAllBlogs'))(filter).pipe(function(res) {
        return deferred.success(res);
    });
};

exports.getBlogOverviews = function(filter) {
    return fn.defer(fn.bind(Blog, 'getAllBlogs'))(filter).pipe(function(blogs) {

        for (var i = 0; i < blogs.length; i++) blogs[i] = constructPayload(blogs[i]);

        return deferred.success(blogs);
    });
};

function constructPayload(blog) {
    return {
        blog_id: blog.blog_id,
        blog_title: blog.blog_title,
        title_photo_url: blog.title_photo_url,
        blog_short_desc: blog.blog_short_desc
    }
}