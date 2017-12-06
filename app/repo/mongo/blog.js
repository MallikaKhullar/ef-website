var mongoose = require('mongoose');

var paragraphSchema = mongoose.Schema({
    image_url: String,
    image_caption: String,
    paragraph_title: String,
    paragraph_text: String
}, { _id: false });


// define the schema for our user model
var blogSchema = mongoose.Schema({
    blog_id: { type: String, unique: true, required: true, index: true },
    blog_title: String,
    blog_short_desc: String,
    title_photo_url: String,
    category_id: { type: String, index: true },
    category_name: String, //can be backfilled when category updated
    author_name: String,
    timestamp: { type: Number, required: true, index: true },
    paragraphs: [paragraphSchema],
    visible: Boolean
});
blogSchema.statics = {
    getAllBlogs: function(data, cb) {
        var count = data.count || 5;
        var offset = data.offset || 0;
        var sortBy = data.sortBy || "none";
        var filter = data.filter || {};
        filter.visible = true;

        this.find(filter)
            .sort(sortBy !== 'none' ? sortBy : { 'timestamp': -1 })
            .skip(offset).limit(count)
            .lean().exec(cb);
    },

    getBlogDetails: function(data, cb) {
        this.findOne({ blog_id: data.blog_id }).lean().exec(cb);
    }
}

module.exports = mongoose.model('Blog', blogSchema);